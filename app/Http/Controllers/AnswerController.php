<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AnswerController extends Controller
{
    public function store(Request $request){
        $fields = $request->validate([
            'answer_text'=>'required|string',
            'question_id'=>'required|integer',
            'correct'=>'required|boolean'
        ]);
        $question = Question::with('answers')->where('id',$request->question_id)->first();
        if(!$question)
        return response()->json(["Error"=>"The question with the given id was not found."],404);
        
        if($request->correct==true)
        foreach ($question->answers as $answers) {
            if($answers->correct==true)
            return response()->json(['Error'=>'There is already a correct answer']);
        }

        $answer = Answer::create($fields);

        return response()->json(["Message"=>"Created answer successfully.","Answer"=>$answer]);
    }
    public function index(){
        $answers = Answer::all();
        if(sizeof($answers)==0)
        return response()->json(["Message"=>"No answers found."]);
        
        return response()->json(["Answers"=>$answers]);
    }
    public function show($id){
        $answer = Answer::find($id);
        if(!$answer)
        return response()->json(["Error"=>"The asnwer with the given id was not found."]);
        
        return response()->json(["Answer"=>$answer]);
    }
    public function update(Request $request,$id){
        $fields = $request->validate([
            'answer_text'=>'string',
            'question_id'=>'integer',
            'correct'=>'boolean'
        ]);
        $answer = Answer::find($id);
        if(!$answer)
        return response()->json(["Error"=>"The answer with the given id was not found."],404);
        if($request->question_id){
            $question = Question::find($request->question_id);
            if(!$question)
            return response()->json(["Error"=>"The question with the given id was not found."],404);   
        }
        if($request->correct)
        if($request->correct==true)
        foreach ($question->answers as $answers) {
            if($answers->correct==true)
            return response()->json(['Error'=>'There is already a correct answer'],400);
        }
        $answer->forceFill($fields);
        $answer->save();
        return response()->json(["Message"=>"Answer updated successfully.","Answer"=>$answer]);
    }
    public function destroy($id){
        $answer = Answer::find($id);
        if(!$answer)
        return response()->json(["Error"=>"The asnwer with the given id was not found."]);
        $answer->delete();
        return response()->json(["Message"=>"Answer deleted successfully."]);
    }
}
