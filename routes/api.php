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
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\InterpretationController;
use App\Http\Controllers\Client\AuthClientAnswerController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\SmsController;

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

Route::get('getClients', [ClientsController::class, 'index']);
Route::middleware('auth.admin')->group(function () {
    Route::post('createClient', [ClientsController::class, 'store']);
    Route::get('showClient/{id}', [ClientsController::class, 'show']);
    Route::put('updateClient/{id}', [ClientsController::class, 'update']);
    Route::delete('deleteClient/{id}', [ClientsController::class, 'destroy']);



    Route::post('createChapter', [ChapterController::class, 'store']);
    Route::put('updateChapter/{id}', [ChapterController::class, 'update']);
    Route::delete('deleteChapter/{id}', [ChapterController::class, 'destroy']);

    Route::post('createInterpretation', [InterpretationController::class, 'store']);
    Route::put('updateInterpretation/{id}', [InterpretationController::class, 'update']);
    Route::delete('deleteInterpretation/{id}', [InterpretationController::class, 'destroy']);

    Route::post('createTest', [TestController::class, 'store']);
    Route::put('updateTest/{id}', [TestController::class, 'update']);
    Route::delete('deleteTest/{id}', [TestController::class, 'destroy']);

    Route::post('createQuestion', [QuestionController::class, 'store']);
    Route::put('updateQuestion/{id}', [QuestionController::class, 'update']);
    Route::delete('deleteQuestion/{id}', [QuestionController::class, 'destroy']);

    Route::post('createAnswer', [AnswerController::class, 'store']);
    Route::put('updateAnswer/{id}', [AnswerController::class, 'update']);
    Route::delete('deleteAnswer/{id}', [AnswerController::class, 'destroy']);

    Route::post('createClientAnswer', [ClientAnswersController::class, 'store']);
    Route::put('updateClientAnswer/{id}', [ClientAnswersController::class, 'update']);
    Route::delete('deleteClientAnswer/{id}', [ClientAnswersController::class, 'destroy']);

    Route::post('createResult', [ResultController::class, 'store']);
    Route::put('updateResult/{id}', [ResultController::class, 'update']);
    Route::delete('deleteResult/{id}', [ResultController::class, 'destroy']);

    Route::post('createCollection', [CollectionController::class, 'store']);
    Route::put('updateCollection/{id}', [CollectionController::class, 'update']);
    Route::delete('deleteCollection/{id}', [CollectionController::class, 'destroy']);
});

Route::get('getChapters', [ChapterController::class, 'index']);
Route::get('showChapter/{id}', [ChapterController::class, 'show']);


//Chapters//


//Interpretations//
Route::get('getInterpretations', [InterpretationController::class, 'index']);
Route::get('showInterpretation/{id}', [InterpretationController::class, 'show']);


Route::get('getTests', [TestController::class, 'index']);
Route::get('showTest/{id}', [TestController::class, 'show']);
Route::get('getChapterTests/{id}', [TestController::class, 'getTestForChapter']);
//this is a test
Route::get('searchTest/{src}', [TestController::class, 'search']);

Route::get('getQuestions', [QuestionController::class, 'index']);
Route::get('showQuestion/{id}', [QuestionController::class, 'show']);
Route::get('getTestQuestions/{id}', [QuestionController::class, 'getTestQuestions']);


Route::get('getAnswers', [AnswerController::class, 'index']);
Route::get('showAnswer/{id}', [AnswerController::class, 'show']);


Route::get('getClientAnswers', [ClientAnswersController::class, 'index']);
Route::get('showClientAnswer/{id}', [ClientAnswersController::class, 'show']);

Route::get('getResults', [ResultController::class, 'index']);
Route::get('showResult/{id}', [ResultController::class, 'show']);

Route::post('sendOtp', [AuthController::class, 'sendOtp']);
Route::post('verifyOtp', [AuthController::class, 'verifyOtp']);
Route::post('resendOtp', [AuthController::class, 'resendOtp']);
Route::post('login', [AuthController::class, 'login']);


Route::get('getCollections', [CollectionController::class, 'index']);
Route::get('showCollection/{id}', [CollectionController::class, 'show']);

//Authenticated user answer questions.
Route::prefix("student")->middleware('auth.client')->group(function () {
    Route::post('answerQuestion', [AuthClientAnswerController::class, 'answerQuestion']);
    Route::post('storeAnswers', [AuthClientAnswerController::class, 'storeAnswers']);
    Route::post('storeResult', [AuthClientAnswerController::class, 'storeResult']);
    Route::get('getTestResults', [ClientAnswersController::class, 'getTestResults']);
    Route::get('getProfile', [ProfileController::class, 'getProfile']);
    Route::post('continueSignUp', [AuthController::class, 'continueSignUp']);
});

Route::prefix('admin')->group(function () {
    Route::post('signup', [AdminAuthController::class, 'register']);
});
Route::post('adminLogin', [AuthController::class, 'adminLogin']);
