<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interpretation;
use Illuminate\Routing\Controller;

class InterpretationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $interpretations = Interpretation::all();
        if(sizeof($interpretations)==0)
            return response()->json(["message"=>"No interpretations found."]);
        else    
            return response()->json(["Interpretations"=>$interpretations]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'interp_number'=>'required|integer|unique:interpretations'
        ]);
        $interpretation = Interpretation::create($fields);
        return response()->json(["message"=>"Interpretation created successfully",
                                 "interpretation"=>$interpretation]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $interpretation = Interpretation::find($id);
        if(!$interpretation)
            return response()->json(["message"=>"The interpretation with the given id was not found."]);
        else
            return response()->json(["Interpretation"=>$interpretation]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $interpretation = Interpretation::find($id);
        if(!$interpretation)
        return response()->json(["error"=>"The interpretation with the given id was not found."],404);
        
        $fields = $request->validate([
            'interp_number'=>'required|integer|unique:interpretations'
        ]);

        $interpretation->forceFill($fields);
        $interpretation->save();
        return response()->json(["message"=>"Interpretation updated successfully.","Interpretation"=>$interpretation]);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $interpretation = Interpretation::find($id);
        if(!$interpretation)
        return response()->json(["error"=>"The interpretation with the given id was not found."],404);
        else{
            $interpretation->delete();
            return response()->json(["message"=>"Interpretation deleted successfully."]);
        }
    }
}
