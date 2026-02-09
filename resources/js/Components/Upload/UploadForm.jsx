import React, { useState, useRef, useCallback } from "react";
import { useForm, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Loader2,
    FileText,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronDown,
    Search,
    Globe,
    BookOpen,
    Brain,
    Sparkles,
    ExternalLink,
    Info,
    Zap,
    Download,
    RefreshCw
} from "lucide-react";

const UploadForm = ({ auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        document: null,
        journal_name: "",
        custom_journal_url: "",
        language: "en",
        research_field: "",
    });

    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const [aiSearching, setAiSearching] = useState(false);
    const [journalInfo, setJournalInfo] = useState(null);
    const [showJournalDropdown, setShowJournalDropdown] = useState(false);
    const [journalSearchQuery, setJournalSearchQuery] = useState("");
    const [customJournalMode, setCustomJournalMode] = useState(false);

    // Popular Journals - AI will fetch their guidelines in real-time
    const popularJournals = [
        { name: "Nature", field: "Multidisciplinary", impact: "49.96" },
        { name: "Science", field: "Multidisciplinary", impact: "47.73" },
        { name: "Cell", field: "Biology", impact: "41.58" },
        { name: "The Lancet", field: "Medicine", impact: "79.32" },
        { name: "New England Journal of Medicine", field: "Medicine", impact: "91.25" },
        { name: "IEEE Transactions on Pattern Analysis", field: "Computer Science", impact: "23.69" },
        { name: "Journal of Machine Learning Research", field: "AI/ML", impact: "6.04" },
        { name: "PLOS ONE", field: "Multidisciplinary", impact: "3.75" },
        { name: "Scientific Reports", field: "Multidisciplinary", impact: "4.38" },
        { name: "Nature Communications", field: "Multidisciplinary", impact: "16.60" },
        { name: "Physical Review Letters", field: "Physics", impact: "8.84" },
        { name: "Chemical Reviews", field: "Chemistry", impact: "60.62" },
        { name: "Energy & Environmental Science", field: "Energy", impact: "32.40" },
        { name: "Springer", field: "Multidisciplinary", impact: "Various" },
        { name: "Elsevier", field: "Multidisciplinary", impact: "Various" },
        { name: "Wiley", field: "Multidisciplinary", impact: "Various" },
        { name: "Taylor & Francis", field: "Multidisciplinary", impact: "Various" },
        { name: "BMC Medicine", field: "Medicine", impact: "9.09" },
        { name: "MDPI Journals", field: "Multidisciplinary", impact: "Various" },
        { name: "Frontiers", field: "Multidisciplinary", impact: "Various" },
    ];

    const researchFields = [
        "Computer Science",
        "Engineering",
        "Medicine",
        "Biology",
        "Physics",
        "Chemistry",
        "Mathematics",
        "Social Sciences",
        "Economics",
        "Psychology",
        "Environmental Science",
        "Materials Science",
        "Neuroscience",
        "Other"
    ];

    const languages = [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
        { value: "fr", label: "Français" },
        { value: "de", label: "Deutsch" },
        { value: "es", label: "Español" },
        { value: "zh", label: "中文" },
    ];

    // Simulate AI journal research
    const fetchJournalGuidelines = async (journalName, customUrl = null) => {
        setAiSearching(true);
        setJournalInfo(null);

        // Simulate API call to AI that researches the journal
        try {
            // In real implementation, this would call your Laravel backend
            // which uses OpenAI to search the web for journal guidelines
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
            
            // Mock response - in production, AI returns real data
            setJournalInfo({
                name: journalName || "Custom Journal",
                url: customUrl || `https://${journalName.toLowerCase().replace(/\s+/g, '')}.com`,
                guidelines_found: true,
                citation_style: "APA 7th Edition",
                formatting_rules: [
                    "Double-spaced text",
                    "12pt Times New Roman font",
                    "1-inch margins",
                    "Running head on every page"
                ],
                max_word_count: "8000 words",
                references_style: "Author-date citation system",
                last_updated: new Date().toLocaleDateString(),
                ai_confidence: "98%"
            });
        } catch (error) {
            console.error("Error fetching journal guidelines:", error);
        } finally {
            setAiSearching(false);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleFileDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && isValidFile(file)) {
            handleFileSelect(file);
        }
    };

    const handleFileSelect = (file) => {
        if (!isValidFile(file)) return;
        setData("document", file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const isValidFile = (file) => {
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        if (!validTypes.includes(file.type)) {
            alert("Please upload PDF, DOC, or DOCX files only");
            return false;
        }
        
        if (file.size > maxSize) {
            alert("File size must be less than 50MB");
            return false;
        }
        
        return true;
    };

    const removeFile = () => {
        setData("document", null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleJournalSelect = (journal) => {
        setData("journal_name", journal.name);
        setJournalSearchQuery(journal.name);
        setShowJournalDropdown(false);
        fetchJournalGuidelines(journal.name);
    };

    const handleCustomJournalSearch = () => {
        if (data.custom_journal_url) {
            fetchJournalGuidelines("Custom Journal", data.custom_journal_url);
        }
    };

    const filteredJournals = popularJournals.filter(journal =>
        journal.name.toLowerCase().includes(journalSearchQuery.toLowerCase()) ||
        journal.field.toLowerCase().includes(journalSearchQuery.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.document) {
            alert("Please upload a research document first");
            return;
        }
        
        if (!data.journal_name && !data.custom_journal_url) {
            alert("Please select a journal or provide a custom journal URL");
            return;
        }

        post(route("upload.process"), {
            forceFormData: true,
            onStart: () => {
                setUploadProgress(0);
            },
            onProgress: (progress) => {
                setUploadProgress(progress.percentage || 0);
            },
            onSuccess: (page) => {
                setUploaded(true);
                setTimeout(() => {
                    router.visit(route("documents.show", page.props.document.id));
                }, 2500);
            },
            onError: (errors) => {
                console.error("Upload errors:", errors);
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-gray-900/90 to-black/70 backdrop-blur-xl rounded-4xl border border-blue-500/30 shadow-2xl p-8 md:p-12"
        >
            <AnimatePresence mode="wait">
                {uploaded ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                            transition={{ duration: 1 }}
                            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl"
                        >
                            <CheckCircle2 className="w-20 h-20 text-white" />
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-6">
                            Processing Started!
                        </h2>
                        <p className="text-xl text-emerald-300 mb-4">
                            AI is researching journal guidelines and formatting your document...
                        </p>
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Redirecting to results...</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form key="upload" onSubmit={handleSubmit} className="space-y-8">
                        {/* File Upload Area */}
                        <motion.div
                            className={`
                                relative group p-12 border-3 border-dashed rounded-4xl transition-all duration-300 cursor-pointer
                                ${dragActive 
                                    ? 'border-blue-400/70 bg-blue-500/10 shadow-2xl shadow-blue-500/30' 
                                    : 'border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-purple-500/5 hover:border-blue-400/50'
                                }
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleFileDrop}
                            onClick={() => !data.document && fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="hidden"
                                disabled={processing}
                            />

                            <div className="text-center">
                                <motion.div
                                    animate={dragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl"
                                >
                                    {data.document ? (
                                        <CheckCircle2 className="w-14 h-14 text-white" />
                                    ) : (
                                        <Upload className="w-14 h-14 text-white" />
                                    )}
                                </motion.div>

                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {data.document ? "Document Ready" : "Upload Research Document"}
                                </h3>
                                
                                {data.document ? (
                                    <div className="space-y-2">
                                        <p className="text-blue-300 text-lg font-semibold">
                                            {data.document.name}
                                        </p>
                                        <p className="text-gray-400">
                                            {(data.document.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-full transition-all"
                                        >
                                            <X className="w-4 h-4 inline mr-2" />
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-lg">
                                        PDF, DOC, DOCX • Max 50MB
                                    </p>
                                )}
                            </div>

                            {errors.document && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                    {errors.document}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Progress Bar */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <motion.div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Journal Selection */}
                        {data.document && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Mode Toggle */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCustomJournalMode(false)}
                                        className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all ${
                                            !customJournalMode
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                                        }`}
                                    >
                                        <BookOpen className="w-5 h-5 inline mr-2" />
                                        Popular Journals
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCustomJournalMode(true)}
                                        className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all ${
                                            customJournalMode
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                                        }`}
                                    >
                                        <Globe className="w-5 h-5 inline mr-2" />
                                        Custom Journal URL
                                    </button>
                                </div>

                                {!customJournalMode ? (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-semibold text-gray-300">
                                            <Search className="w-4 h-4 inline mr-2" />
                                            Search & Select Journal
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={journalSearchQuery}
                                                onChange={(e) => {
                                                    setJournalSearchQuery(e.target.value);
                                                    setShowJournalDropdown(true);
                                                }}
                                                onFocus={() => setShowJournalDropdown(true)}
                                                placeholder="Search journals by name or field..."
                                                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-12"
                                            />
                                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            
                                            {showJournalDropdown && journalSearchQuery && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute z-50 w-full mt-2 bg-gray-800 border border-blue-500/30 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                                                >
                                                    {filteredJournals.length > 0 ? (
                                                        filteredJournals.map((journal, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => handleJournalSelect(journal)}
                                                                className="w-full px-6 py-4 text-left hover:bg-blue-500/10 transition-colors border-b border-gray-700/50 last:border-0"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="font-semibold text-white">{journal.name}</div>
                                                                        <div className="text-sm text-gray-400">{journal.field}</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-xs text-blue-400 font-semibold">IF: {journal.impact}</div>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-6 py-8 text-center text-gray-400">
                                                            No journals found. Try custom URL instead.
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                        {errors.journal_name && (
                                            <p className="text-red-400 text-sm mt-1">{errors.journal_name}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-semibold text-gray-300">
                                            <Globe className="w-4 h-4 inline mr-2" />
                                            Journal Website URL
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="url"
                                                value={data.custom_journal_url}
                                                onChange={(e) => setData("custom_journal_url", e.target.value)}
                                                placeholder="https://journal-website.com/author-guidelines"
                                                className="flex-1 bg-gray-900/50 border border-purple-500/30 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCustomJournalSearch}
                                                disabled={!data.custom_journal_url || aiSearching}
                                                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {aiSearching ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Search className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            AI will automatically search and extract formatting guidelines from this URL
                                        </p>
                                    </div>
                                )}

                                {/* AI Research Status */}
                                {aiSearching && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                                <Brain className="w-4 h-4 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-white mb-1">AI Researching Journal Guidelines...</div>
                                                <div className="text-sm text-gray-400">
                                                    Searching official website, extracting formatting rules, citation styles, and submission requirements
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Journal Info Display */}
                                {journalInfo && !aiSearching && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 space-y-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-lg">{journalInfo.name}</div>
                                                    <div className="text-sm text-emerald-400">Guidelines Found • {journalInfo.ai_confidence} Confidence</div>
                                                </div>
                                            </div>
                                            <a
                                                href={journalInfo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-emerald-500/20">
                                            <div>
                                                <div className="text-xs text-gray-400 mb-1">Citation Style</div>
                                                <div className="font-semibold text-white">{journalInfo.citation_style}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400 mb-1">Max Word Count</div>
                                                <div className="font-semibold text-white">{journalInfo.max_word_count}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-400 mb-2">Key Formatting Rules:</div>
                                            <ul className="space-y-1">
                                                {journalInfo.formatting_rules.map((rule, index) => (
                                                    <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                                        {rule}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="text-xs text-gray-500 pt-2 border-t border-emerald-500/20">
                                            Last updated: {journalInfo.last_updated}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Additional Options */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Research Field
                                        </label>
                                        <select
                                            value={data.research_field}
                                            onChange={(e) => setData("research_field", e.target.value)}
                                            className="w-full bg-gray-900/50 border border-blue-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="">Select Field</option>
                                            {researchFields.map((field) => (
                                                <option key={field} value={field}>{field}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Document Language
                                        </label>
                                        <select
                                            value={data.language}
                                            onChange={(e) => setData("language", e.target.value)}
                                            className="w-full bg-gray-900/50 border border-blue-500/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.value} value={lang.value}>{lang.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        {data.document && (data.journal_name || data.custom_journal_url) && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing || aiSearching}
                                className="w-full flex items-center justify-center gap-4 px-12 py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-4xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        Processing with AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                        Start AI Enhancement
                                        <Zap className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        )}
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UploadForm;