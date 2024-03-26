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
            "phone_number" => "required|unique:clients|string|digits:10",
            "password"=>"required|string",
            "gender"=>"required|string|in:male,female",
            "birth"=>"required|string",
            "city"=>"required|string"
        ]);
        $birth = strtotime($request->birth);
        $birthFormat = date('Y-m-d',$birth);
        $fields['birth'] = $birthFormat;
        $client = Client::where('phone_number', $request->phone_number)->first();
        if ($client)
            return response()->json(["Error" => "Phone number already taken"]);;
        $fields['role'] = 'admin';
        $fields['password'] = bcrypt($request->password);
        $fields['otp']=0000;
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
