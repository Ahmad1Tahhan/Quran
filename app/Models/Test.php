<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;
    protected $fillable=['test_number','type','question_count','chapt_id','time'];

    public function chapter(){
        return $this->belongsTo(Chapter::class);
    }
    public function questions(){
        return $this->hasMany(Question::class,'test_id');
    }
    public function client_answers(){
        return $this->hasMany(client_answer::class,'test_id');
    }
}
