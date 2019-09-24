<?php

namespace App\Http\Controllers;
use App\Blog;
use App\BlogCategory;
use App\BlogTag;
use Illuminate\Support\Facades\Session;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use App\Http\Traits\ImageTrait;

use Illuminate\Http\Request;

class BlogController extends Controller
{
    use ImageTrait;
    
    public function show(request $r){

        $blogs = Blog::orderBy('updated_at','desc')->where('title' ,'like' , '%'.$r->get('name').'%')->get();

        if($r->delete != null ){
            $delete = Blog::findOrFail($r->delete);
        }else{
            $delete = null;
        }

        return view('backend.blog.show')->with('blogs',$blogs)
        ->with('delete',$delete);

    }

    public function create(){

        $categories = BlogCategory::all()->pluck('name', 'id');
        $tags = BlogTag::all()->pluck('name', 'id');
        $allBlogs = Blog::all()->pluck('title', 'id');
        $metaFields = config('go.blog_meta');
        $cards = \App\Card::all()->pluck('name', 'id');

        return view('backend.blog.create', compact( 'tags', 'categories', 'metaFields', 'allBlogs', 'cards' ));
    }

    public function edit($id){
        
        $blog = Blog::findOrFail($id);

        $categories = BlogCategory::all()->pluck('name', 'id');
        $tags = BlogTag::all()->pluck('name', 'id');

        $allBlogs = Blog::all()->pluck('title', 'id');
        $cards = \App\Card::all()->pluck('name', 'id');

        $metaFields = config('go.blog_meta');
        $meta = $blog->getMeta();
        
        // dd($meta);

        if($blog->thumb != null)
            $featuredImg = Storage::disk('s3')->url($blog->thumb);
        else
            $featuredImg = "https://via.placeholder.com/960x350/162a41/FFFFFF?text=".$blog->title;

        return view('backend.blog.edit')->with('blog',$blog)
                ->with('tags', $tags)
                ->with('categories', $categories)
                ->with('metaFields', $metaFields)
                ->with('meta', $meta)
                ->with('allBlogs', $allBlogs)
                ->with('cards', $cards)
                ->with('featuredImg', $featuredImg);
    }

    public function store(){

        $request = request();

        $request->validate([
            'thumb' => 'max:15360|mimes:jpeg,png,jpg,gif,svg',
        ]);


        if($request->image1 != null){
            $request->image1 = $this->saveS3Image( $request->file('image1') );
        }

        if($request->image2 != null){
            $request->image2 = $this->saveS3Image( $request->file('image2'), 'medium_' );
        }

        if($request->thumb != null){
            $request->thumb = $this->saveS3Image( $request->file('thumb'), 'thumb_' );
        }


        if($request->description != null){
            $detail = summernotesConversion($request->description);
        }else{
            $detail = null;
        }

        if($request->content1 != null){
            $detail2 = summernotesConversion($request->content1);
        }else{
            $detail2 = null;
        }
        
        $blog = Blog::create([
                            'title' => $request->title,
                            'category_id' => $request->category_id,
                            'author_id' => \Auth::user()->id,
                            'description' => $detail,
                            'status_id' => $request->status_id,
                            'content1' => $detail2,
                            'active' => 'Active',
                            'image1' => $request->image1,
                            'image2' => $request->image2,
                            'thumb' => $request->thumb,
                            'slug' => $request->slug,
                            'deleted_at' => '',
                            'meta_title' => $request->meta_title
                        ]);

        $blog->tags()->sync($request->input('tags', []));

        $blog->categories()->sync($request->input('categories', []));

        $blog->updateMeta( $request->input('meta',[]) );

        Session::flash('success' , 'Blog post added successfully');
        return redirect()->route('blog.show');
    }

    public function update(){

        $request = request();
        
        $request->validate([
            'thumb' => 'max:15360|mimes:jpeg,png,jpg,gif,svg',
        ]);

        $new_blog = Blog::find($request->blog_id);

        // if($request->thumb != null){
        //     $file = $request->file('thumb');
        //     $filePath = 'web/articles/'.$file->getClientOriginalName();
        //     Storage::disk('s3')->put($filePath, file_get_contents($file));
        //     $new_blog->thumb=$filePath;
        // }
        
        if($request->image1 != null){
            $new_blog->image1 = $this->saveS3Image( $request->file('image1') );
        }

        if($request->image2 != null){
            $new_blog->image2 = $this->saveS3Image( $request->file('image2'), 'medium_' );
        }

        if($request->thumb != null){
            $new_blog->thumb = $this->saveS3Image( $request->file('thumb'), 'thumb_' );
        }


        if($request->description != null){
            $detail = summernotesConversion($request->description);
        }else{
            $detail = null;
        }

        if($request->content1 != null){
            $detail2 = summernotesConversion($request->content1);
        }else{
            $detail2 = null;
        }

        $new_blog->category_id = $request->category_id;
        $new_blog->title = $request->title;
        $new_blog->description = $detail;
        $new_blog->slug = $request->slug;
        $new_blog->content1 = $detail2;
        $new_blog->status_id = $request->status_id;
        $new_blog->meta_title = $request->meta_title;

        $new_blog->save();

        $new_blog->tags()->sync($request->input('tags', []));
        $new_blog->categories()->sync($request->input('categories', []));

        $new_blog->updateMeta( $request->input('meta',[]) );

        Session::flash('success', 'Blog post updated successfully');
        return redirect()->route('blog.show');
    }


    public function delete($id){
        $blog = Blog::where('id', $id);
        $blog->delete();
        Session::flash('success', 'Blog has been deleted successfully');
    
        return redirect()->route('blog.show');
    }
}
