<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interpretation extends Model
{
    use HasFactory;
    protected $fillable = ['interp_number'];
    public function collections(){
        return $this->hasMany(Collection::class,'interpretation_id');
    }
}
