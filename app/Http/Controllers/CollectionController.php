<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Interpretation;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CollectionController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            "interp_id" => "required|integer",
            "name" => "required|string"
        ]);
        if (!Interpretation::find($fields['interp_id']))
            return response()->json(["message" => "The interpretation with the given id was not found."],404);
        $collection = Collection::create($fields);
        return response()->json([
            "message" => "Created collection successfully.",
            "Collection" => $collection
        ]);
    }
    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            "name" => "string",
            "interp_id"=>"integer"
        ]);
        if($request->interp_id){
            if(!Interpretation::find($fields['interp_id']))
            return response()->json(["message"=>"The interpretation with the given id was not found"],400);
        }
        $collection = Collection::find($id);
        if (!$collection)
            return response()->json(["message" => "The collection with the given id was not found."],404);
        $collection->forceFill($fields);
        $collection->save();
        return response()->json([
            "Message" => "Collection updated successfully",
            "Collection" => $collection
        ], 200);
    }
    public function index()
    {
        $collections = Collection::get();
        return response()->json(["Collections" => $collections]);
    }
    public function show($id)
    {
        $collection = Collection::find($id);
        if (!$collection)
            return response()->json(["message" => "The collection with the given id was not found."],404);
        return response()->json(["Collection" => $collection]);
    }
    public function destroy($id)
    {
        $collection = Collection::find($id);
        if (!$collection)
            return response()->json(["message" => "The collection with the given id was not found."],404);
        $collection->delete();
        return response()->json(["Message" => "Collection deleted successfully."]);
    }
}
