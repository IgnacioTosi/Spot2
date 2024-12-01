<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShortUrlController;

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


Route::post('/shorten', [ShortUrlController::class, 'store']);
Route::get('/redirect/{short_code}', [ShortUrlController::class, 'redirect']);
Route::get('/urls', [ShortUrlController::class, 'index']);
Route::delete('/urls/{id}', [ShortUrlController::class, 'destroy']);