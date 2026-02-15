<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class ChatGPTServices
{
    protected Client $client;
    protected string $apiKey;

    public function __construct()
    {
        $this->client = new Client([
            'verify'  => env('APP_ENV') === 'production',
            'timeout' => 30,
        ]);

        $this->apiKey = (string) env('OPENAI_API_KEY');

        if (empty($this->apiKey)) {
            Log::error('OpenAI API key is missing in configuration.');
            throw new \Exception('OpenAI API key is not configured or is empty.');
        }
    }

    /**
     * Handle user message with intelligent academic research-focused responses.
     *
     * @param  string  $message
     * @return array{status:string,response?:string,language?:string,query_type?:string,message?:string}
     */
    public function handleUserMessage(string $message): array
    {
        // نكتشف اللغة في البداية عشان نستخدمها في كل مكان
        $language = $this->detectLanguage($message);

        try {
            $queryType = $this->analyzeQueryType($message);
            $prompt    = $this->buildIntelligentPrompt($message, $queryType, $language);

            $response = $this->client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    // غيرها لو حاب تستخدم موديل آخر
                    'model'       => 'gpt-4o',
                    'messages'    => [
                        [
                            'role'    => 'system',
                            'content' => $this->getAdvancedSystemPrompt($language, $queryType),
                        ],
                        [
                            'role'    => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'max_tokens'  => 2000,
                    'temperature' => 0.3,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            if (!isset($body['choices'][0]['message']['content'])) {
                Log::warning('OpenAI response missing content', ['body' => $body]);

                return [
                    'status'  => 'error',
                    'message' => $this->getErrorMessage($language, 'general_error'),
                ];
            }

            return [
                'status'     => 'success',
                'response'   => $body['choices'][0]['message']['content'],
                'language'   => $language,
                'query_type' => $queryType,
            ];
        } catch (RequestException $e) {
            $apiBody = $e->hasResponse()
                ? (string) $e->getResponse()->getBody()
                : null;

            Log::error('Failed to connect to OpenAI API', [
                'error'    => $e->getMessage(),
                'request'  => (string) $e->getRequest()->getBody(),
                'response' => $apiBody,
            ]);

            return [
                'status'  => 'error',
                'message' => $this->getErrorMessage($language, 'api_error'),
            ];
        } catch (\Exception $e) {
            Log::error('Unexpected error in ChatGPTServices', [
                'error'   => $e->getMessage(),
                'message' => $message,
                'trace'   => $e->getTraceAsString(),
            ]);

            return [
                'status'  => 'error',
                'message' => $this->getErrorMessage($language, 'general_error'),
            ];
        }
    }

    /**
     * Analyze the type of academic query.
     */
    private function analyzeQueryType(string $message): string
    {
        $msg = mb_strtolower($message, 'UTF-8');

        // Citation and formatting queries
        if (preg_match('/\b(citation|cite|reference|bibliography|apa|mla|chicago|ieee|harvard|vancouver|اقتباس|مرجع|مراجع|توثيق|استشهاد)\b/u', $msg)) {
            return 'citation';
        }

        // AI accuracy and features
        if (preg_match('/\b(accuracy|ai|artificial intelligence|correction|quality|نسبة النجاح|دقة|ذكاء اصطناعي|تصحيح|جودة)\b/u', $msg)) {
            return 'ai_features';
        }

        // File format queries
        if (preg_match('/\b(file|format|pdf|docx|doc|upload|size|حجم|ملف|صيغة|رفع)\b/u', $msg)) {
            return 'file_format';
        }

        // Security and privacy
        if (preg_match('/\b(security|privacy|safe|secure|gdpr|encryption|data|أمان|خصوصية|آمن|تشفير|بيانات)\b/u', $msg)) {
            return 'security';
        }

        // Pricing and plans
        if (preg_match('/\b(price|pricing|cost|plan|subscription|payment|free|سعر|تكلفة|خطة|اشتراك|دفع|مجاني)\b/u', $msg)) {
            return 'pricing';
        }

        // How to use / getting started
        if (preg_match('/\b(how|start|begin|use|guide|tutorial|process|كيف|ابدأ|استخدام|دليل|عملية)\b/u', $msg)) {
            return 'how_to_use';
        }

        // University/institutional queries
        if (preg_match('/\b(university|institution|academic|student|research|thesis|dissertation|جامعة|مؤسسة|أكاديمي|طالب|بحث|رسالة|أطروحة)\b/u', $msg)) {
            return 'institutional';
        }

        // Language support
        if (preg_match('/\b(language|arabic|english|translate|لغة|عربي|انجليزي|ترجمة)\b/u', $msg)) {
            return 'language';
        }

        // Features and capabilities
        if (preg_match('/\b(feature|capability|function|can you|what does|ميزة|قدرة|وظيفة|هل يمكن|ماذا)\b/u', $msg)) {
            return 'features';
        }

        // General help
        if (preg_match('/\b(help|assist|support|question|مساعدة|دعم|سؤال)\b/u', $msg)) {
            return 'help';
        }

        return 'general';
    }

    /**
     * Build advanced system prompt based on query type and language.
     */
    private function getAdvancedSystemPrompt(string $language, string $queryType): string
    {
        $basePrompt = "You are the Guidelines Sync AI Assistant, an expert in academic research, thesis formatting, citation standards, and scholarly writing. You have deep knowledge of:

- Academic citation styles (APA, MLA, Chicago, IEEE, Harvard, Vancouver, and many other standards)
- Research paper structure and formatting
- Thesis and dissertation requirements
- Academic writing best practices
- Scholarly research methodologies
- University institutional requirements
- Academic data security and privacy
- Multi-language academic support (Arabic and English)

Your role is to help students, researchers, professors, and academic institutions with their research documentation needs.";

        if ($language === 'ar') {
            $basePrompt .= " يجب أن تستجيب دائمًا باللغة العربية عندما يكتب المستخدم بالعربية.";
        } else {
            $basePrompt .= " Always respond in English when the user writes in English.";
        }

        $basePrompt .= "\n\nQUERY TYPE: " . strtoupper($queryType) . "\n";

        switch ($queryType) {
            case 'citation':
                $basePrompt .= "Focus on citation styles, formatting rules, reference management, and bibliography creation. Provide specific examples and explain differences between citation standards.";
                break;
            case 'ai_features':
                $basePrompt .= "Explain Guidelines Sync's AI capabilities for academic editing, how the correction system works, and how it helps with grammar, style, and citations. Highlight the side-by-side comparison feature.";
                break;
            case 'file_format':
                $basePrompt .= "Detail supported file formats (e.g., PDF, DOCX, DOC), typical file size limits, and upload procedures.";
                break;
            case 'security':
                $basePrompt .= "Explain data protection, privacy considerations, and how academic documents are handled securely. Emphasize confidentiality.";
                break;
            case 'pricing':
                $basePrompt .= "Provide general information about possible pricing models, trials, and institutional licensing in a hypothetical way, and encourage users to contact official support for current details.";
                break;
            case 'how_to_use':
                $basePrompt .= "Guide users through a clear multi-step process for using the platform to format their research documents. Explain each step clearly with practical tips.";
                break;
            case 'institutional':
                $basePrompt .= "Focus on how the platform could support universities and institutions, bulk processing, and research quality workflows.";
                break;
            case 'language':
                $basePrompt .= "Explain bilingual support (Arabic and English), multi-language citation handling, RTL text support, and how the platform can process documents in different languages.";
                break;
            case 'features':
                $basePrompt .= "Highlight key features: AI-powered correction, side-by-side comparison, support for multiple citation standards, manual override, and real-time preview if appropriate.";
                break;
            case 'help':
                $basePrompt .= "Provide comprehensive guidance on how you can assist with research documentation, explain available features, and offer to answer specific questions about academic writing or the platform.";
                break;
            default:
                $basePrompt .= "Provide comprehensive academic assistance covering research documentation, formatting, citations, and platform features as relevant to the user's inquiry.";
        }

        $basePrompt .= "

RESPONSE GUIDELINES:
- Be professional, precise, and academically oriented
- Provide actionable, specific information
- Use clear examples when explaining citation formats
- Include step-by-step instructions when relevant
- Reference academic standards and best practices when helpful
- Maintain a helpful, supportive tone
- If asked about features you're unsure about, acknowledge limitations honestly
- Encourage users to contact the official support email for complex or institution-specific inquiries

FORMATTING:
- Use Markdown for better readability
- Use **bold** for important points
- Use bullet points (•) for lists
- Use numbered lists for sequential steps
- Keep paragraphs concise (2–3 sentences max)
- Use headers (##) to organize longer responses

TONE:
- Professional yet approachable
- Scholarly but not overly complex
- Supportive and encouraging
- Respectful of academic rigor";

        return $basePrompt;
    }

    /**
     * Build intelligent prompt based on query context.
     */
    private function buildIntelligentPrompt(string $message, string $queryType, string $language): string
    {
        $contextualPrompt  = "User Query: \"{$message}\"\n";
        $contextualPrompt .= "Query Type: " . ucfirst($queryType) . "\n";
        $contextualPrompt .= "Language: " . ($language === 'ar' ? 'Arabic' : 'English') . "\n\n";

        switch ($queryType) {
            case 'citation':
                $contextualPrompt .= "Provide detailed information about citation styles relevant to the user's request. Explain formatting rules, differences between styles, and how an AI assistant could help handle citations. Include specific examples if relevant.";
                break;
            case 'ai_features':
                $contextualPrompt .= "Explain the AI's capabilities for academic editing, how it improves grammar, style, and citations, and how side-by-side comparison of original vs. corrected text is useful.";
                break;
            case 'file_format':
                $contextualPrompt .= "Detail typical supported file formats for academic platforms (like PDF, DOCX, DOC), reasonable file size limits, and any file preparation recommendations.";
                break;
            case 'security':
                $contextualPrompt .= "Explain general best practices for academic data security and privacy, such as encryption, limited data retention, and confidentiality.";
                break;
            case 'pricing':
                $contextualPrompt .= "Provide general guidance about how academic tools may structure pricing (e.g., free tiers, subscriptions, institutional licenses) and encourage contacting official support for exact details.";
                break;
            case 'how_to_use':
                $contextualPrompt .= "Guide the user through a clear step-by-step process to use an academic formatting assistant:
1. Upload the document (e.g., thesis, dissertation, or article)
2. Choose target journal or citation style
3. Let the AI analyze structure, formatting, and references
4. Review suggested changes (side-by-side if available)
5. Export or download the formatted version

Provide practical tips for each step.";
                break;
            case 'institutional':
                $contextualPrompt .= "Focus on how academic institutions might benefit from such a platform: supporting supervisors, standardizing formatting, and improving research output quality.";
                break;
            case 'language':
                $contextualPrompt .= "Explain how the assistant can handle both Arabic and English, respect RTL vs LTR text, and work with multi-language citations.";
                break;
            case 'features':
                $contextualPrompt .= "Highlight typical features of an academic assistant platform and how they help students and researchers in practice.";
                break;
            case 'help':
                $contextualPrompt .= "Explain how you can assist with:
- Citation and formatting questions
- Document upload and processing
- Academic writing best practices
- Getting started with an academic formatting assistant

Offer to answer specific follow-up questions.";
                break;
            default:
                $contextualPrompt .= "Provide comprehensive, accurate information about how an academic formatting assistant could help the user with their particular question.";
        }

        $contextualPrompt .= "\n\nProvide a helpful, well-structured response that directly addresses the user's query with specific, actionable information.";

        return $contextualPrompt;
    }

    /**
     * Detect message language (Arabic or English).
     */
    private function detectLanguage(string $message): string
    {
        if (
            preg_match('/[ء-ي]/u', $message) ||
            preg_match('/\b(في|من|إلى|على|مع|هذا|هذه|ذلك|تلك|أين|متى|كيف|ماذا|لماذا|هل|ما|كم)\b/u', $message)
        ) {
            return 'ar';
        }

        return 'en';
    }

    /**
     * Get error message in appropriate language.
     */
    private function getErrorMessage(string $language, string $errorType): string
    {
        $messages = [
            'ar' => [
                'api_error'     => 'عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع فريق الدعم.',
                'general_error' => 'عذراً، حدث خطأ غير متوقع أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.',
            ],
            'en' => [
                'api_error'     => 'Sorry, there was a connection error with the AI service. Please try again later or contact the support team.',
                'general_error' => 'Sorry, an unexpected error occurred while processing your request. Please try again later.',
            ],
        ];

        return $messages[$language][$errorType] ?? $messages['en'][$errorType] ?? 'An error occurred.';
    }
}
