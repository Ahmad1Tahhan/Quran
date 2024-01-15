<?php

namespace App\Http\Controllers\Client;

use App\Models\Test;
use App\Models\Answer;
use App\Models\Client;
use App\Models\client_answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


class AuthClientAnswerController extends Controller
{
    public function answerQuestion(Request $request){
        $fields = $request->validate([
            'test_id'=>'required|integer',
            'question_id'=>'required|integer',
            'answer_id'=>'required|integer',
        ]);
        $fields['client_id']=$request->userId;

        $test = Test::find($request->test_id);
        if(!$test)
        return response()->json(["Error"=>"The test with the given id was not found."],404);
        $question = Question::find($request->question_id);
        if(!$question)  
        return response()->json(["Error"=>"The question with the given id was not found."],404);
        $answer = Answer::find($request->answer_id);
        if(!$answer)
        return response()->json(["Error"=>"The answer with the given id was not found."],404);
        


        $tests = Test::where('id',$request->test_id)->with('questions')->get();
        $isQuestionFound = false;
        foreach($tests[0]->questions as $question){
            if($question->id == $request->question_id){
                $isQuestionFound = true;
                break;
            }
        }

        if(!$isQuestionFound)
        return response()->json(['Error'=>'The question you provided does not belong to that test.'],400);

        $questions = Question::where('id',$request->question_id)->with('answers')->get();
        $isAnswerFound = false;
        foreach($questions[0]->answers as $answer){
            if($answer->id == $request->answer_id){
                $isAnswerFound = true;  
                break;
            }
        }
        if(!$isAnswerFound)
        return response()->json(['Error'=>'The answer you provided does not belong to that question.']);
        $client = Client::with('client_answers')->get();
        foreach($client[0]->client_answers as $client_answer){
            if($client_answer->test_id==$request->test_id && $client_answer->question_id ==$request->question_id)
            return response()->json(["Error" =>"Already submitted answer to that question."],400);
        }
        $client_answer = client_answer::create($fields);
        return response()->json(["Message"=>"Client answer created successfullly.","Client answer"=>$client_answer]);
    }
    public function storeAnswers(Request $request){
        $fields = $request->validate([
            'test_id'=>'integer|required',
            'answers'=>'array|required'
        ]);    
        foreach($fields['answers'] as $answer){
            if(!Answer::find($answer['answer_id']))
            return response()->json(['The answer with the given id was not found']);
            $question = Question::where('id',$answer['question_id'])->with('answers')->get()->first();
            if(!$question)
            return response()->json(["Error"=>"The question with the given id was not found."]);
            
            $isAnswerFound = false;
            foreach($question->answers as $question_answer){
                if($answer['answer_id'] == $question_answer->id){
                    $isAnswerFound = true;
                    break;
                }
            }

            if(!$isAnswerFound)
            return response()->json(['Error'=>'The answer you provided does not belong to that question.']);
            
            client_answer::create([
                'test_id'=>$request->test_id,
                'client_id'=>$request->userId,
                'question_id'=>$question->id,
                'answer_id'=>$question_answer->id
            ]);
        }
        
        return response("Created client answers successfully");
    }
    public function storeResult(Request $request){
        $client_answers = client_answer::where('client_id',$request->userId)->where('test_id',$request->test_id)->get();
        $correctCount = 0;
        foreach($client_answers as $client_answer){
            $answer = Answer::find($client_answer->answer_id);
            if($answer->correct==true)
            $correctCount++;
        }
        $tests = Test::where('id',$request->test_id)->with('questions')->get();
        return response($correctCount/sizeof($tests[0]->questions));
        // return response()
    }
    
}
