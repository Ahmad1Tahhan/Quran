<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable= ['question_text','test_id'];
    public function test(){
        return $this->belongsTo(Test::class);
    }
    public function answers(){
        return $this->hasMany(Answer::class,'question_id');
    }
    public function client_answers(){
        return $this->hasMany(client_answer::class,'question_id');
    }
}
