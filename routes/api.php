<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AIJournalController;  

/*
|----------------------------------------------------------------------
| API Routes
|----------------------------------------------------------------------
*/

// Chat Bot
Route::post('/chatbot', [ChatBotController::class, 'chat']);

// Journal APIs
Route::get('/journals', [AIJournalController::class, 'index']);
Route::get('/journals/details', [AIJournalController::class, 'show']);
Route::get('/journal-categories', [AIJournalController::class, 'categories']);

// Document Processing APIs
Route::post('/process-document', [DocumentController::class, 'process']);
Route::get('/download-document/{id}', [DocumentController::class, 'download']);
Route::put('/update-document/{id}', [DocumentController::class, 'update']);
Route::post('/ai-improve-document', [DocumentController::class, 'aiImprove']);
Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);

// User Routes (Protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Contacts Routes
Route::get('/contacts', [ContactController::class, 'index']);
Route::get('/contacts/{contact}', [ContactController::class, 'show']);
Route::post('/contacts', [ContactController::class, 'store']);
Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

// Users Routes
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
