<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;
    protected $fillable=['chapt_number'];

    public function tests(){
        return $this->hasMany(Test::class,'chapt_id');
    }
    
}
