<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ClientsController extends Controller
{

    function store(Request $request)
    {
        $fields = $request->validate([
            'username' => 'required|min:3|max:20|string',
            'phone_number' => 'unique:clients|required',
            'role' => 'required|string|in:admin,student',
            'gender' => 'required|string|in:male,female',
            'birth' => 'required|string',
            'city' => 'string',
            'work' => 'string',
            'email' => 'email',
        ]);

        $birth = strtotime(str_replace('/', '-', $request->birth));
        $birthFormat = date('Y-m-d', $birth);
        $fields['birth'] = $birthFormat;
        if ($fields['role'] === 'admin') {
            $fields['otp'] = 0000;
        }
        if ($fields['role'] === 'student') {
            $fields['otp'] = 9999;
        }
        $client = Client::create($fields);
        return response()->json(['message' => 'Client created successfully.', 'Client:' => $client]);
    }

    function index()
    {
        $clients = Client::all()->makeHidden(['image']);
        if (!$clients)
            return response()->json(["message" => "No clients registered."]);
        else
            return response()->json(["Clients" => $clients]);
    }

    function show($id)
    {
        $client = Client::find($id);
        if (!$client)
            return response()->json(["message" => "The client with the given id was not found."], 404);
        else
            return response()->json(["Clients" => $client]);
    }


    function update(Request $request, $id)
    {
        $fields = $request->validate([
            'username' => 'min:3|max:20|string',
            'phone_number' => 'string',
            'role' => 'string|in:admin,student',
            'gender' => 'string|in:male,female',
            'birth' => 'string',
            'city',
            'email',
            'work',
        ]);
        if ($request->work)
            $fields['work'] = $request->work;
        if ($request->city)
            $fields['city'] = $request->city;
        if ($request->email)
            $fields['email'] = $request->email;
        $birth = strtotime(str_replace('/', '-', $request->birth));
        $birthFormat = date('Y-m-d', $birth);
        $fields['birth'] = $birthFormat;
        $client = Client::find($id);      
        if (!$client)
            return response()->json(["message" => "The client requested with the given id was not found."], 404);

        $client->forceFill($fields);
        $client->save();
        
        return response()->json([
            "message" => "Client updated successfully.",
            "Client" => $client
        ]);
    }


    public function destroy($id)
    {
        $client = Client::find($id);
        if (!$client)
            return response()->json(["message:" => "The client requested with the given id was not found."], 404);
        else {
            $client->delete();
            return response()->json(["message" => "Client deleted successfully."]);
        }
    }
}
