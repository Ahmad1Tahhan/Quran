<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;


class Client extends Authenticatable implements JWTSubject
{
    use HasFactory,Notifiable;
    protected $fillable = [
        'username',
        'phone_number',
    ];
    
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function client_answers(){
        return $this->hasMany(client_answer::class,'client_id');
    }
    public function results(){
        return $this->hasMany(Result::class,'client_id');
    }
}
