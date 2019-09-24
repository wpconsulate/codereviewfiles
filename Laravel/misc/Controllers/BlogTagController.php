<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BlogTag;
use App\Http\Requests\StoreBlogTagRequest;
use App\Http\Requests\UpdateBlogTagRequest;

class BlogTagController extends Controller
{
    public function index()
    {

        $tags = BlogTag::orderBy('id','desc')->paginate(10);

        return view('backend.blog.tag.show', compact('tags'));
    }

    public function create()
    {
        return view('backend.blog.tag.create');
    }

    public function store(StoreBlogTagRequest $request)
    {
        $tag = BlogTag::create($request->all());

        \Session::flash('success' , 'Tag added successfully');
        return redirect()->route('blog.tags.index');
    }

    public function edit(BlogTag $blogTag, $id)
    {
        $tag = $blogTag->find($id);

        return view('backend.blog.tag.edit', compact('tag'));
    }

    public function update(UpdateBlogTagRequest $request, BlogTag $blogTag, $id)
    {

        $blogTag->where('id',$id)
                        ->update(['name'=>$request->name, 'slug'=>$request->slug]);

        \Session::flash('success' , 'Tag updated successfully');
        return redirect()->route('blog.tags.index');
    }

    public function show(BlogTag $blogTag, $id)
    {

        $blogTag = $blogTag->find($id);

        return view('backend.blog.tag.show', compact('blogTag'));
    }

    public function destroy(BlogTag $blogTag, $id)
    {

        $blogTag->destroy($id);

        // return back();
        return redirect()->route('blog.tags.index');
    }

}
