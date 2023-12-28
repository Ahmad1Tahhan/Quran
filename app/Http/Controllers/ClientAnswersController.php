<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Answer;
use App\Models\Client;
use App\Models\client_answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ClientAnswersController extends Controller
{
    public function store(Request $request){
        $fields = $request->validate([
            'client_id'=>'required|integer',
            'test_id'=>'required|integer',
            'question_id'=>'required|integer',
            'answer_id'=>'required|integer',
        ]);
        $client = Client::find($request->client_id);
        if(!$client)
        return response()->json(["Error"=>"The client with the given id was not found."],404);
        $test = Test::find($request->test_id);
        if(!$test)
        return response()->json(["Error"=>"The test with the given id was not found."],404);
        $question = Question::find($request->question_id);
        if(!$question)
        return response()->json(["Error"=>"The question with the given id was not found."],404);
        $answer = Answer::find($request->answer_id);
        if(!$answer)
        return response()->json(["Error"=>"The answer with the given id was not found."],404);
        
        $client_answer = client_answer::create($fields);
        return response()->json(["Message"=>"Client answer created successfullly.","Client answer"=>$client_answer]);
    }
    public function index(){
        $client_answers = client_answer::all();
        if(sizeof($client_answers)==0)
        return response()->json(["Message"=>"No client answers found."]);
        return response()->json(["Client answers"=>$client_answers]);
    }
    public function show($id){
        $client_answer = client_answer::find($id);
        if(!$client_answer)
        return response()->json(["Error"=>"The client answer with the given id was not found."],400);
        return response()->json(["Client answer"=>$client_answer]);;
    }
    public function update(Request $request,$id){
        $client_answer = client_answer::find($id);
        if(!$client_answer)
        return response()->json(["Error"=>"Client answer with the given id was not found."]); 
        $fields = $request->validate([
            'client_id'=>'integer',
            'test_id'=>'integer',
            'question_id'=>'integer',
            'answer_id'=>'integer',
        ]);
        if($request->client_id){
            $client = Client::find($request->client_id);
            if(!$client)
            return response()->json(["Error"=>"The client with the given id was not found."],404);
        }
        if($request->test_id){
            $test = Test::find($request->test_id);
            if(!$test)
            return response()->json(["Error"=>"The test with the given id was not found."],404);
        }
        if($request->question_id){
            $question = Question::find($request->question_id);
            if(!$question)
            return response()->json(["Error"=>"The question with the given id was not found."],404);
        }
        if($request->answer_id){
            $answer = Answer::find($request->answer_id);
            if(!$answer)
            return response()->json(["Error"=>"The answer with the given id was not found."],404);
        }
       $client_answer->forceFill($fields);
       $client_answer->save();
       return response()->json(["Message"=>"Updated client answer successfully","Client answer"=>$client_answer]);
    }

    public function destroy($id){
        $client_answer = client_answer::find($id);
        if(!$client_answer)
        return response()->json(["Error"=>"The client asnwer with the given id was not found."],404);
        $client_answer->delete();
        return response()->json(["Message"=>"Client answer deleted successfully"]);
    }
}
