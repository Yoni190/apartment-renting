<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatBotController extends Controller
{
    public function chat(Request $request)
    {
        $message = $request->input('message');

        if (!$message) {
            return response()->json(['reply' => 'Message is empty']);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
            'Content-Type' => 'application/json',
        ])->withoutVerifying()
        ->post('https://api.groq.com/openai/v1/chat/completions', [
            "model" => "llama-3.3-70b-versatile",
            "messages" => [
                ["role" => "system", "content" => "
                    You are Gojoye AI, a real estate assistant for Addis Ababa, Ethiopia.

                    You ONLY help with:
                    - Renting apartments
                    - Buying apartments
                    - Selling apartments (for property owners)
                    - Booking tours
                    - Apartment prices, locations, and neighborhoods in Addis Ababa

                    Rules:
                    - ONLY answer questions related to apartments and real estate
                    - If a question is unrelated, politely refuse and guide back to apartments
                    - Keep answers short, clear, and helpful
                    - When possible, suggest useful actions (e.g., browse apartments, book tours)

                    Context:
                    - Platform name: Gojoye
                    - Location: Addis Ababa
                    - Users: clients (buyers and renters) and property owners

                    Tone:
                    - Friendly, professional, concise
                    "],
                ["role" => "user", "content" => $message],
            ],
        ]);

        $data = $response->json();

        if (isset($data['choices'][0]['message']['content'])) {
            return response()->json([
                'reply' => $data['choices'][0]['message']['content']
            ]);
        }

        return response()->json([
            'reply' => 'Error: ' . json_encode($data)
        ]);
    }
}
