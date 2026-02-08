<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ChatGPTService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
        $this->baseUrl = config('services.openai.base_url', 'https://api.openai.com/v1');
    }

    public function processResearchDocument($text, $options = [])
    {
        $prompt = $this->buildResearchProcessingPrompt($text, $options);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/chat/completions", [
            'model' => 'gpt-4o',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are an expert academic editor specializing in research papers, theses, and dissertations. Provide precise corrections for grammar, structure, academic style, citations (APA/MLA/IEEE), and clarity while preserving original meaning.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'max_tokens' => 4000,
            'temperature' => 0.1,
        ]);

        if ($response->successful()) {
            $result = $response->json()['choices'][0]['message']['content'];
            
            // Parse AI response (JSON format expected)
            return json_decode($result, true);
        }

        return [
            'error' => 'AI processing failed',
            'corrected_text' => $text,
            'suggestions' => [],
            'accuracy' => 0
        ];
    }

    private function buildResearchProcessingPrompt($text, $options)
    {
        return json_encode([
            'task' => 'academic_correction',
            'text' => $text,
            'language' => $options['language'] ?? 'en',
            'category' => $options['category'] ?? 'general',
            'requirements' => [
                'correct_grammar_and_style' => true,
                'improve_academic_tone' => true,
                'check_citation_formats' => true,
                'enhance_structure' => true,
                'preserve_original_meaning' => true,
                'provide_side_by_side_comparison' => true
            ],
            'response_format' => 'json',
            'include' => [
                'corrected_text',
                'original_text',
                'suggestions',
                'accuracy_score',
                'improvements_made'
            ]
        ]);
    }
}
