<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    
    
    public function adminLogin(Request $request)
    {
        $fields = $request->validate([
            'phone_number' => "required|string",
            "password" => "required|string"
        ]);

        $client = Client::where('phone_number', $fields['phone_number'])->where('role', 'admin')->get()->first();
        if (!$client) {
            return response()->json([
                "Error" => "The admin with the given phone number was not found.",
            ], 400);
        }
        if (!Hash::check($fields['password'], $client->password, []))
            return response()->json(["Error" => "invalid phone number or password."], 400);
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client' => $client,
            'Authorization' => [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }
    public function sendOtp(Request $request)
    {
        $fields = $request->validate([
            "phone_number" => "required|string"
        ]);
        $client = Client::where('phone_number', $request->phone_number)->first();
        if ($client)
            return response()->json(["Error" => "Phone number already taken"],400);
        $fields['role'] = 'student';
        $otp = rand(1000, 9999);
        $fields['otp'] = $otp;
        $phone_number = $fields['phone_number'];
        $url = "https://services.mtnsyr.com:7443/general/MTNSERVICES/ConcatenatedSender.aspx?User=ppa277&Pass=dnat121717&From=Takkeh&Gsm=" . $phone_number . "&Msg=Your OTP code is: " . $otp . "&Lang=1";
        Http::post($url, [
            'Cookie' => 'ASP.NET_SessionId=x5noxur1uvywpstxaisatnar'
        ]);
        $client = Client::create($fields);
        return response()->json(["message" => "Otp sent successfully."], 200);
    }
    
    public function verifyOtp(Request $request)
    {
        $fields = $request->validate([
            "phone_number" => "string|required",
            "otp" => "numeric|required|digits:4"
        ]);
        $client = Client::where('phone_number', $fields['phone_number'])->first();
        if (!$client)
            return response()->json(["Error" => "Client not found. Please re enter your phone number."], 404);
        if ($client->otp !== $fields['otp'])
            return response()->json(["Error" => "Invalid Otp."], 400);
        $token = JWTAuth::fromUser($client);
        return response()->json([
            'client' => $client,
            'Authorization' => [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }
    public function continueSignUp(Request $request){
        $fields = $request->validate([
            'username' => 'required|string',
            'gender' => 'required|string|in:male,female',
            'birth' => 'required|string',
            'city' => 'required|string',
            'work' => 'string',
            'email' => 'email',
            'image'=>"string"
        ]);
        $client = Client::find($request->userId);
        if (!$client)
            return response()->json(["Error" => "Client not found. Please sign up again."], 404);
        $birth = strtotime($request->birth);
        $birthFormat = date('Y-m-d', $birth);
        $fields['birth'] = $birthFormat;
        $client->forceFill($fields);
        $client->save();
        return response()->json(["Success"=>"Signed up successfully.","Client"=>$client]);
    }
    public function resendOtp(Request $request){
        $fields = $request->validate([
            "phone_number" => "required|string"
        ]);
        $client = Client::where('phone_number', $request->phone_number)->first();
        if (!$client)
            return response()->json(["Error" => "Couldn't find number."],404);
        $fields['role'] = 'student';
        $otp = rand(1000, 9999);
        $fields['otp'] = $otp;
        $phone_number = $fields['phone_number'];
        $url = "https://services.mtnsyr.com:7443/general/MTNSERVICES/ConcatenatedSender.aspx?User=ppa277&Pass=dnat121717&From=Takkeh&Gsm=" . $phone_number . "&Msg=Your OTP code is: " . $otp . "&Lang=1";
        Http::post($url, [
            'Cookie' => 'ASP.NET_SessionId=x5noxur1uvywpstxaisatnar'
        ]);
        $client->otp = $otp;
        $client->save();
        return response()->json(["message" => "Otp sent successfully."], 200);
    }
}
