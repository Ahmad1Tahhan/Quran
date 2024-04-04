<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Collection;
use App\Models\Result;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use PDO;

class TestController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            'test_number' => 'required|integer|unique:tests',
            'chapt_id' => 'integer',
            'collection_id' => 'integer',
            'type' => 'required|string|in:quiz,exam',
            'time' => 'integer',
            'name'=>'string|required'
        ]);
        if (($request->chapt_id && $request->collection_id) && (!$request->chapt_id && $request->collection_id))
            return response()->json(["Error" => "Either chapt_id or collection_id required and NOT BOTH."]);
        if ($request->chapt_id)
            if (!Chapter::find($request->chapt_id))
                return response()->json(["Error" => "The chapter with the given id was not found."], 404);
                
        if ($request->collection)
            if (!Collection::find($request->collection_id))
                return response()->json(["Error" => "The collection with the given id was not found."], 404);

        $test = Test::create($fields);
        return response()->json(["message" => "Created test successfully.", "Test" => $test]);
    }
    public function index(Request $request)
    {
        $tests = Test::all();
        if (sizeof($tests) == 0)
            return response()->json(["Error" => "No tests found."], 404);
        else{
        if($request->userId)
        foreach($tests as $test){
            $result = Result::where('test_id',$test->id)->where('client_id',$request->userId)->first();
            if($result)
                $test->previous_result = true;
        }
        return $tests;
        }
    }
    public function show($id)
    {
        $test = Test::find($id);
        if (!$test)
            return response()->json(["Error" => "The test with the given id was not found."], 404);
        else
            return response()->json(["Test" => $test]);
    }
    public function update(Request $request, $id)
    {
        $test = Test::find($id);
        if (!$test)
            return response()->json(["Error" => "The test with the given id was not found."], 404);
        else {
            $fields = $request->validate([
                'test_number' => 'integer',
                'chapt_id' => 'integer',
                'type' => 'string|in:quiz,exam',
                'time' => 'integer',
                'name'=>'string'
            ]);
            if ($request->test_number !== $test->test_number) {
                $test = Test::where("test_number", $request->test_number)->first();
                if ($test)
                    return response()->json(["Error" => "Test number was already taken."], 400);
            }
            if ($request->chapt_id) {
                $chapter = Chapter::find($request->chapt_id);
                if (!$chapter)
                    return response()->json(["Error" => "The chapter with the given id was not found."], 404);
            }
            $test->forceFill($fields);
            $test->save();
            return response()->json(["Message" => "Test updated successfully", "Test" => $test]);
        }
    }
    public function destroy($id)
    {
        $test = Test::find($id);
        if (!$test)
            return response()->json(["Error" => "The test with the given id was not found."], 404);

        $test->delete();
        return response()->json(["Message" => "Test deleted successfully."]);
    }
    public function search($search)
    {
        $test = Test::where('type', 'LIKE', '%' . $search . '%')->get();
        if (sizeof($test) == 0)
            return response('not found');
        return response($test);
    }
    public function getTestForChapter($id)
    {
        $tests = Test::where('chapt_id', $id)->get();
        if (sizeof($tests) == 0)
            return response()->json("No tests attached for that chapter.");
        return $tests;
    }
}
