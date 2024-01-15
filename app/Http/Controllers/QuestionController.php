<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class QuestionController extends Controller
{
    public function store(Request $request){
        $fields  = $request->validate([
            'question_text'=>'required|string',
            'test_id'=>'required|integer'
        ]);
        $test = Test::find($request->test_id);
        if(!$test)
        return response()->json(['Error'=>'The test with the given id was not found'],404);
        
        $question= Question::create($fields);
        $test->question_count++;
        $test->save();
        return response()->json(["Message"=>"Question created successfully",
                                "Question count for test incemented:"=>$test->question_count
                                ,"Question"=>$question]);
    }
    public function index(){
        $questions = Question::with('answers')->get();
        if(sizeof($questions)==0)
        return response()->json(['Error'=>'No questions found']);
        else
        return response()->json(["Questions"=>$questions]);
    }
    public function show($id){
        $question = Question::with('answers')->where('id',$id)->get()->first();
        if(!$question)
        return response()->json(["Error"=>"The question with the given id was not found."]);
        else
        return response()->json(["Question"=>$question]);
    }
    public function update(Request $request,$id){
        $question = Question::find($id);
        if(!$question)
        return response()->json(["Error"=>"The question with the given id was not found."]);
        $fields = $request->validate([
            "question_text"=>"string",
            "test_id"=>"integer"
        ]);
        $newTest=null;
        $oldTest=null;
        if($request->test_id){
            $newTest = Test::find($request->test_id);
            if(!$newTest)
            return response()->json(["The test with the given id was not found."]);
            if($request->test_id===$newTest->id)
            goto label;
            $newTest->question_count++;
            $newTest->save();
            
            $oldTest = Test::find($question->test_id);
            $oldTest->question_count--;
            $oldTest->save();
            
        }
        
        label:
        $fields['test_id']=intval($fields['test_id']);
        $question->forceFill($fields);
        $question->save();
        
        return response()->json(["Message"=>"question updated successfully.","Question"=>$question]);
    }
    public function destroy($id){
        $question = Question::find($id);
        if(!$question)
        return response()->json(["Error"=>"The question with the given id was not found."],404);
        $test = Test::find($question->test_id);
        $test->question_count--;
        $test->save();
        $question->delete();
        return response()->json(["Message"=>"Question deleted successfully.",
                                 "Decremented question count for test"=>$test->question_count]);
    }
}
