<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    //
    protected $fillable = [
        'category_id','author_id','title','description',
        'content1','status_id','active','deleted_at',
        'content2','image1','image2','thumb','slug',
        'meta_title'
    ];

    //-----------------------------------------
    // Relationshio

    /**
     * Get the meta for the blog post.
     */
    public function meta()
    {
        return $this->hasMany(\App\BlogMeta::class);
    }
 
    public function category(){
        return $this->belongsTo('App\Category');
    }

    public function categories(){
        return $this->belongsToMany(\App\BlogCategory::class);
    }

    public function tags()
    {
        return $this->belongsToMany(\App\BlogTag::class);
    }


    //-----------------------------------------
    // Functions

    public function getMeta() {
        if($this->id){
            $metaValues = [];
            
            foreach($this->meta as $meta)
                $metaValues[$meta->meta_key] = unserialize($meta->meta_value);
            
            return $metaValues;
        }
    }

    private function saveMeta($key, $value){
        $meta = $this->meta->where("meta_key", $key)->where("blog_id", $this->id)->first();
        if (!$meta) {
            $meta = new \App\BlogMeta;
            $meta->meta_key = $key;
            $meta->blog_id = $this->id;
        }

        $meta->meta_value = serialize($value);
        $this->meta()->save($meta);
    }

    public function updateMeta($_meta) {
        if($this->id){
            // dd($_meta);
            $metaFields = config('go.blog_meta');

            foreach($metaFields as $key=>$title){

                if( ! isset($_meta[$key]) )
                    $meta_value='off';
                else
                    $meta_value=$_meta[$key];
                
                $this->saveMeta($key, $meta_value);

                unset($_meta[$key]);

            }

            foreach($_meta as $key=>$value){
                $this->saveMeta($key, $value);
            }


        }
    }

}
