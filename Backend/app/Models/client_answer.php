<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class client_answer extends Model
{
    use HasFactory;
    protected $fillable = ['client_id','test_id','question_id','answer_id'];
    public function client(){
        return $this->belongsTo(Client::class);
    }
    public function test(){
        return $this->belongsTo(Test::class);
    }
    public function question(){
        return $this->belongsTo(Question::class);
    }
    public function answer(){
        return $this->belongsTo(Answer::class);
    }
}
