<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BlogCategory;
use App\Http\Requests\StoreBlogCategoryRequest;
use App\Http\Requests\UpdateBlogCategoryRequest;

use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;

class BlogCategoryController extends Controller
{
    
    public function index(request $r){

        $categories = BlogCategory::orderBy('id','desc')->paginate(10);
        
        return view('backend.blog.category.show')->with('categories',$categories);

    }

    public function create(){

        return view('backend.blog.category.create');
    }

    public function store(StoreBlogCategoryRequest $request)
    {
        if($request->thumb != null){
            $file = $request->file('thumb');
            $image = 'web/articles/'.$file->getClientOriginalName();
            Storage::disk('s3')->put($image, file_get_contents($file));
            $request->request->add(['image' => $image]);
        }

        $category = BlogCategory::create($request->all());
        
        Session::flash('success' , 'Category added successfully');
        return redirect()->route('blog.category.index');
    }

    public function edit(BlogCategory $blogCategory, $id){

        $category = $blogCategory->find($id);

        if($category->image != null)
            $categoryImg = Storage::disk('s3')->url($category->image);
        else
            $categoryImg = "https://via.placeholder.com/960x350/162a41/FFFFFF?text=".$category->title;

        return view('backend.blog.category.edit')->with('category',$category)->with('categoryImg',$categoryImg);
    }

    public function update(UpdateBlogCategoryRequest $request, BlogCategory $blogCategory, $id)
    {

        if($request->thumb != null){
            $file = $request->file('thumb');
            $image = 'web/articles/'.$file->getClientOriginalName();
            Storage::disk('s3')->put($image, file_get_contents($file));
            $request->request->add(['image' => $image]);
        }

        $updateArr = [];
        $updateArr['name']=$request->name;
        $updateArr['slug']=$request->slug;
        if($request->image)
            $updateArr['image']=$request->image;

        $blogCategory->where('id',$id)->update($updateArr);

        Session::flash('success', 'Category Updated successfully');
        return redirect()->route('blog.category.index');
    }

    public function show(BlogCategory $blogCategory, $id)
    {

        $category = $blogCategory->find($id);

        return view('backend.blog.category.show', compact('category'));
    }

    public function destroy(BlogCategory $blogCategory, $id)
    {
        dd($blogCategory);
        $blogCategory->destroy($id);
        Session::flash('success' , 'Category deleted successfully');
        return redirect()->route('blog.category.index');
    }


}
