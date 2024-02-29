<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Psy\Readline\Hoa\Console;

class ChapterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $chapters = Chapter::get();
        if(!$chapters)
            return response()->json(["message"=>"No chapters found."]);
        else    
            return response()->json(["Chapters"=>$chapters]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'chapt_number'=>'required|integer|unique:chapters'
        ]);
        
        $chapter = Chapter::create($fields);
        return response()->json(["message"=>"Chapter created successfully",
                                 "chapter"=>$chapter]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $chapter = Chapter::find($id);
        if(!$chapter)
            return response()->json(["message"=>"The chapter with the given id was not found."]);
        else
            return response()->json(["Chapter"=>$chapter]);
    }

    /*.369*;
     * Updajr\147te the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $chapter = Chapter::find($id);
        if(!$chapter)
        return response()->json(["error"=>"The chapter with the given id was not found."],404);
        
        $fields = $request->validate([
            'chapt_number'=>'required|integer|unique:chapters'
        ]);

        $chapter->forceFill($fields);
        $chapter->save();
        return response()->json(["message"=>"Chapter updated successfully.","Chapter"=>$chapter]);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $chapter = Chapter::find($id);
        if(!$chapter)
        return response()->json(["error"=>"The chapter with the given id was not found."],404);
        else{
            $chapter->delete();
            return response()->json(["message"=>"Chapter deleted successfully."]);
        }
    }
}
