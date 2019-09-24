<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlogMeta extends Model
{

    public $table = 'blog_meta';

    public $timestamps = false;

    protected $fillable = [
        'blog_id',
        'meta_key',
        'meta_value'
    ];

    public function blog(){
        return $this->belongsTo(\App\Blog::class);
    }

    

}
