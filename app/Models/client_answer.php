<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class client_answer extends Model
{
    use HasFactory;
    protected $fillable = ['client_id','test_id','question_id','answer_id'];
}
