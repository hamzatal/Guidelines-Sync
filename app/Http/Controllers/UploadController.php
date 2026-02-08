<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Services\ChatGPTService;
use App\Models\Document;
use Inertia\Inertia;

class UploadController extends Controller
{
    protected $chatGPTService;

    public function __construct(ChatGPTService $chatGPTService)
    {
        $this->chatGPTService = $chatGPTService;
    }

    public function create()
    {
        return Inertia::render('Upload');
    }

    public function store(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'language' => 'nullable|in:en,ar,fr,de,es',
            'category' => 'nullable|string|max:100',
            'privacy' => 'in:private,public',
        ]);

        $user = Auth::user();
        $documentPath = $request->file('document')->store('documents', 'private');

        $document = Document::create([
            'user_id' => $user->id,
            'title' => $request->title ?? $request->file('document')->getClientOriginalName(),
            'original_path' => $documentPath,
            'description' => $request->description,
            'language' => $request->language ?? 'en',
            'category' => $request->category,
            'privacy' => $request->privacy ?? 'private',
            'status' => 'processing',
            'ai_processed' => false,
        ]);

        // Start AI Processing (Queue Job or Background Process)
        $this->processDocument($document);

        return redirect()->route('documents.show', $document->id)
            ->with('message', 'Document uploaded successfully! AI processing started.');
    }

    private function processDocument(Document $document)
    {
        // Extract text from document (implement PDF/DOCX parsing)
        $text = $this->extractText(Storage::disk('private')->path($document->original_path));
        
        // AI Processing using ChatGPT
        $aiResponse = $this->chatGPTService->processResearchDocument($text, [
            'language' => $document->language,
            'category' => $document->category,
        ]);

        // Save processed document
        $processedPath = $this->saveProcessedDocument($aiResponse['corrected_text']);
        
        $document->update([
            'processed_path' => $processedPath,
            'ai_suggestions' => $aiResponse['suggestions'] ?? [],
            'status' => 'completed',
            'ai_processed' => true,
            'accuracy_score' => $aiResponse['accuracy'] ?? 98,
        ]);
    }

    private function extractText($filePath)
    {
        // Implement PDF/DOCX text extraction
        // Use libraries like Smalot/PdfParser or PhpOffice/PhpWord
        return file_get_contents($filePath); // Simplified
    }

    private function saveProcessedDocument($content)
    {
        $filename = 'processed_' . Str::uuid() . '.docx';
        Storage::disk('private')->put("documents/processed/{$filename}", $content);
        return "documents/processed/{$filename}";
    }
}
