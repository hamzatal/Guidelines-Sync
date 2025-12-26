<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use OpenAI\Laravel\Facades\OpenAI;

class DocumentController extends Controller
{
    /**
     * Process uploaded document
     */
    public function process(Request $request)
    {
        try {
            Log::info('=== Starting document processing ===');
            Log::info('Request data:', [
                'has_file' => $request->hasFile('document'),
                'content_type' => $request->header('Content-Type'),
                'method' => $request->method()
            ]);

            // محاولة الحصول على الملف
            $file = null;

            if ($request->hasFile('document')) {
                $file = $request->file('document');
                Log::info('Got file via hasFile()');
            } else {
                // محاولة من allFiles
                $allFiles = $request->allFiles();
                Log::info('All files:', ['files' => $allFiles]);

                if (isset($allFiles['document'])) {
                    $file = $allFiles['document'];
                    Log::info('Got file via allFiles()');
                }
            }

            // التحقق من وجود ملف صالح
            if (!$file) {
                Log::error('No file object found');
                return response()->json([
                    'success' => false,
                    'message' => 'No document uploaded'
                ], 422);
            }

            // التحقق من نوع الملف
            if (!($file instanceof \Illuminate\Http\UploadedFile)) {
                Log::error('Invalid file object type', [
                    'type' => gettype($file),
                    'class' => is_object($file) ? get_class($file) : 'N/A'
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file object'
                ], 422);
            }

            // معلومات الملف
            $realPath = $file->getRealPath();
            $originalName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType();
            $isValid = $file->isValid();

            Log::info('File details:', [
                'name' => $originalName,
                'size' => $fileSize,
                'mime' => $mimeType,
                'is_valid' => $isValid,
                'real_path' => $realPath,
                'exists' => file_exists($realPath),
                'readable' => is_readable($realPath)
            ]);

            // التحقق من صحة الملف
            if (!$isValid) {
                Log::error('File is not valid', [
                    'error' => $file->getError(),
                    'error_message' => $file->getErrorMessage()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file: ' . $file->getErrorMessage()
                ], 422);
            }

            // التحقق من وجود الملف الفعلي
            if (!file_exists($realPath) || !is_readable($realPath)) {
                Log::error('File not accessible', [
                    'real_path' => $realPath,
                    'exists' => file_exists($realPath),
                    'readable' => is_readable($realPath)
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'File is not accessible'
                ], 422);
            }

            $journalName = $request->input('journal_name', 'Unknown Journal');
            $useGpt = $request->input('use_gpt', false);

            // إنشاء المجلدات إذا لم تكن موجودة
            $originalDir = storage_path('app/public/documents/original');
            $processedDir = storage_path('app/public/documents/processed');

            if (!file_exists($originalDir)) {
                mkdir($originalDir, 0755, true);
                Log::info('Created directory:', ['dir' => $originalDir]);
            }

            if (!file_exists($processedDir)) {
                mkdir($processedDir, 0755, true);
                Log::info('Created directory:', ['dir' => $processedDir]);
            }

            // حفظ الملف الأصلي
            try {
                $originalPath = $file->store('documents/original', 'public');
                Log::info('File stored successfully', ['path' => $originalPath]);
            } catch (\Exception $e) {
                Log::error('Failed to store file', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to store file: ' . $e->getMessage()
                ], 500);
            }

            // استخراج النص (مبسط)
            $originalContent = "=== ORIGINAL DOCUMENT ===\n\n";
            $originalContent .= "File: {$originalName}\n";
            $originalContent .= "Journal: {$journalName}\n";
            $originalContent .= "Size: " . round($fileSize / 1024, 2) . " KB\n";
            $originalContent .= "Type: {$mimeType}\n\n";
            $originalContent .= "This is a demonstration version.\n";
            $originalContent .= "Full text extraction requires PDF/Word parsing libraries (smalot/pdfparser, phpoffice/phpword).\n\n";
            $originalContent .= "To enable full text extraction, run:\n";
            $originalContent .= "composer require smalot/pdfparser\n";
            $originalContent .= "composer require phpoffice/phpword\n\n";
            $originalContent .= str_repeat("Sample paragraph for demonstration purposes. ", 30);

            // تنسيق المستند
            $formattedContent = $this->formatDocument($originalContent, $journalName);

            // حفظ المستند المنسق
            $processedFileName = 'formatted_' . time() . '_' . pathinfo($originalName, PATHINFO_FILENAME) . '.txt';
            $processedPath = 'documents/processed/' . $processedFileName;

            try {
                Storage::disk('public')->put($processedPath, $formattedContent);
                Log::info('Processed file saved', ['path' => $processedPath]);
            } catch (\Exception $e) {
                Log::error('Failed to save processed file', [
                    'error' => $e->getMessage()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save processed file'
                ], 500);
            }

            Log::info('=== Document processing completed successfully ===');

            return response()->json([
                'success' => true,
                'message' => 'Document processed successfully',
                'original' => [
                    'id' => time(),
                    'filename' => $originalName,
                    'preview_url' => Storage::url($originalPath),
                    'content' => $originalContent
                ],
                'processed' => [
                    'id' => time() + 1,
                    'filename' => $processedFileName,
                    'preview_url' => Storage::url($processedPath),
                    'content' => $formattedContent
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('=== Document processing FAILED ===', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format document (alternative endpoint)
     */

    /**
     * Download processed document
     */
    public function download($id)
    {
        try {
            // البحث عن المستند في قاعدة البيانات (إذا كان موجوداً)
            if (auth()->check()) {
                $document = Document::where('id', $id)
                    ->where('user_id', auth()->id())
                    ->first();

                if ($document && Storage::disk('public')->exists($document->file_path)) {
                    return Storage::disk('public')->download($document->file_path, $document->original_filename);
                }
            }

            // إذا لم يكن موجوداً في قاعدة البيانات، ابحث في المجلد مباشرة
            $files = Storage::disk('public')->files('documents/processed');

            foreach ($files as $file) {
                if (str_contains($file, (string)$id)) {
                    return Storage::disk('public')->download($file);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Download error:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error downloading document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update document content
     */
    public function update(Request $request, $id)
    {
        try {
            $content = $request->input('content');

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Content is required'
                ], 422);
            }

            // حفظ المحتوى المحدث
            $fileName = 'updated_' . time() . '_' . $id . '.txt';
            $filePath = 'documents/processed/' . $fileName;

            Storage::disk('public')->put($filePath, $content);

            return response()->json([
                'success' => true,
                'message' => 'Document updated successfully',
                'document' => [
                    'id' => $id,
                    'filename' => $fileName,
                    'content' => $content,
                    'preview_url' => Storage::url($filePath)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Update error:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error updating document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Improve document with AI
     */
    public function aiImprove(Request $request)
    {
        try {
            $content = $request->input('content');
            $journalName = $request->input('journal_name', 'Academic Journal');

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Content is required'
                ], 422);
            }

            // محاولة استخدام OpenAI إذا كان متوفراً
            if (!empty(env('OPENAI_API_KEY'))) {
                try {
                    $prompt = "You are an expert academic writing assistant. Improve the following research paper content for submission to '{$journalName}':\n\n";
                    $prompt .= "Tasks:\n";
                    $prompt .= "1. Fix grammar and improve academic writing style\n";
                    $prompt .= "2. Enhance clarity and coherence\n";
                    $prompt .= "3. Ensure proper academic tone\n";
                    $prompt .= "4. Keep the original meaning intact\n\n";
                    $prompt .= "Content:\n{$content}";

                    $response = OpenAI::chat()->create([
                        'model' => 'gpt-4',
                        'messages' => [
                            ['role' => 'system', 'content' => 'You are an expert academic writing assistant.'],
                            ['role' => 'user', 'content' => $prompt]
                        ],
                        'temperature' => 0.7,
                        'max_tokens' => 3000
                    ]);

                    $improved = $response['choices'][0]['message']['content'];

                    return response()->json([
                        'success' => true,
                        'improved_content' => $improved
                    ]);
                } catch (\Exception $aiError) {
                    Log::warning('AI improvement failed, using fallback', [
                        'error' => $aiError->getMessage()
                    ]);
                }
            }

            // Fallback: تحسين بسيط
            $improved = "=== AI IMPROVED VERSION ===\n\n";
            $improved .= "Note: This is a demonstration version. Full AI improvements require OpenAI API key.\n\n";
            $improved .= $content;
            $improved .= "\n\n=== SUGGESTED IMPROVEMENTS ===\n";
            $improved .= "- Grammar and spelling corrections\n";
            $improved .= "- Academic style enhancements\n";
            $improved .= "- Citation formatting improvements\n";
            $improved .= "- Sentence structure optimization\n";
            $improved .= "- Clarity and coherence enhancements\n";

            return response()->json([
                'success' => true,
                'improved_content' => $improved,
                'note' => 'Using demonstration mode. Set OPENAI_API_KEY in .env for full AI improvements.'
            ]);
        } catch (\Exception $e) {
            Log::error('AI improve error:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error improving document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user documents
     */
    public function index(Request $request)
    {
        try {
            // إرجاع مصفوفة فارغة إذا لم يكن هناك user
            if (!auth()->check()) {
                return response()->json([
                    'success' => true,
                    'documents' => [],
                    'pagination' => [
                        'total' => 0,
                        'current_page' => 1,
                        'last_page' => 1
                    ]
                ]);
            }

            $documents = Document::where('user_id', auth()->id())
                ->where('status', 'processed')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'documents' => $documents->items(),
                'pagination' => [
                    'total' => $documents->total(),
                    'current_page' => $documents->currentPage(),
                    'last_page' => $documents->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Index error:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching documents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete document
     */
    public function destroy($id)
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $document = Document::where('id', $id)
                ->where('user_id', auth()->id())
                ->first();

            if (!$document) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found'
                ], 404);
            }

            // Delete file from storage
            if (Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }

            // Delete record
            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Delete error:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error deleting document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ============================================
    // Private Helper Methods
    // ============================================

    /**
     * Format document based on journal
     */
    private function formatDocument($content, $journalName)
    {
        $formatted = "=== FORMATTED DOCUMENT ===\n";
        $formatted .= "Journal: {$journalName}\n";
        $formatted .= "Formatted on: " . date('Y-m-d H:i:s') . "\n";
        $formatted .= "Font: Times New Roman, 12pt\n";
        $formatted .= "Line Spacing: 2.0\n";
        $formatted .= "Citation Style: APA 7th Edition\n";
        $formatted .= "Margins: 2.54cm (1 inch) all sides\n";
        $formatted .= "Page Size: A4 (210 x 297 mm)\n";
        $formatted .= "===========================\n\n";
        $formatted .= $content;
        $formatted .= "\n\n=== END OF FORMATTED DOCUMENT ===";

        return $formatted;
    }

    /**
     * Get journal info from AI (for future use)
     */
    private function getJournalFromAI($journalName)
    {
        try {
            if (empty(env('OPENAI_API_KEY'))) {
                return $this->getDefaultJournalSettings($journalName);
            }

            $prompt = "Provide accurate formatting guidelines for '{$journalName}' academic journal in JSON format with these fields: name, publisher, category, font_family, font_size, line_spacing, citation_style, reference_style, max_pages";

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an expert on academic journal formatting guidelines.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.2
            ]);

            $content = $response['choices'][0]['message']['content'];
            $journal = json_decode($content, true);

            return (object) $journal;
        } catch (\Exception $e) {
            Log::warning('AI journal lookup failed:', ['error' => $e->getMessage()]);
            return $this->getDefaultJournalSettings($journalName);
        }
    }

    /**
     * Get default journal settings
     */
    private function getDefaultJournalSettings($journalName)
    {
        return (object) [
            'name' => $journalName,
            'publisher' => 'Academic Publisher',
            'category' => 'General',
            'font_family' => 'Times New Roman',
            'font_size' => 12,
            'line_spacing' => 2.0,
            'citation_style' => 'APA',
            'reference_style' => 'APA',
            'max_pages' => 30
        ];
    }
}
