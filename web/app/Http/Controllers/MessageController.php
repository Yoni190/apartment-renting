<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    /**
     * Get all conversations for current user
     */
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($message) use ($userId) {
                return $message->sender_id == $userId
                    ? $message->receiver_id
                    : $message->sender_id;
            });

        return response()->json([
            'conversations' => $conversations
        ]);
    }

    /**
     * Get messages between current user and another user
     */
    public function chat(Request $request, $userId)
    {
        $authId = $request->user()->id;

        $messages = Message::where(function ($q) use ($authId, $userId) {
                $q->where('sender_id', $authId)
                  ->where('receiver_id', $userId);
            })
            ->orWhere(function ($q) use ($authId, $userId) {
                $q->where('sender_id', $userId)
                  ->where('receiver_id', $authId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'messages' => $messages
        ]);
    }

    /**
     * Send a new message
     */
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string'
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'is_read' => 0
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message
        ]);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request, $userId)
    {
        $authId = $request->user()->id;

        Message::where('sender_id', $userId)
            ->where('receiver_id', $authId)
            ->update(['is_read' => 1]);

        return response()->json([
            'message' => 'Messages marked as read'
        ]);
    }

    /**
     * Delete a message
     */
    public function delete($id)
    {
        $message = Message::findOrFail($id);

        if ($message->sender_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message deleted'
        ]);
    }
}