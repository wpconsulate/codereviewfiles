<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogCategory extends Model
{
    use SoftDeletes;

    public $table = 'blog_categories';

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'name',
        'slug',
        'image',
        'created_at',
        'updated_at',
        'deleted_at',
    ];


    public function blog(){
        return $this->hasMany('App\Blog');
    }
}
