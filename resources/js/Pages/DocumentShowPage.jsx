import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";
import {
    FileText,
    Download,
    Edit3,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Sparkles,
    RefreshCw,
    Copy,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    Save,
    Undo,
    Redo
} from "lucide-react";

const DocumentShowPage = ({ document, original_url, enhanced_url }) => {
    const [activeView, setActiveView] = useState('split'); // split, original, enhanced
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState(document.processed_content);
    const [fullscreen, setFullscreen] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [changeHistory, setChangeHistory] = useState([document.processed_content]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        if (editedContent !== document.processed_content) {
            setHasChanges(true);
        }
    }, [editedContent, document.processed_content]);

    const handleEdit = (newContent) => {
        setEditedContent(newContent);
        
        // Update history
        const newHistory = changeHistory.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setChangeHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setEditedContent(changeHistory[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < changeHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setEditedContent(changeHistory[historyIndex + 1]);
        }
    };

    const handleSave = async () => {
        try {
            await router.post(route('documents.update', document.id), {
                processed_content: editedContent
            });
            setHasChanges(false);
            alert('Changes saved successfully!');
        } catch (error) {
            alert('Failed to save changes');
        }
    };

    const handleDownload = () => {
        window.location.href = route('documents.download', document.id);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const guidelines = document.guidelines_applied || {};
    const suggestions = document.ai_suggestions || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-900 text-white">
            <Head title={`Document: ${document.original_filename}`} />
            <Navbar />

            <main className={`pt-24 pb-16 ${fullscreen ? 'fixed inset-0 z-50 bg-gray-950 pt-20' : ''}`}>
                {/* Header */}
                <section className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    {document.original_filename}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>Journal: {document.journal_name}</span>
                                    <span>•</span>
                                    <span>Language: {document.language.toUpperCase()}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        Processed
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFullscreen(!fullscreen)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                {fullscreen ? 'Exit' : 'Fullscreen'}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Enhanced
                            </button>
                        </div>
                    </div>
                </section>

                {/* View Controls */}
                <section className="max-w-7xl mx-auto px-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveView('split')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    activeView === 'split'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Split View
                            </button>
                            <button
                                onClick={() => setActiveView('original')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    activeView === 'original'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Original Only
                            </button>
                            <button
                                onClick={() => setActiveView('enhanced')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    activeView === 'enhanced'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Enhanced Only
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowGuidelines(!showGuidelines)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {showGuidelines ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                Guidelines
                            </button>
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                                    editMode
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                <Edit3 className="w-4 h-4" />
                                {editMode ? 'Editing' : 'Edit Mode'}
                            </button>
                            {editMode && (
                                <>
                                    <button
                                        onClick={handleUndo}
                                        disabled={historyIndex === 0}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Undo className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleRedo}
                                        disabled={historyIndex === changeHistory.length - 1}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Redo className="w-4 h-4" />
                                    </button>
                                    {hasChanges && (
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Guidelines Panel */}
                <AnimatePresence>
                    {showGuidelines && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="max-w-7xl mx-auto px-6 mb-6"
                        >
                            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Applied Journal Guidelines</h2>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Citation Style</div>
                                        <div className="text-white font-semibold">{guidelines.citation_style || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Font</div>
                                        <div className="text-white font-semibold">{guidelines.font || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Spacing</div>
                                        <div className="text-white font-semibold">{guidelines.spacing || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Max Words</div>
                                        <div className="text-white font-semibold">{guidelines.max_words || 'N/A'}</div>
                                    </div>
                                </div>

                                {suggestions.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-blue-500/20">
                                        <div className="text-sm font-semibold text-blue-300 mb-3">AI Improvements Applied:</div>
                                        <div className="space-y-2">
                                            {suggestions.slice(0, 5).map((suggestion, index) => (
                                                <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                    <span>{suggestion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Document Comparison */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className={`grid ${activeView === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                        {/* Original Document */}
                        {(activeView === 'split' || activeView === 'original') && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                            <h3 className="font-bold text-white">Original Document</h3>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(document.original_content)}
                                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 max-h-[800px] overflow-y-auto">
                                    <div className="prose prose-invert max-w-none">
                                        <pre className="whitespace-pre-wrap font-serif text-gray-300 leading-relaxed">
                                            {document.original_content}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Enhanced Document */}
                        {(activeView === 'split' || activeView === 'enhanced') && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-green-500/30 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 px-6 py-4 border-b border-green-500/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            <h3 className="font-bold text-white">Enhanced Document</h3>
                                            {editMode && (
                                                <span className="text-xs px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300">
                                                    Editing Enabled
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(editedContent)}
                                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 max-h-[800px] overflow-y-auto">
                                    {editMode ? (
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => handleEdit(e.target.value)}
                                            className="w-full h-[700px] bg-gray-800/50 border border-purple-500/30 rounded-xl p-4 text-gray-300 font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                            style={{ whiteSpace: 'pre-wrap' }}
                                        />
                                    ) : (
                                        <div className="prose prose-invert max-w-none">
                                            <pre className="whitespace-pre-wrap font-serif text-gray-300 leading-relaxed">
                                                {editedContent}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Action Bar */}
                <section className="max-w-7xl mx-auto px-6 mt-8">
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Document Ready for Submission</div>
                                    <div className="text-sm text-gray-400">All journal guidelines have been applied</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => router.visit('/upload')}
                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                                >
                                    Process Another
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg rounded-lg font-bold transition-all flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Enhanced Document
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {!fullscreen && <Footer />}
        </div>
    );
};

export default DocumentShowPage;