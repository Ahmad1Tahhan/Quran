<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ClientAnswersController;
use App\Http\Controllers\InterpretationController;
use App\Http\Controllers\Client\AuthClientAnswerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('createClient',[ClientsController::class,'create']);
Route::get('getClients',[ClientsController::class,'index']);
Route::get('showClient/{id}',[ClientsController::class,'getOne']);
Route::put('updateClient/{id}',[ClientsController::class,'update']);
Route::delete('deleteClient/{id}',[ClientsController::class,'destroy']);


                    //Chapters//
Route::post('createChapter',[ChapterController::class,'store']);
Route::get('getChapters',[ChapterController::class,'index']);
Route::get('showChapter/{id}',[ChapterController::class,'show']);
Route::put('updateChapter/{id}',[ChapterController::class,'update']);
Route::delete('deleteChapter/{id}',[ChapterController::class,'destroy']);

                    //Interpretations//
// Route::post('createInterpretation',[InterpretationController::class,'store']);
// Route::get('getInterpretations',[InterpretationController::class,'index']);
// Route::get('showInterpretation/{id}',[InterpretationController::class,'show']);
// Route::put('updateInterpretation/{id}',[InterpretationController::class,'update']);
// Route::delete('deleteInterpretation/{id}',[InterpretationController::class,'destroy']);

Route::post('createTest',[TestController::class,'store']);
Route::get('getTests',[TestController::class,'index']);
Route::get('showTest/{id}',[TestController::class,'show']);
Route::put('updateTest/{id}',[TestController::class,'update']);
Route::delete('deleteTest/{id}',[TestController::class,'destroy']);

Route::post('createQuestion',[QuestionController::class,'store']);
Route::get('getQuestions',[QuestionController::class,'index']);
Route::get('showQuestion/{id}',[QuestionController::class,'show']);
Route::put('updateQuestion/{id}',[QuestionController::class,'update']);
Route::delete('deleteQuestion/{id}',[QuestionController::class,'destroy']);


Route::post('createAnswer',[AnswerController::class,'store']);
Route::get('getAnswers',[AnswerController::class,'index']);
Route::get('showAnswer/{id}',[AnswerController::class,'show']);
Route::put('updateAnswer/{id}',[AnswerController::class,'update']);
Route::delete('deleteAnswer/{id}',[AnswerController::class,'destroy']);


Route::post('createClientAnswer',[ClientAnswersController::class,'store']);
Route::get('getClientAnswers',[ClientAnswersController::class,'index']);
Route::get('showClientAnswer/{id}',[ClientAnswersController::class,'show']);
Route::put('updateClientAnswer/{id}',[ClientAnswersController::class,'update']);
Route::delete('deleteClientAnswer/{id}',[ClientAnswersController::class,'destroy']);

Route::post('createResult',[ResultController::class,'store']);
Route::get('getResults',[ResultController::class,'index']);
Route::get('showResult/{id}',[ResultController::class,'show']);
Route::put('updateResult/{id}',[ResultController::class,'update']);
Route::delete('deleteResult/{id}',[ResultController::class,'destroy']);



//this is a test
Route::get('searchTest/{src}',[TestController::class,'search']);


Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);


//Authenticated user answer questions.
Route::middleware('auth.client')->group(function(){
    Route::post('answerQuestion',[AuthClientAnswerController::class,'answerQuestion']);
    
});