<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class ChatGPTServices
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client([
            'verify' => env('APP_ENV') === 'production' ? true : false,
        ]);
        $this->apiKey = env('OPENAI_API_KEY');

        if (empty($this->apiKey)) {
            Log::error('OpenAI API key is missing in configuration.');
            throw new \Exception('OpenAI API key is not configured or is empty.');
        }
    }

    /**
     * Handle user message with intelligent academic research-focused responses
     *
     * @param string $message
     * @return array
     */
    public function handleUserMessage(string $message): array
    {
        try {
            $language = $this->detectLanguage($message);
            $queryType = $this->analyzeQueryType($message);
            $prompt = $this->buildIntelligentPrompt($message, $queryType, $language);

            $response = $this->client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'gpt-4', // Using GPT-4 for better academic accuracy
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $this->getAdvancedSystemPrompt($language, $queryType),
                        ],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'max_tokens' => 2000,
                    'temperature' => 0.3, // Lower temperature for more precise academic responses
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            return [
                'status' => 'success',
                'response' => $body['choices'][0]['message']['content'] ?? 'No response from AI.',
                'language' => $language,
                'query_type' => $queryType,
            ];
        } catch (RequestException $e) {
            Log::error('Failed to connect to ChatGPT API: ' . $e->getMessage(), [
                'request' => $e->getRequest()->getBody()->getContents(),
                'response' => $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : null,
            ]);
            return [
                'status' => 'error',
                'message' => $this->getErrorMessage($language, 'api_error'),
                'error' => $e->getMessage(),
            ];
        } catch (\Exception $e) {
            Log::error('Unexpected error in ChatGPTService: ' . $e->getMessage(), [
                'message' => $message,
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'status' => 'error',
                'message' => $this->getErrorMessage($language, 'general_error'),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Analyze the type of academic query
     *
     * @param string $message
     * @return string
     */
    private function analyzeQueryType(string $message): string
    {
        $message = strtolower($message);

        // Citation and formatting queries
        if (preg_match('/\b(citation|cite|reference|bibliography|apa|mla|chicago|ieee|harvard|vancouver|اقتباس|مرجع|مراجع|توثيق|استشهاد)\b/i', $message)) {
            return 'citation';
        }

        // AI accuracy and features
        if (preg_match('/\b(accuracy|ai|artificial intelligence|correction|quality|نسبة النجاح|دقة|ذكاء اصطناعي|تصحيح|جودة)\b/i', $message)) {
            return 'ai_features';
        }

        // File format queries
        if (preg_match('/\b(file|format|pdf|docx|doc|upload|size|حجم|ملف|صيغة|رفع)\b/i', $message)) {
            return 'file_format';
        }

        // Security and privacy
        if (preg_match('/\b(security|privacy|safe|secure|gdpr|encryption|data|أمان|خصوصية|آمن|تشفير|بيانات)\b/i', $message)) {
            return 'security';
        }

        // Pricing and plans
        if (preg_match('/\b(price|pricing|cost|plan|subscription|payment|free|سعر|تكلفة|خطة|اشتراك|دفع|مجاني)\b/i', $message)) {
            return 'pricing';
        }

        // How to use / getting started
        if (preg_match('/\b(how|start|begin|use|guide|tutorial|process|كيف|ابدأ|استخدام|دليل|عملية)\b/i', $message)) {
            return 'how_to_use';
        }

        // University/institutional queries
        if (preg_match('/\b(university|institution|academic|student|research|thesis|dissertation|جامعة|مؤسسة|أكاديمي|طالب|بحث|رسالة|أطروحة)\b/i', $message)) {
            return 'institutional';
        }

        // Language support
        if (preg_match('/\b(language|arabic|english|translate|لغة|عربي|انجليزي|ترجمة)\b/i', $message)) {
            return 'language';
        }

        // Features and capabilities
        if (preg_match('/\b(feature|capability|function|can you|what does|ميزة|قدرة|وظيفة|هل يمكن|ماذا)\b/i', $message)) {
            return 'features';
        }

        // General help
        if (preg_match('/\b(help|assist|support|question|مساعدة|دعم|سؤال)\b/i', $message)) {
            return 'help';
        }

        return 'general';
    }

    /**
     * Get advanced system prompt based on query type and language
     *
     * @param string $language
     * @param string $queryType
     * @return string
     */
    private function getAdvancedSystemPrompt(string $language, string $queryType): string
    {
        $basePrompt = "You are the Guidelines Sync AI Assistant, an expert in academic research, thesis formatting, citation standards, and scholarly writing. You have deep knowledge of:

- Academic citation styles (APA, MLA, Chicago, IEEE, Harvard, Vancouver, and 15+ other standards)
- Research paper structure and formatting
- Thesis and dissertation requirements
- Academic writing best practices
- Scholarly research methodologies
- University institutional requirements
- GDPR compliance and academic data security
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
                $basePrompt .= "Explain Guidelines Sync's AI capabilities, accuracy rates (98%), machine learning training on 1M+ peer-reviewed papers, and how the AI correction system works. Highlight the side-by-side comparison feature.";
                break;
            case 'file_format':
                $basePrompt .= "Detail supported file formats (PDF, DOCX, DOC), file size limits (50MB max), OCR capabilities for scanned documents, and upload procedures.";
                break;
            case 'security':
                $basePrompt .= "Explain GDPR compliance, end-to-end encryption (AES-256), automatic 30-day data deletion, secure processing, and data privacy measures. Emphasize academic confidentiality.";
                break;
            case 'pricing':
                $basePrompt .= "Provide information about free trials, subscription plans, university institutional licensing, and pricing tiers. Mention value proposition and cost-effectiveness for academic institutions.";
                break;
            case 'how_to_use':
                $basePrompt .= "Guide users through the 4-step process: Upload Document → AI Analysis → Review Changes → Download Result. Explain each step clearly with practical tips.";
                break;
            case 'institutional':
                $basePrompt .= "Focus on university partnerships, institutional licensing, bulk processing, academic compliance, and how Guidelines Sync supports educational institutions with research quality assurance.";
                break;
            case 'language':
                $basePrompt .= "Explain bilingual support (Arabic and English), multi-language citation handling, RTL text support, and how the platform processes documents in different languages.";
                break;
            case 'features':
                $basePrompt .= "Highlight key features: AI-powered correction, side-by-side comparison, 20+ citation standards, manual override, version history, plagiarism detection integration, and real-time preview.";
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
- Reference academic standards and best practices
- Maintain a helpful, supportive tone
- If asked about features you're unsure about, acknowledge limitations honestly
- Encourage users to contact support@guidelinessync.com for complex institutional inquiries
- Always emphasize the 98% accuracy rate and quality assurance

FORMATTING:
- Use Markdown for better readability
- Use **bold** for important points
- Use bullet points (•) for lists
- Use numbered lists for sequential steps
- Keep paragraphs concise (2-3 sentences max)
- Use headers (##) to organize longer responses

TONE:
- Professional yet approachable
- Scholarly but not overly complex
- Supportive and encouraging
- Confident in platform capabilities
- Respectful of academic rigor";

        return $basePrompt;
    }

    /**
     * Build intelligent prompt based on query context
     *
     * @param string $message
     * @param string $queryType
     * @param string $language
     * @return string
     */
    private function buildIntelligentPrompt(string $message, string $queryType, string $language): string
    {
        $contextualPrompt = "User Query: \"$message\"\n";
        $contextualPrompt .= "Query Type: " . ucfirst($queryType) . "\n";
        $contextualPrompt .= "Language: " . ($language === 'ar' ? 'Arabic' : 'English') . "\n\n";

        switch ($queryType) {
            case 'citation':
                $contextualPrompt .= "Provide detailed information about citation styles supported by Guidelines Sync. Explain formatting rules, differences between styles, and how the AI handles citations. Include specific examples if relevant.";
                break;
            case 'ai_features':
                $contextualPrompt .= "Explain Guidelines Sync's AI technology, the 98% accuracy rate, training methodology (1M+ peer-reviewed papers), and how the correction system works. Highlight the side-by-side comparison feature that shows original vs corrected versions.";
                break;
            case 'file_format':
                $contextualPrompt .= "Detail the supported file formats (PDF, DOCX, DOC), maximum file size (50MB), OCR capabilities for scanned documents, and any file preparation recommendations.";
                break;
            case 'security':
                $contextualPrompt .= "Explain security measures: GDPR compliance, AES-256 encryption, automatic 30-day data deletion, secure processing environment, and how academic confidentiality is maintained.";
                break;
            case 'pricing':
                $contextualPrompt .= "Provide pricing information: free trial availability, subscription tiers, institutional licensing options for universities, and value proposition. Direct users to contact partners@guidelinessync.com for university licensing.";
                break;
            case 'how_to_use':
                $contextualPrompt .= "Guide the user through using Guidelines Sync with the 4-step process:
1. Upload Document (PDF, DOCX, DOC - max 50MB)
2. AI Analysis (structure, formatting, citations checked against standards)
3. Review Changes (side-by-side comparison with manual override)
4. Download Result (perfectly formatted document)

Provide practical tips for each step.";
                break;
            case 'institutional':
                $contextualPrompt .= "Focus on university and institutional use: partnerships with 25+ universities, bulk processing capabilities, institutional licensing, academic compliance, and how Guidelines Sync supports research quality at the institutional level.";
                break;
            case 'language':
                $contextualPrompt .= "Explain bilingual support (Arabic and English), how the platform handles RTL text, multi-language citation formatting, and language detection capabilities.";
                break;
            case 'features':
                $contextualPrompt .= "Highlight Guidelines Sync's key features:
- AI-powered correction (98% accuracy)
- Side-by-side comparison (original vs corrected)
- 20+ citation standards (APA, MLA, Chicago, IEEE, etc.)
- Full manual override and editing
- Unlimited version history
- Plagiarism detection integration
- Real-time preview
- Multi-language support

Explain how these features benefit academic research.";
                break;
            case 'help':
                $contextualPrompt .= "Explain how you can help with:
- Citation and formatting questions
- Platform features and capabilities
- Document upload and processing
- Academic writing best practices
- Research documentation standards
- Getting started with Guidelines Sync

Offer to answer specific questions.";
                break;
            default:
                $contextualPrompt .= "Provide comprehensive, accurate information about Guidelines Sync's academic research assistance capabilities as they relate to the user's question.";
        }

        $contextualPrompt .= "\n\nProvide a helpful, well-structured response that directly addresses the user's query with specific, actionable information.";

        return $contextualPrompt;
    }

    /**
     * Detect message language (Arabic or English)
     *
     * @param string $message
     * @return string
     */
    private function detectLanguage(string $message): string
    {
        // Enhanced Arabic detection with comprehensive patterns
        if (
            preg_match('/[ء-ي]/u', $message) ||
            preg_match('/\b(في|من|إلى|على|مع|هذا|هذه|ذلك|تلك|أين|متى|كيف|ماذا|لماذا|هل|ما|كم)\b/u', $message)
        ) {
            return 'ar';
        }
        return 'en';
    }

    /**
     * Get error message in appropriate language
     *
     * @param string $language
     * @param string $errorType
     * @return string
     */
    private function getErrorMessage(string $language, string $errorType): string
    {
        $messages = [
            'ar' => [
                'api_error' => 'عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني على support@guidelinessync.com',
                'general_error' => 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بفريق الدعم للمساعدة.',
            ],
            'en' => [
                'api_error' => 'Sorry, there was a connection error with the AI service. Please try again or contact support at support@guidelinessync.com',
                'general_error' => 'Sorry, an unexpected error occurred. Please try again or contact our support team for assistance.',
            ]
        ];

        return $messages[$language][$errorType] ?? $messages['en'][$errorType];
    }
}