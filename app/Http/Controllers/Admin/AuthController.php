<?php

namespace App\Http\Controllers\Admin;


use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request){
        $fields = $request->validate([
            "username" => "required|string",
            "phone_number" => "required|unique:clients|string|digits:10"
        ]);
        $client = Client::where('phone_number', $request->phone_number)->first();
        if ($client)
            return response()->json(["Error" => "Phone number already taken"]);;
        $fields['role'] = 'admin';
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
}
