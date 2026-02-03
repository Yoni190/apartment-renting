<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;

class MessageApiController extends Controller
{
    // GET /api/messages
    // Supports either: ?sender_id=..&receiver_id=..  (conversation between two users)
    // or: ?user_id=.. (all messages where user is sender or receiver)
    public function index(Request $request)
    {
        // conversation between two users
        if ($request->filled('sender_id') && $request->filled('receiver_id')) {
            $s = (int)$request->input('sender_id');
            $r = (int)$request->input('receiver_id');

            // eager load sender and receiver so clients can display participant names
            $msgs = Message::with(['sender', 'receiver'])->where(function($q) use ($s,$r) {
                $q->where('sender_id', $s)->where('receiver_id', $r);
            })->orWhere(function($q) use ($s,$r) {
                $q->where('sender_id', $r)->where('receiver_id', $s);
            })->orderBy('created_at','asc')->get();

            return response()->json($msgs);
        }

        // messages for a single user (sent or received)
        if ($request->filled('user_id')) {
            $uid = (int)$request->input('user_id');
            $msgs = Message::with(['sender', 'receiver'])
                ->where(function($q) use ($uid) {
                    $q->where('sender_id', $uid)->orWhere('receiver_id', $uid);
                })->orderBy('created_at','asc')->get();

            return response()->json($msgs);
        }

        return response()->json(['message' => 'Missing parameters'], 400);
    }

    // POST /api/messages
    public function store(Request $request)
    {
        $request->validate([
            'sender_id' => ['required','integer'],
            'receiver_id' => ['required','integer'],
            'message' => ['required','string','max:2000'],
            'listing_id' => ['nullable','integer']
        ]);

        $user = $request->user();
        $senderId = (int)$request->input('sender_id');

        // Basic authorization: ensure authenticated user is the sender
        if (!$user || $user->id !== $senderId) {
            return response()->json(['message' => 'Unauthenticated or unauthorized'], 401);
        }

        $m = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => (int)$request->input('receiver_id'),
            'message' => $request->input('message'),
            'listing_id' => $request->input('listing_id') ?: null,
        ]);

        // Optionally: notify the receiver via database notification / broadcast here

        return response()->json($m, 201);
    }

    // POST /api/messages/mark-read { receiver_id, sender_id? }
    public function markRead(Request $request)
    {
        $request->validate([
            'receiver_id' => ['required','integer'],
            'sender_id' => ['nullable','integer']
        ]);

        $user = $request->user();
        $rid = (int)$request->input('receiver_id');

        if (!$user || $user->id !== $rid) {
            return response()->json(['message' => 'Unauthenticated or unauthorized'], 401);
        }

        $q = Message::where('receiver_id', $rid)->whereNull('read_at');
        if ($request->filled('sender_id')) {
            $q->where('sender_id', (int)$request->input('sender_id'));
        }

        $updated = $q->update(['read_at' => Carbon::now()]);

        return response()->json(['updated' => $updated]);
    }

    // DELETE /api/messages/conversation { other_id }
    public function deleteConversation(Request $request)
    {
        $request->validate([
            'other_id' => ['required','integer']
        ]);

        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $uid = (int) $user->id;
        $other = (int) $request->input('other_id');

        $deleted = Message::where(function($q) use ($uid, $other) {
            $q->where('sender_id', $uid)->where('receiver_id', $other);
        })->orWhere(function($q) use ($uid, $other) {
            $q->where('sender_id', $other)->where('receiver_id', $uid);
        })->delete();

        return response()->json(['deleted' => $deleted]);
    }

    // GET /api/conversations
    public function conversations(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json([], 200);

        $uid = $user->id;

        $msgs = Message::where(function($q) use ($uid) {
            $q->where('sender_id', $uid)->orWhere('receiver_id', $uid);
        })->orderBy('created_at','desc')->get();

        $convos = [];
        foreach ($msgs as $m) {
            $other = $m->sender_id === $uid ? $m->receiver_id : $m->sender_id;
            $key = $other . '-' . ($m->listing_id ?? '0');
            if (!isset($convos[$key])) {
                // try to include a lightweight user preview (id + name) so clients can show recipient names
                $user = User::find($other);
                $convos[$key] = [
                    'other_user_id' => $other,
                    'user' => $user ? ['id' => $user->id, 'name' => $user->name] : null,
                    'listing_id' => $m->listing_id,
                    'last_message' => $m->message,
                    'last_message_id' => $m->id,
                    'last_message_at' => $m->created_at,
                    'unread_count' => 0,
                ];
            }
            // count unread messages where receiver is current user
            if ($m->receiver_id === $uid && $m->read_at === null) {
                $convos[$key]['unread_count'] += 1;
            }
        }

        // re-index and return as array sorted by last_message_at desc
        $out = array_values($convos);
        usort($out, function($a,$b){
            return strtotime($b['last_message_at']) <=> strtotime($a['last_message_at']);
        });

        return response()->json($out);
    }
}
