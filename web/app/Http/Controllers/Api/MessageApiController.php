<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;

class MessageApiController extends Controller
{
    // GET /api/messages
    // Supports either: ?sender_id=..&receiver_id=..  (conversation between two users)
    // or: ?user_id=.. (all messages where user is sender or receiver)
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);
        $uid = (int) $user->id;
        $hasSenderDeleted = Schema::hasColumn('messages', 'sender_deleted');
        $hasReceiverDeleted = Schema::hasColumn('messages', 'receiver_deleted');

        // conversation between two users
        if ($request->filled('sender_id') && $request->filled('receiver_id')) {
            $s = (int)$request->input('sender_id');
            $r = (int)$request->input('receiver_id');

            if ($uid !== $s && $uid !== $r) {
                return response()->json(['message' => 'Unauthenticated or unauthorized'], 401);
            }

            // eager load sender and receiver so clients can display participant names
            $msgs = Message::with(['sender', 'receiver'])->where(function($q) use ($s,$r) {
                $q->where('sender_id', $s)->where('receiver_id', $r);
            })->orWhere(function($q) use ($s,$r) {
                $q->where('sender_id', $r)->where('receiver_id', $s);
            })->when($hasSenderDeleted || $hasReceiverDeleted, function($q) use ($uid, $hasSenderDeleted, $hasReceiverDeleted) {
                $q->where(function($q2) use ($uid, $hasSenderDeleted, $hasReceiverDeleted) {
                    $q2->where(function($q3) use ($uid, $hasSenderDeleted) {
                        $q3->where('sender_id', $uid);
                        if ($hasSenderDeleted) {
                            $q3->where(function($q4) {
                                $q4->whereNull('sender_deleted')->orWhere('sender_deleted', false);
                            });
                        }
                    })->orWhere(function($q3) use ($uid, $hasReceiverDeleted) {
                        $q3->where('receiver_id', $uid);
                        if ($hasReceiverDeleted) {
                            $q3->where(function($q4) {
                                $q4->whereNull('receiver_deleted')->orWhere('receiver_deleted', false);
                            });
                        }
                    });
                });
            })->orderBy('created_at','asc')->get();

            return response()->json($msgs);
        }

        // messages for a single user (sent or received)
        if ($request->filled('user_id')) {
            $uid = (int)$request->input('user_id');
            if ($uid !== (int)$user->id) {
                return response()->json(['message' => 'Unauthenticated or unauthorized'], 401);
            }
            $msgs = Message::with(['sender', 'receiver'])
                ->where(function($q) use ($uid) {
                    $q->where('sender_id', $uid)->orWhere('receiver_id', $uid);
                })
                ->when($hasSenderDeleted || $hasReceiverDeleted, function($q) use ($uid, $hasSenderDeleted, $hasReceiverDeleted) {
                    $q->where(function($q2) use ($uid, $hasSenderDeleted, $hasReceiverDeleted) {
                        $q2->where(function($q3) use ($uid, $hasSenderDeleted) {
                            $q3->where('sender_id', $uid);
                            if ($hasSenderDeleted) {
                                $q3->where(function($q4) {
                                    $q4->whereNull('sender_deleted')->orWhere('sender_deleted', false);
                                });
                            }
                        })->orWhere(function($q3) use ($uid, $hasReceiverDeleted) {
                            $q3->where('receiver_id', $uid);
                            if ($hasReceiverDeleted) {
                                $q3->where(function($q4) {
                                    $q4->whereNull('receiver_deleted')->orWhere('receiver_deleted', false);
                                });
                            }
                        });
                    });
                })
                ->orderBy('created_at','asc')->get();

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
            'message' => ['nullable','string','max:2000','required_without:media'],
            'listing_id' => ['nullable','integer'],
            'reply_to_id' => ['nullable','integer'],
            'media' => ['nullable','file','mimes:jpg,jpeg,png,gif,webp','max:8192']
        ]);

        $user = $request->user();
        $senderId = (int)$request->input('sender_id');

        // Basic authorization: ensure authenticated user is the sender
        if (!$user || $user->id !== $senderId) {
            return response()->json(['message' => 'Unauthenticated or unauthorized'], 401);
        }

        $mediaUrl = null;
        $mediaType = null;
        if ($request->hasFile('media')) {
            try {
                $file = $request->file('media');
                $path = $file->store('messages', 'public');
                // serve through /storage (requires: php artisan storage:link)
                $mediaUrl = asset('storage/' . $path);
                $mediaType = $file->getMimeType();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Media upload failed'], 500);
            }
        }

        $m = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => (int)$request->input('receiver_id'),
            'message' => $request->input('message') ?: '',
            'listing_id' => $request->input('listing_id') ?: null,
            'reply_to_id' => $request->input('reply_to_id') ?: null,
            'media_url' => $mediaUrl,
            'media_type' => $mediaType,
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

        if (!Schema::hasColumn('messages', 'read_at')) {
            return response()->json(['updated' => 0]);
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

        $senderUpdated = Message::where('sender_id', $uid)
            ->where('receiver_id', $other)
            ->update(['sender_deleted' => true]);

        $receiverUpdated = Message::where('receiver_id', $uid)
            ->where('sender_id', $other)
            ->update(['receiver_deleted' => true]);

        return response()->json([
            'sender_updated' => $senderUpdated,
            'receiver_updated' => $receiverUpdated,
        ]);
    }

    // GET /api/conversations
    public function conversations(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json([], 200);

        $uid = $user->id;
        $hasSenderDeleted = Schema::hasColumn('messages', 'sender_deleted');
        $hasReceiverDeleted = Schema::hasColumn('messages', 'receiver_deleted');

        $msgs = Message::where(function($q) use ($uid) {
            $q->where('sender_id', $uid)->orWhere('receiver_id', $uid);
        })->when($hasSenderDeleted || $hasReceiverDeleted, function($q) use ($uid, $hasSenderDeleted, $hasReceiverDeleted) {
            $q->where(function($q2) use ($uid, $hasSenderDeleted, $hasReceiverDeleted) {
                $q2->where(function($q3) use ($uid, $hasSenderDeleted) {
                    $q3->where('sender_id', $uid);
                    if ($hasSenderDeleted) {
                        $q3->where(function($q4) {
                            $q4->whereNull('sender_deleted')->orWhere('sender_deleted', false);
                        });
                    }
                })->orWhere(function($q3) use ($uid, $hasReceiverDeleted) {
                    $q3->where('receiver_id', $uid);
                    if ($hasReceiverDeleted) {
                        $q3->where(function($q4) {
                            $q4->whereNull('receiver_deleted')->orWhere('receiver_deleted', false);
                        });
                    }
                });
            });
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
