<?php
namespace App\Http\Controllers;

use App\Services\ChatGPTServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatBotController extends Controller
{
    protected $chatGPTService;

    public function __construct(ChatGPTServices $chatGPTService)
    {
        $this->chatGPTService = $chatGPTService;
    }

    public function handleChat(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:2000',
            ]);

            $message = $validated['message'];

            $response = $this->chatGPTService->handleUserMessage($message);

            // لو الـ service رجع error بشكل موحد
            if (!isset($response['status']) || $response['status'] !== 'success') {
                Log::error('ChatBotController error response from service', [
                    'service_response' => $response,
                    'user_message' => $message,
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => $response['message'] ?? 'An error occurred while processing your request.',
                ], 500);
            }

            return response()->json([
                'status'   => 'success',
                'response' => $response['response'],
                'language' => $response['language'] ?? 'en',
                'query_type' => $response['query_type'] ?? 'general',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid input. Please send a valid text message (max 2000 characters).',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('ChatBotController exception: ' . $e->getMessage(), [
                'message' => $request->input('message', 'N/A'),
                'trace'   => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred while processing your request.',
            ], 500);
        }
    }
}
