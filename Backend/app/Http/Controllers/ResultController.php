<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Test;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use function PHPSTORM_META\type;

class ResultController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            'degree' => 'required|numeric',
            'test_id' => 'required|integer',
            'client_id' => 'required|integer'
        ]);
        $test = Test::find($request->test_id);
        if (!$test)
            return response()->json(["Error" => "The test with the given id was not found."], 404);
        $client = Client::find($request->client_id);
        if (!$client)
            return response()->json(["Error" => "The client with the given id was not found."], 404);
        // $result = Result::where('test_id', $request->test_id)->where('client_id', $request->client_id)->get()->first();
        // if ($result)
        //     return response()->json(["Error" => "Client already did that test"], 400);

        $result = Result::create($fields);
        return response()->json([
            "Message" => "Created result successfully.",
            "Result" => $result
        ]);
    }
    public function index()
    {
        $results = Result::get();
        if (sizeof($results) == 0)
            return response()->json([
                "Error" => "No results found."
            ], 404);
        return response()->json(["Results" => $results]);
    }
    public function show($id)
    {
        $result = Result::find($id);
        if (!$result)
            return response()->json(["Error" => "The result with the given id was not found."]);
        return response()->json(["Message" => $result]);
    }
    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            'degree' => 'numeric',
            'test_id' => 'integer',
            'client_id' => 'integer'
        ]);

        $result = Result::find($id);
        if (!$result)
            return response()->json(["Error" => "The result with the given id was not found."], 400);
        if ($request->degree)
            $result->degree = $fields['degree'];
        if ($request->client_id) {
            $client = Client::find($request->client_id);
            if (!$client)
                return response()->json(["Error" => "The client with the given id was not found."], 404);
            $result->client_id = $fields['client_id'];
        }
        if ($request->test_id) {
            $test = Test::find($request->test_id);
            if (!$test)
                return response()->json(["Error" => "The test with the given id was not found."], 404);
            $result->test_id = $fields['test_id'];
        }

        $result->forcefill($fields);
        $result->save();
        return response()->json([
            "Message" => "Updated result successfully.",
            "Result" => $result
        ]);
    }
    public function destroy($id)
    {
        $result = Result::find($id);
        if (!$result)
            return response()->json(["Error" => "The result with the given id was not found."], 404);
        $result->delete();
        return response()->json(["Message" => "Result deleted successfully."]);
    }
    public function getPreviousResultsForTest(Request $request, $id)
    {
        $results = Result::where('test_id', $id)->where('client_id',$request->userId)->get();
        return $results;
    }
}
