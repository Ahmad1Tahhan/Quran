<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;
    protected $fillable = ['question_id','answer_text','correct'];
    public function question(){
        return $this->belongsTo(Question::class);
    }
    public function client_answers(){
        return $this->hasMany(client_answer::class,'answer_id');
    }
}
