<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Imports\QuestionsImport;
use Illuminate\Routing\Controller;
use Maatwebsite\Excel\Facades\Excel;

class QuestionController extends Controller
{
    public function store(Request $request)
    {
        $fields  = $request->validate([
            'question_text' => 'required|string',
            'test_id' => 'required|integer'
        ]);
        $test = Test::find($request->test_id);
        if (!$test)
            return response()->json(['message' => 'The test with the given id was not found'], 404);

        $question = Question::create($fields);
        $test->question_count++;
        $test->save();
        return response()->json([
            "Message" => "Question created successfully",
            "Question count for test incemented:" => $test->question_count, "Question" => $question
        ]);
    }
    public function index()
    {
        $questions = Question::with('answers')->get();
        if (sizeof($questions) == 0)
            return response()->json(['message' => 'No questions found']);
        else
            return response()->json(["Questions" => $questions]);
    }
    public function show($id)
    {
        $question = Question::with('answers')->where('id', $id)->get()->first();
        if (!$question)
            return response()->json(["message" => "The question with the given id was not found."]);
        else
            return response()->json(["Question" => $question]);
    }
    public function update(Request $request, $id)
    {
        $question = Question::find($id);
        if (!$question)
            return response()->json(["message" => "The question with the given id was not found."], 404);
        $fields = $request->validate([
            "question_text" => "string",
            "test_id" => "integer"
        ]);
        $newTest = null;
        $oldTest = null;
        if ($request->test_id) {
            $newTest = Test::find($request->test_id);
            if (!$newTest)
                return response()->json(["message" => "The test with the given id was not found."], 404);
            if ($request->test_id === $newTest->id)
                goto label;
            $newTest->question_count++;
            $newTest->save();

            $oldTest = Test::find($question->test_id);
            $oldTest->question_count--;
            $oldTest->save();
        }

        label:
        $fields['test_id'] = intval($fields['test_id']);
        $question->forceFill($fields);
        $question->save();

        return response()->json(["Message" => "question updated successfully.", "Question" => $question]);
    }
    public function destroy($id)
    {
        $question = Question::find($id);
        if (!$question)
            return response()->json(["Error" => "The question with the given id was not found."], 404);
        $test = Test::find($question->test_id);
        $test->question_count--;
        $test->save();
        $question->delete();
        return response()->json([
            "Message" => "Question deleted successfully.",
            "Decremented question count for test" => $test->question_count
        ]);
    }
    public function getTestQuestions($id)
    {
        if (!Test::find($id))
            return response("The test with the given id was not found.");
        $questions = Question::with('answers')->where("test_id", $id)->get();
        if (sizeof($questions) == 0) {
            return response()->json("No questions found for that test.");
        }
        return response()->json($questions);
    }
    public function uploadQuestions(Request $request)
    {
        Excel::import(new QuestionsImport, $request->file);
        return response("file sent.");
    }
    public function uploadQuestionsJson(Request $request)
    {
        $data = $request->_json;
        $test_number = 1;
        $test = Test::create([
            "test_number" => $test_number,
            "chapt_id" => 1,
            "type" => "quiz",
            "name" => $test_number
        ]);
        for ($i = 0; $i < sizeof($data); $i++) {
            if ($i % 10 == 0) {
                $test_number++;
                $test = Test::create([
                    "test_number" => $test_number,
                    "chapt_id" => 1,
                    "type" => "quiz",
                    "name" => $test_number
                ]);
            }
            $question = Question::create([
                'question_text' => $data[$i]["question_text"],
                'test_id' => $test->id
            ]);
            $test->question_count++;
            $test->save();
            $correctA = false;
            $correctB = false;
            $correctC = false;
            if ($data[$i]['correct'] === "A"||$data[$i]['correct'] === "a")
                $correctA = true;
            if ($data[$i]['correct'] === "B"||$data[$i]['correct'] === "b")
                $correctB = true;
            if ($data[$i]['correct'] === "C"||$data[$i]['correct'] === "c")
                $correctC = true;
            Answer::create([
                'answer_text' => $data[$i]["answer_a"],
                'correct' => $correctA,
                'question_id' => $question->id
            ]);
            Answer::create([
                'answer_text' => $data[$i]["answer_b"],
                'correct' => $correctB,
                'question_id' => $question->id
            ]);
            Answer::create([
                'answer_text' => $data[$i]["answer_c"],
                'correct' => $correctC,
                'question_id' => $question->id
            ]);
        }
        return response()->json(["message"=>"Questions uploaded with answers."]);
    }
}
