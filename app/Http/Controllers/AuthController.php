<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function login(Request $request){
        $fields = $request->validate([
            'phone_number' => 'required|string|digits:10',
        ]);
        $client = Client::where('phone_number',$request->phone_number)->get()->first();
        if(!$client){
            return response()->json([
                "Error"=>"The client with the given phone number was not found.",
            ],401);
        }
        
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client'=>$client,
            'Authorization'=>[
                'token'=>$token,
                'type'=>'bearer'
            ]
            ]);
    }
    public function register(Request $request){
        $fields = $request->validate([
            "username"=>"required|string",
            "phone_number"=>"required|unique:clients|string|digits:10"
        ]);
        $client = Client::where('phone_number',$request->phone_number)->first();
        if($client)
        return response()->json(["Error"=>"Phone number already taken"]);;

        $client = Client::create($fields);
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client'=>$client,
            'Authorization'=>[
                'token'=>$token,
                'type'=>'bearer'
            ]
            ]);
    }
}
