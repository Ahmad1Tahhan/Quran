<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ClientsController extends Controller
{
    function create(Request $request){
        $fields = $request->validate([
            'username' =>'required|min:3|max:20|string',
            'phone_number'=>'required|digits:10'
        ]);
        $client = Client::create($fields);
        return response()->json(['message'=>'Client created successfully.','Client:'=>$client]);
    }

    function index(){
        $clients = Client::all();
        if(!$clients)
            return response()->json(["message"=>"No clients registered."]);
        else
            return response()->json(["Clients"=>$clients]);
    }

    function getOne($id){
        $client = Client::find($id);
        if(!$client)
            return response()->json(["message"=>"The client with the given id was not found."],404);
        else
            return response()->json(["Clients"=>$client]);
    }


    function update(Request $request,$id){
        $fields = $request->validate([
            'username' =>'min:3|max:20|string',
            'phone_number'=>'digits:10'
        ]);
        $client = Client::find($id);
        if(!$client)
            return response()->json(["message:"=>"The client requested with the given id was not found."],404);
        else
        $client->forceFill($fields);
        $client->save();
        return response()->json(["message:"=>"Client updated successfully.",
                                 "Client:"=>$client]);
    }


    public function destroy($id){
        $client = Client::find($id);
        if(!$client)
            return response()->json(["message:"=>"The client requested with the given id was not found."],404);
        else{
            $client->delete();
            return response()->json(["message"=>"Client deleted successfully."]);
        }
    }
}
