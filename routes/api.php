<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\TempImageController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

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




Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return $user;
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $user = Auth::user();
    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json('Logged out');
});


Route::get('blogs',[BlogController::class,'index']);
Route::post('blogs',[BlogController::class,'store']);
Route::post('save-temp-image',[TempImageController::class,'store']);
Route::get('blogs/{id}',[BlogController::class,'show']);
Route::put('blogs/{id}',[BlogController::class,'update']);
Route::delete('blogs/{id}',[BlogController::class,'destroy']);
Route::get('/api/friends', [BlogController::class, 'getFriendsBlogs'])->middleware('auth:sanctum');
Route::get('/api/blogs/{id}/comments', [CommentController::class, 'index'])->middleware('auth:sanctum');
Route::post('/api/blogs/{id}/comments', [CommentController::class, 'create']);

//Route::get('/api/blogs/{id}/comments', [CommentController::class, 'index']);
//Route::post('/api/blogs/{id}/comments', [CommentController::class, 'create']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});

Route::get('/blogs/{blog}/comments', [CommentController::class, 'index']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('friends/send', [FriendController::class, 'sendRequest']);
    Route::post('friends/accept-request/{id}', [FriendController::class, 'acceptRequest']);
    Route::post('friends/reject-request/{id}', [FriendController::class, 'rejectRequest']);
    Route::get('friends', [FriendController::class, 'listFriends']);
});
