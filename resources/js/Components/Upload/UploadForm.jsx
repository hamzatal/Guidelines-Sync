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
    GraduationCap,
    BookOpen,
} from "lucide-react";

const UploadForm = ({ auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        document: null,
        title: "",
        description: "",
        language: "en",
        category: "",
        privacy: "private",
    });

    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    // Categories & Languages
    const categories = [
        "Thesis/Dissertation",
        "Research Paper",
        "Journal Article",
        "Conference Paper",
        "Literature Review",
        "Computer Science",
        "Engineering",
        "Medicine",
        "Business",
        "Law",
        "Other",
    ];

    const languages = [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
        { value: "fr", label: "Français" },
        { value: "de", label: "Deutsch" },
        { value: "es", label: "Español" },
    ];

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
        setData("title", file.name.replace(/\.[^/.]+$/, ""));
    };

    const isValidFile = (file) => {
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    };

    const removeFile = () => {
        setData("document", null);
        setPreviewUrl(null);
        setData("title", "");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-gray-900/80 to-black/60 backdrop-blur-xl rounded-4xl border border-blue-500/20 shadow-2xl p-12"
        >
            <AnimatePresence mode="wait">
                {uploaded ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="text-center py-24"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.6 }}
                            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl"
                        >
                            <CheckCircle2 className="w-20 h-20 text-white" />
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-6">
                            Upload Successful!
                        </h2>
                        <p className="text-xl text-emerald-300 mb-8 max-w-2xl mx-auto">
                            Your document is being processed by our AI. You'll see the corrected version with side-by-side comparison shortly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/50 transition-all duration-300"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form key="upload" onSubmit={handleSubmit} className="space-y-8">
                        {/* File Upload Area */}
                        <motion.div
                            className={`
                                relative group p-12 border-3 rounded-4xl transition-all duration-300 cursor-pointer
                                ${dragActive 
                                    ? 'border-blue-400/70 bg-blue-500/10 shadow-2xl shadow-blue-500/30 ring-2 ring-blue-400/50' 
                                    : 'border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-indigo-500/5 shadow-xl hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30'
                                }
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleFileDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={processing}
                            />

                            <div className="text-center">
                                <motion.div
                                    animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-white/20 transition-all duration-300"
                                >
                                    <Upload className="w-14 h-14 text-white" />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {data.document ? "Document Selected" : "Drag & Drop or Click"}
                                </h3>
                                
                                {data.document ? (
                                    <p className="text-blue-300 text-lg mb-6 truncate max-w-md mx-auto">
                                        {data.document.name}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 text-lg mb-6">
                                        Click to browse or drag your PDF/DOCX (Max 10MB)
                                    </p>
                                )}

                                {previewUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/20"
                                    >
                                        <CheckCircle2 className="w-16 h-16 text-white" />
                                    </motion.div>
                                )}
                            </div>

                            {errors.document && (
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-medium border border-red-400/50 shadow-lg"
                                >
                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                    {errors.document}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* File Preview */}
                        {previewUrl && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="flex items-center gap-4 p-6 bg-gray-900/50 rounded-3xl border border-blue-500/20 backdrop-blur-sm"
                            >
                                <div className="w-16 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Document title..."
                                        className="w-full bg-transparent text-xl font-bold text-white border-none focus:outline-none focus:ring-0 placeholder-gray-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1 truncate">
                                        {data.document?.name} • {(data.document?.size / 1024 / 1024).toFixed(1)} MB
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={removeFile}
                                    className="p-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 transition-all duration-200"
                                    type="button"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Progress Bar */}
                        {uploadProgress > 0 && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl overflow-hidden shadow-lg"
                            />
                        )}

                        {/* Form Fields */}
                        {data.document && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Language
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.language}
                                            onChange={(e) => setData("language", e.target.value)}
                                            className="w-full bg-gray-900/50 border border-blue-500/30 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                                            disabled={processing}
                                        >
                                            <option value="">Select Language</option>
                                            {languages.map((lang) => (
                                                <option key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.language && (
                                        <p className="text-red-400 text-sm mt-1">{errors.language}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData("category", e.target.value)}
                                        className="w-full bg-gray-900/50 border border-blue-500/30 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                                        disabled={processing}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                                    )}
                                </div>

                                <div className="lg:col-span-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={showAdvanced}
                                            onChange={(e) => setShowAdvanced(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        Advanced Options
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        {data.document && !processing && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-4 px-12 py-8 bg-gradient-to-r from-blue-600 via-[#1e47ff] to-[#5171FF] rounded-4xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-300 border-2 border-blue-500/30 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        Processing with AI...
                                    </>
                                ) : (
                                    <>
                                        <GraduationCap className="w-10 h-10 group-hover:scale-110 transition-transform duration-200" />
                                        Analyze & Enhance Document
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
