<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $fields = $request->validate([
            'phone_number' => 'required|string|digits:10',
            'otp'=>'required|string'
        ]);
        $client = Client::where('phone_number', $request->phone_number)->get()->first();
        if (!$client) {
            return response()->json([
                "Error" => "The client with the given phone number was not found.",
            ], 401);
        }
        $userOtp = $request->otp;
        $storedOtp = $request->session()->get('otp');
        if($userOtp!=$storedOtp)
        return response()->json(["Message"=>"Otp unverified."],400);
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client' => $client,
            'Authorization' => [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }
    public function register(Request $request)
    {
        $fields = $request->validate([
            "username" => "required|string",
            "phone_number" => "required|unique:clients|string|digits:10"
        ]);
        $client = Client::where('phone_number', $request->phone_number)->first();
        if ($client)
            return response()->json(["Error" => "Phone number already taken"]);;
        $fields['role'] = 'student';
        $client = Client::create($fields);
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client' => $client,
            'Authorization' => [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }
    public function adminLogin(Request $request){
        $fields = $request->validate([
            'phone_number'=>"required|string",
            "password"=>"required|string"
        ]); 
        
        $client = Client::where('phone_number', $request->phone_number)->where('role','admin')->get()->first();
        if (!$client) {
            return response()->json([
                "Error" => "The admin with the given phone number was not found.",
            ],400);
        }
        if(!Hash::check($request->password,$client->password,[]) )
        return response()->json(["Error"=>"invalid phone number or password."],400);
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client' => $client,
            'Authorization' => [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }
}
