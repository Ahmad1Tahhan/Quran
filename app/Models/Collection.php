<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;
    protected $fillable = ['interp_id','name'];
    public function interpretation(){
        return $this->belongsTo(Interpretation::class);
    }
    public function tests(){
        return $this->hasMany(Test::class,'collection_id');
    }
}
