<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;

class SmsController extends Controller
{
    public function sendOtp(Request $request)
    {
        $fields = $request->validate([
            'phone_number' => 'required|string'
        ]);
        $otp = rand(100000, 999999);
        $phone_number = $fields['phone_number'];
        $url = "https://services.mtnsyr.com:7443/general/MTNSERVICES/ConcatenatedSender.aspx?User=ppa277&Pass=dnat121717&From=Takkeh&Gsm=" . $phone_number . "&Msg=Your OTP code is: " . $otp . "&Lang=1";


        $response = Http::post($url, [
            'Cookie' => 'ASP.NET_SessionId=x5noxur1uvywpstxaisatnar'
        ]);

        $request->session()->put('otp', $otp);
        $request->session()->save();
        return response()->json(["message" => "Otp sent successfully."], 200);
    }
}
