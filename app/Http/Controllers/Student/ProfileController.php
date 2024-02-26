<?php

namespace App\Http\Controllers\Student;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProfileController extends Controller
{
    public function getProfile(Request $request){
        $user = Client::find($request->userId);
        return $user;
    }
}
