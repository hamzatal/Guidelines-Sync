import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Upload,
    FileText,
    Download,
    Search,
    X,
    CheckCircle,
    AlertCircle,
    FileCheck,
    Sparkles,
    Zap,
    Clock,
    Shield,
    Award,
    ArrowRight,
    Eye,
    Settings,
} from "lucide-react";
import { usePage, Link } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";

const UploadPage = ({ auth }) => {
    const { props } = usePage();
    const { flash = {}, translations = {} } = props;
    const user = auth?.user || null;

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode !== null
            ? savedMode === "true"
            : window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [journal, setJournal] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingStage, setProcessingStage] = useState("");
    const [formattedFile, setFormattedFile] = useState(null);
    const [error, setError] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [processingResults, setProcessingResults] = useState(null);
    const fileInputRef = useRef(null);

    const scopusJournals = [
        {
            id: 1,
            name: "Journal of Computer Science and Technology",
            publisher: "Springer",
            quartile: "Q1",
            impactFactor: 4.762,
            requirements: {
                citationStyle: "APA",
                maxWords: 8000,
                abstractWords: 250,
                keywordsCount: 6,
                figureFormat: "JPEG/PNG, 300 DPI",
                tableFormat: "Editable format",
                referencesMin: 30,
                sectionStructure: [
                    "Abstract",
                    "Introduction",
                    "Methods",
                    "Results",
                    "Discussion",
                    "Conclusion",
                ],
            },
        },
        {
            id: 2,
            name: "IEEE Transactions on Software Engineering",
            publisher: "IEEE",
            quartile: "Q1",
            impactFactor: 6.226,
            requirements: {
                citationStyle: "IEEE",
                maxWords: 10000,
                abstractWords: 200,
                keywordsCount: 8,
                figureFormat: "EPS/PDF Vector",
                tableFormat: "IEEE Standard",
                referencesMin: 40,
                sectionStructure: [
                    "Abstract",
                    "Introduction",
                    "Related Work",
                    "Methodology",
                    "Evaluation",
                    "Conclusions",
                ],
            },
        },
        {
            id: 3,
            name: "Nature Communications",
            publisher: "Nature Publishing",
            quartile: "Q1",
            impactFactor: 17.694,
            requirements: {
                citationStyle: "Nature",
                maxWords: 6000,
                abstractWords: 150,
                keywordsCount: 5,
                figureFormat: "TIFF/PDF, 600 DPI",
                tableFormat: "Nature Standard",
                referencesMin: 50,
                sectionStructure: [
                    "Abstract",
                    "Introduction",
                    "Results",
                    "Discussion",
                    "Methods",
                ],
            },
        },
        {
            id: 4,
            name: "Journal of Medical Internet Research",
            publisher: "JMIR Publications",
            quartile: "Q1",
            impactFactor: 7.076,
            requirements: {
                citationStyle: "Vancouver",
                maxWords: 7000,
                abstractWords: 300,
                keywordsCount: 10,
                figureFormat: "PNG/JPEG, 300 DPI",
                tableFormat: "JMIR Standard",
                referencesMin: 35,
                sectionStructure: [
                    "Abstract",
                    "Introduction",
                    "Methods",
                    "Results",
                    "Discussion",
                    "Conclusions",
                ],
            },
        },
        {
            id: 5,
            name: "Artificial Intelligence Review",
            publisher: "Springer",
            quartile: "Q1",
            impactFactor: 12.117,
            requirements: {
                citationStyle: "APA",
                maxWords: 12000,
                abstractWords: 250,
                keywordsCount: 7,
                figureFormat: "EPS/PDF Vector",
                tableFormat: "Springer Standard",
                referencesMin: 60,
                sectionStructure: [
                    "Abstract",
                    "Introduction",
                    "Literature Review",
                    "Methodology",
                    "Results",
                    "Discussion",
                    "Conclusion",
                ],
            },
        },
    ];

    // Processing stages for realistic feedback
    const processingStages = [
        { stage: "Analyzing document structure", duration: 2000 },
        { stage: "Extracting content and metadata", duration: 3000 },
        { stage: "Validating against journal requirements", duration: 2500 },
        { stage: "Formatting citations and references", duration: 4000 },
        { stage: "Optimizing figures and tables", duration: 3500 },
        { stage: "Applying journal-specific styling", duration: 2000 },
        { stage: "Generating compliance report", duration: 1500 },
        { stage: "Finalizing document", duration: 1000 },
    ];

    // Filtered journals based on search query
    const filteredJournals = scopusJournals.filter(
        (j) =>
            j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.publisher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get selected journal details
    const selectedJournal = scopusJournals.find((j) => j.name === journal);

    // Persist dark mode
    useEffect(() => {
        localStorage.setItem("darkMode", isDarkMode);
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    // Show flash messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    // Enhanced file processing simulation
    useEffect(() => {
        if (isProcessing) {
            let currentStageIndex = 0;
            let stageProgress = 0;
            const totalStages = processingStages.length;

            const processStage = () => {
                if (currentStageIndex >= totalStages) {
                    setIsProcessing(false);
                    setProgress(100);
                    setProcessingStage("Processing complete!");

                    // Generate processing results
                    const results = {
                        compliance: Math.floor(Math.random() * 15) + 85, // 85-100%
                        changesApplied: Math.floor(Math.random() * 20) + 15, // 15-35 changes
                        issuesFixed: Math.floor(Math.random() * 8) + 3, // 3-10 issues
                        wordCount: Math.floor(Math.random() * 2000) + 5000, // 5000-7000 words
                        citationsFormatted: Math.floor(Math.random() * 20) + 25, // 25-45 citations
                        figuresOptimized: Math.floor(Math.random() * 5) + 2, // 2-7 figures
                    };

                    setProcessingResults(results);
                    setFormattedFile({
                        name: `${selectedJournal?.name.replace(
                            /[^a-zA-Z0-9]/g,
                            "_"
                        )}_formatted_${file?.name || "research.pdf"}`,
                        url: "#", // Replace with actual download URL from backend
                        size: "2.4 MB",
                        pages: Math.floor(Math.random() * 10) + 12,
                    });
                    toast.success("File formatted successfully!");
                    return;
                }

                const currentStage = processingStages[currentStageIndex];
                setProcessingStage(currentStage.stage);

                const stageInterval = setInterval(() => {
                    stageProgress += 10;
                    const overallProgress =
                        (currentStageIndex * 100 + stageProgress) / totalStages;
                    setProgress(Math.min(overallProgress, 100));

                    if (stageProgress >= 100) {
                        clearInterval(stageInterval);
                        currentStageIndex++;
                        stageProgress = 0;
                        setTimeout(processStage, 200);
                    }
                }, currentStage.duration / 10);
            };

            processStage();
        }
    }, [isProcessing, selectedJournal, file]);

    // Handle file selection with preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (
            selectedFile &&
            (selectedFile.type === "application/pdf" ||
                selectedFile.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        ) {
            setFile(selectedFile);
            setError(null);

            // Generate file preview info
            setFilePreview({
                name: selectedFile.name,
                size: (selectedFile.size / 1024 / 1024).toFixed(2) + " MB",
                type: selectedFile.type.includes("pdf") ? "PDF" : "DOCX",
                lastModified: new Date(
                    selectedFile.lastModified
                ).toLocaleDateString(),
            });
        } else {
            setFile(null);
            setFilePreview(null);
            setError("Please upload a PDF or DOCX file.");
            toast.error("Invalid file type. Please upload a PDF or DOCX.");
        }
    };

    // Enhanced drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (
            droppedFile &&
            (droppedFile.type === "application/pdf" ||
                droppedFile.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        ) {
            setFile(droppedFile);
            setError(null);

            setFilePreview({
                name: droppedFile.name,
                size: (droppedFile.size / 1024 / 1024).toFixed(2) + " MB",
                type: droppedFile.type.includes("pdf") ? "PDF" : "DOCX",
                lastModified: new Date(
                    droppedFile.lastModified
                ).toLocaleDateString(),
            });
        } else {
            setFile(null);
            setFilePreview(null);
            setError("Please upload a PDF or DOCX file.");
            toast.error("Invalid file type. Please upload a PDF or DOCX.");
        }
    };

    // Enhanced form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please upload a research file.");
            toast.error("No file uploaded.");
            return;
        }
        if (!journal) {
            setError("Please select a target journal.");
            toast.error("No journal selected.");
            return;
        }

        setError(null);
        setIsProcessing(true);
        setProgress(0);
        setProcessingStage("Initializing...");
        setFormattedFile(null);
        setProcessingResults(null);

        toast.success(`Processing file for ${journal}...`);
    };

    // Clear file
    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
        setFormattedFile(null);
        setProcessingResults(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Toggle dark mode
    const toggleDarkMode = useCallback(
        () => setIsDarkMode((prev) => !prev),
        []
    );

    // Handle dropdown toggle
    const handleDropdownToggle = useCallback((isOpen) => {
        setIsDropdownOpen(isOpen);
    }, []);

    return (
        <div
            className={`min-h-screen font-inter ${
                isDarkMode
                    ? "dark bg-gray-900 text-white"
                    : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
            } transition-all duration-300`}
        >
            <Navbar user={user} />

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: isDarkMode ? "#374151" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#374151",
                        borderRadius: "12px",
                        boxShadow:
                            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    },
                }}
            />

            {/* Enhanced Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                    {/* Animated Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white/20 rounded-full"
                                animate={{
                                    y: [0, -100, 0],
                                    x: [0, Math.random() * 100 - 50, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mb-6"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-4">
                                <Sparkles className="w-10 h-10 text-yellow-300" />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Your Journal
                            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                                Auto-Formatter
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Upload your research paper and let our AI
                            automatically format it according to your target
                            journal's exact requirements
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>Instant Processing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <span>100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-400" />
                                <span>Journal Compliant</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
                    >
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Enhanced Upload Form Section */}
            <section
                className={`py-20 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                } relative overflow-hidden`}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2
                            className={`text-3xl sm:text-4xl font-bold ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            } mb-4`}
                        >
                            Professional Document Processing
                        </h2>
                        <p
                            className={`text-lg ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                            } max-w-2xl mx-auto`}
                        >
                            Our advanced AI analyzes your document and applies
                            journal-specific formatting automatically
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Upload Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50`}
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* File Upload */}
                                <div className="space-y-4">
                                    <h3
                                        className={`text-xl font-semibold ${
                                            isDarkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        Upload Your Research Paper
                                    </h3>

                                    <div
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                                            isDragging
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
                                                : file
                                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                : isDarkMode
                                                ? "border-gray-600 bg-gray-700/50 hover:bg-gray-700/80"
                                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                            ref={fileInputRef}
                                        />

                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col items-center">
                                                {file ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-center"
                                                    >
                                                        <FileCheck className="w-16 h-16 text-green-500 mb-4" />
                                                        <p
                                                            className={`text-lg font-medium ${
                                                                isDarkMode
                                                                    ? "text-white"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            File Uploaded
                                                            Successfully!
                                                        </p>
                                                    </motion.div>
                                                ) : (
                                                    <>
                                                        <Upload
                                                            className={`w-16 h-16 mb-4 ${
                                                                isDarkMode
                                                                    ? "text-blue-400"
                                                                    : "text-blue-500"
                                                            }`}
                                                        />
                                                        <p
                                                            className={`text-lg font-medium ${
                                                                isDarkMode
                                                                    ? "text-white"
                                                                    : "text-gray-900"
                                                            } mb-2`}
                                                        >
                                                            Drop your file here
                                                            or click to browse
                                                        </p>
                                                        <p
                                                            className={`text-sm ${
                                                                isDarkMode
                                                                    ? "text-gray-400"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            Supports PDF and
                                                            DOCX files up to
                                                            10MB
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </label>

                                        {file && (
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                type="button"
                                                onClick={clearFile}
                                                className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <X size={16} />
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* File Preview */}
                                    {filePreview && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-xl ${
                                                isDarkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gray-100"
                                            } space-y-2`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText
                                                        className={`w-5 h-5 ${
                                                            isDarkMode
                                                                ? "text-blue-400"
                                                                : "text-blue-500"
                                                        }`}
                                                    />
                                                    <div>
                                                        <p
                                                            className={`font-medium ${
                                                                isDarkMode
                                                                    ? "text-white"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            {filePreview.name}
                                                        </p>
                                                        <p
                                                            className={`text-sm ${
                                                                isDarkMode
                                                                    ? "text-gray-400"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {filePreview.type} •{" "}
                                                            {filePreview.size} •{" "}
                                                            {
                                                                filePreview.lastModified
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <Eye
                                                    className={`w-5 h-5 ${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Journal Selection */}
                                <div className="space-y-4">
                                    <h3
                                        className={`text-xl font-semibold ${
                                            isDarkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        Select Target Journal
                                    </h3>

                                    <div className="relative">
                                        <div
                                            className={`flex items-center border-2 rounded-xl transition-all duration-300 ${
                                                isDarkMode
                                                    ? "border-gray-600 bg-gray-700 focus-within:border-blue-500"
                                                    : "border-gray-200 bg-white focus-within:border-blue-500"
                                            }`}
                                        >
                                            <Search
                                                className={`ml-4 ${
                                                    isDarkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                }`}
                                                size={20}
                                            />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Search journals..."
                                                className={`w-full p-4 bg-transparent outline-none text-lg ${
                                                    isDarkMode
                                                        ? "text-white placeholder-gray-400"
                                                        : "text-gray-900 placeholder-gray-500"
                                                }`}
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSearchQuery("")
                                                    }
                                                    className="mr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>

                                        {searchQuery &&
                                            filteredJournals.length > 0 && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className={`absolute z-20 w-full mt-2 rounded-xl shadow-2xl ${
                                                        isDarkMode
                                                            ? "bg-gray-800 border border-gray-700"
                                                            : "bg-white border border-gray-200"
                                                    } max-h-80 overflow-y-auto`}
                                                >
                                                    {filteredJournals.map(
                                                        (j) => (
                                                            <motion.button
                                                                key={j.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setJournal(
                                                                        j.name
                                                                    );
                                                                    setSearchQuery(
                                                                        ""
                                                                    );
                                                                }}
                                                                className={`w-full text-left p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
                                                                whileHover={{
                                                                    x: 4,
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p
                                                                            className={`font-medium ${
                                                                                isDarkMode
                                                                                    ? "text-white"
                                                                                    : "text-gray-900"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                j.name
                                                                            }
                                                                        </p>
                                                                        <p
                                                                            className={`text-sm ${
                                                                                isDarkMode
                                                                                    ? "text-gray-400"
                                                                                    : "text-gray-500"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                j.publisher
                                                                            }{" "}
                                                                            •
                                                                            Impact
                                                                            Factor:{" "}
                                                                            {
                                                                                j.impactFactor
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                            j.quartile ===
                                                                            "Q1"
                                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            j.quartile
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </motion.button>
                                                        )
                                                    )}
                                                </motion.div>
                                            )}
                                    </div>

                                    {/* Selected Journal Display */}
                                    {selectedJournal && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700 ${
                                                isDarkMode
                                                    ? "bg-blue-900/10"
                                                    : "bg-blue-50"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4
                                                        className={`text-lg font-semibold ${
                                                            isDarkMode
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {selectedJournal.name}
                                                    </h4>
                                                    <p
                                                        className={`text-sm ${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {
                                                            selectedJournal.publisher
                                                        }{" "}
                                                        • IF:{" "}
                                                        {
                                                            selectedJournal.impactFactor
                                                        }
                                                    </p>
                                                </div>
                                                <div
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        selectedJournal.quartile ===
                                                        "Q1"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                                    }`}
                                                >
                                                    {selectedJournal.quartile}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p
                                                        className={`font-medium ${
                                                            isDarkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        Citation Style:
                                                    </p>
                                                    <p
                                                        className={`${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {
                                                            selectedJournal
                                                                .requirements
                                                                .citationStyle
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className={`font-medium ${
                                                            isDarkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        Max Words:
                                                    </p>
                                                    <p
                                                        className={`${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {selectedJournal.requirements.maxWords.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className={`font-medium ${
                                                            isDarkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        Abstract:
                                                    </p>
                                                    <p
                                                        className={`${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {
                                                            selectedJournal
                                                                .requirements
                                                                .abstractWords
                                                        }{" "}
                                                        words
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className={`font-medium ${
                                                            isDarkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        Keywords:
                                                    </p>
                                                    <p
                                                        className={`${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {
                                                            selectedJournal
                                                                .requirements
                                                                .keywordsCount
                                                        }{" "}
                                                        required
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        <p className="text-red-700 dark:text-red-300">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isProcessing || !file || !journal}
                                    whileHover={
                                        !isProcessing && file && journal
                                            ? { scale: 1.02 }
                                            : {}
                                    }
                                    whileTap={
                                        !isProcessing && file && journal
                                            ? { scale: 0.98 }
                                            : {}
                                    }
                                    className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${
                                        isProcessing || !file || !journal
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                                    }`}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Zap className="w-5 h-5" />
                                            Format Document
                                        </div>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Processing Status & Results */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            {/* Processing Status */}
                            {isProcessing && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-6 rounded-2xl ${
                                        isDarkMode ? "bg-gray-800" : "bg-white"
                                    } shadow-xl border border-gray-200/50 dark:border-gray-700/50`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <h3
                                            className={`text-xl font-semibold ${
                                                isDarkMode
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            Processing Your Document
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p
                                                className={`text-sm ${
                                                    isDarkMode
                                                        ? "text-gray-300"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {processingStage}
                                            </p>
                                            <p
                                                className={`text-sm font-medium ${
                                                    isDarkMode
                                                        ? "text-blue-400"
                                                        : "text-blue-600"
                                                }`}
                                            >
                                                {Math.round(progress)}%
                                            </p>
                                        </div>

                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${progress}%`,
                                                }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span
                                                    className={
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }
                                                >
                                                    Content Analysis
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        progress > 30
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }
                                                >
                                                    Format Validation
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        progress > 60
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }
                                                >
                                                    Citation Formatting
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        progress > 90
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }
                                                >
                                                    Final Review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Processing Results */}
                            {processingResults && formattedFile && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-6 rounded-2xl ${
                                        isDarkMode ? "bg-gray-800" : "bg-white"
                                    } shadow-xl border border-gray-200/50 dark:border-gray-700/50`}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <h3
                                            className={`text-xl font-semibold ${
                                                isDarkMode
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            Processing Complete!
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div
                                            className={`p-4 rounded-xl ${
                                                isDarkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Award className="w-4 h-4 text-green-500" />
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    Compliance Score
                                                </p>
                                            </div>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    isDarkMode
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {processingResults.compliance}%
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 rounded-xl ${
                                                isDarkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Settings className="w-4 h-4 text-blue-500" />
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    Changes Applied
                                                </p>
                                            </div>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    isDarkMode
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {
                                                    processingResults.changesApplied
                                                }
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 rounded-xl ${
                                                isDarkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-purple-500" />
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    Word Count
                                                </p>
                                            </div>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    isDarkMode
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {processingResults.wordCount.toLocaleString()}
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 rounded-xl ${
                                                isDarkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="w-4 h-4 text-orange-500" />
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    Citations
                                                </p>
                                            </div>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    isDarkMode
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {
                                                    processingResults.citationsFormatted
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-4 rounded-xl ${
                                            isDarkMode
                                                ? "bg-green-900/20"
                                                : "bg-green-50"
                                        } mb-6`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <p
                                                className={`font-medium ${
                                                    isDarkMode
                                                        ? "text-green-300"
                                                        : "text-green-700"
                                                }`}
                                            >
                                                Document Ready for Submission
                                            </p>
                                        </div>
                                        <p
                                            className={`text-sm ${
                                                isDarkMode
                                                    ? "text-green-400"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            Your document has been successfully
                                            formatted according to{" "}
                                            {selectedJournal?.name}{" "}
                                            requirements. All citations,
                                            references, and formatting comply
                                            with journal standards.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <motion.a
                                            href={formattedFile.url}
                                            download={formattedFile.name}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Formatted Document
                                        </motion.a>

                                        <div className="flex items-center justify-between text-sm">
                                            <span
                                                className={`${
                                                    isDarkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {formattedFile.size} •{" "}
                                                {formattedFile.pages} pages
                                            </span>
                                            <span
                                                className={`${
                                                    isDarkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Ready for submission
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Features List */}
                            {!isProcessing && !formattedFile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={`p-6 rounded-2xl ${
                                        isDarkMode ? "bg-gray-800" : "bg-white"
                                    } shadow-xl border border-gray-200/50 dark:border-gray-700/50`}
                                >
                                    <h3
                                        className={`text-xl font-semibold ${
                                            isDarkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        } mb-4`}
                                    >
                                        What Our AI Does
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p
                                                    className={`font-medium ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Citation Formatting
                                                </p>
                                                <p
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Automatically converts all
                                                    citations to
                                                    journal-specific format
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p
                                                    className={`font-medium ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Structure Validation
                                                </p>
                                                <p
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Ensures proper section
                                                    organization and headings
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p
                                                    className={`font-medium ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Figure & Table Optimization
                                                </p>
                                                <p
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Formats figures and tables
                                                    according to journal
                                                    standards
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p
                                                    className={`font-medium ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Style Compliance
                                                </p>
                                                <p
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Applies journal-specific
                                                    formatting rules and
                                                    guidelines
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section
                className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2
                            className={`text-3xl font-bold ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            } mb-4`}
                        >
                            Trusted by Researchers Worldwide
                        </h2>
                        <p
                            className={`text-lg ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            Join thousands of researchers who trust our AI
                            formatting system
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                number: "50,000+",
                                label: "Papers Formatted",
                                icon: FileText,
                            },
                            {
                                number: "98.7%",
                                label: "Accuracy Rate",
                                icon: Award,
                            },
                            {
                                number: "2,500+",
                                label: "Journals Supported",
                                icon: BookOpen,
                            },
                            {
                                number: "< 5min",
                                label: "Average Processing",
                                icon: Clock,
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className={`text-center p-6 rounded-2xl ${
                                    isDarkMode ? "bg-gray-800" : "bg-white"
                                } shadow-lg`}
                            >
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div
                                    className={`text-3xl font-bold ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    } mb-2`}
                                >
                                    {stat.number}
                                </div>
                                <div
                                    className={`text-sm ${
                                        isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
        
    );
};

export default UploadPage;
