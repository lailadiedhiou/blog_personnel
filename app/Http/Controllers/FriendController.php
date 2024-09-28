<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function sendRequest(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);

        $friendship = Friend::where('user_id', Auth::id())
                             ->where('friend_id', $request->friend_id)
                             ->first();

        if ($friendship) {
            return response()->json([
                
                'message' => 'Friend request already sent.',
            ]);
        }

        $friendship = new Friend();
        $friendship->user_id = Auth::id();
        $friendship->friend_id = $request->friend_id;
        
        $friendship->save();

        return response()->json([

            'message' => 'Friend request sent.',
        ]);
    }

    public function acceptRequest($id)
    {
        $friendship = Friend::where('user_id', $id)
                             ->where('friend_id', Auth::id())
                             ->first();

        if (!$friendship) {
            return response()->json([
                
                'message' => 'Friend request not found or already accepted.',
            ]);
        }

       
        $friendship->save();

        return response()->json([
            
            'message' => 'Friend request accepted.',
        ]);
    }

    public function rejectRequest($id)
    {
        $friendship = Friend::where('user_id', $id)
                             ->where('friend_id', Auth::id())
                             ->first();

        if (!$friendship) {
            return response()->json([
                
                'message' => 'Friend request not found or already handled.',
            ]);
        }

        
        $friendship->save();

        return response()->json([
            
            'message' => 'Friend request rejected.',
        ]);
    }

    public function listFriends()
    {
        try {
            $friends = Friend::where('user_id', Auth::id())
                            ->orWhere(function ($query) {
                                $query->where('friend_id', Auth::id());
                            })
                            ->with('friend')
                            ->get();

            return response()->json([
                'data' => $friends
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500); // Renvoie l'erreur en JSON
        }
    }

}
