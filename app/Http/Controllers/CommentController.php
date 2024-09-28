<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index(Blog $blog)
    {
        $comments = $blog->comments()->with('user')->latest()->get();
        return response()->json($comments);
    }

    public function store(Request $request, Blog $blog)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            $comment = new Comment();
            $comment->content = $request->content;
            $comment->user_id = $user->id;
            $comment->blog_id = $blog->id;
            $comment->save();
            
            $comment->load('user');

            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $comment,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Comment $comment)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        if (Gate::denies('modify', $comment)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $comment->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}
