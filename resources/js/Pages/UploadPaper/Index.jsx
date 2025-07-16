import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Upload, FileText, Download, Search, X } from "lucide-react";
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
    const [formattedFile, setFormattedFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Mock journal list (replace with API fetch in production)
    const journals = [
        { id: 1, name: "Journal of Computer Science", publisher: "Springer" },
        { id: 2, name: "IEEE Transactions", publisher: "IEEE" },
        { id: 3, name: "Nature Communications", publisher: "Nature" },
        { id: 4, name: "Journal of Medical Research", publisher: "Elsevier" },
    ];

    // Filtered journals based on search query
    const filteredJournals = journals.filter((j) =>
        j.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    // Simulate file processing
    useEffect(() => {
        if (isProcessing) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsProcessing(false);
                        setFormattedFile({
                            name: `formatted_${file?.name || "research.pdf"}`,
                            url: "#", // Replace with actual download URL from backend
                        });
                        toast.success("File formatted successfully!");
                        return 100;
                    }
                    return prev + 10;
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isProcessing, file]);

    // Handle file selection
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
        } else {
            setFile(null);
            setError("Please upload a PDF or DOCX file.");
            toast.error("Invalid file type. Please upload a PDF or DOCX.");
        }
    };

    // Handle drag and drop
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
        } else {
            setFile(null);
            setError("Please upload a PDF or DOCX file.");
            toast.error("Invalid file type. Please upload a PDF or DOCX.");
        }
    };

    // Handle form submission
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
        // Simulate API call to backend (replace with actual axios.post in production)
    };

    // Clear file
    const clearFile = () => {
        setFile(null);
        setFormattedFile(null);
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
            className={`min-h-screen font-poppins ${
                isDarkMode
                    ? "dark bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900"
            } transition-all duration-300`}
            data-dark-mode={isDarkMode}
        >
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                onDropdownToggle={handleDropdownToggle}
            />

            {/* Hero Section */}
            <section className="relative h-96 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                    <img
                        src="/images/upload-hero.jpg"
                        alt="Upload Research"
                        className="w-full h-full object-cover opacity-50"
                        loading="lazy"
                        onError={(e) =>
                            (e.target.src = "/images/placeholder-hero.jpg")
                        }
                    />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                            {translations.upload_title ||
                                "Upload Your Research"}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-200 max-w-xl mx-auto">
                            {translations.upload_subtitle ||
                                "Easily upload your paper and select a journal to get it formatted instantly."}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Upload Form Section */}
            <section
                className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg"
                    >
                        <h2
                            className={`text-2xl sm:text-3xl font-semibold text-center ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            } mb-6`}
                        >
                            {translations.form_title || "Format Your Paper"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Upload */}
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 text-center ${
                                    isDragging
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : isDarkMode
                                        ? "border-gray-600 bg-gray-700"
                                        : "border-gray-300 bg-gray-50"
                                } transition-all duration-300`}
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
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload
                                        className={`w-12 h-12 mb-4 ${
                                            isDarkMode
                                                ? "text-blue-400"
                                                : "text-blue-600"
                                        }`}
                                    />
                                    <p
                                        className={`text-sm ${
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {file
                                            ? file.name
                                            : translations.upload_prompt ||
                                              "Drag and drop your PDF or DOCX file here, or click to browse"}
                                    </p>
                                    {file && (
                                        <button
                                            type="button"
                                            onClick={clearFile}
                                            className="mt-2 text-sm text-red-500 hover:text-red-600"
                                            aria-label="Clear uploaded file"
                                        >
                                            Clear File
                                        </button>
                                    )}
                                </label>
                            </div>

                            {/* Journal Selection */}
                            <div className="relative">
                                <div className="flex items-center border rounded-lg bg-gray-50 dark:bg-gray-700">
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
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder={
                                            translations.search_journal ||
                                            "Search for a journal..."
                                        }
                                        className={`w-full p-3 bg-transparent outline-none ${
                                            isDarkMode
                                                ? "text-white placeholder-gray-400"
                                                : "text-gray-900 placeholder-gray-500"
                                        }`}
                                        aria-label="Search journals"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="mr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            aria-label="Clear search"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                                {searchQuery && filteredJournals.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`absolute z-10 w-full mt-2 rounded-lg shadow-lg ${
                                            isDarkMode
                                                ? "bg-gray-700"
                                                : "bg-white"
                                        } max-h-60 overflow-y-auto`}
                                    >
                                        {filteredJournals.map((j) => (
                                            <button
                                                key={j.id}
                                                type="button"
                                                onClick={() => {
                                                    setJournal(j.name);
                                                    setSearchQuery("");
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-900 ${
                                                    isDarkMode
                                                        ? "text-gray-200"
                                                        : "text-gray-700"
                                                }`}
                                                aria-label={`Select ${j.name}`}
                                            >
                                                {j.name} ({j.publisher})
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                                {journal && (
                                    <p
                                        className={`mt-2 text-sm ${
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        Selected Journal: {journal}
                                    </p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm text-center">
                                    {error}
                                </p>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isProcessing}
                                whileHover={
                                    !isProcessing && !isDropdownOpen
                                        ? { scale: 1.05 }
                                        : {}
                                }
                                whileTap={!isProcessing ? { scale: 0.95 } : {}}
                                className={`w-full py-3 rounded-full text-white font-semibold ${
                                    isProcessing
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                } transition-all duration-300`}
                                aria-label="Format research paper"
                            >
                                {isProcessing
                                    ? translations.processing || "Processing..."
                                    : translations.format_button ||
                                      "Format Now"}
                            </motion.button>
                        </form>

                        {/* Progress Indicator */}
                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6"
                            >
                                <p
                                    className={`text-center ${
                                        isDarkMode
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    } mb-2`}
                                >
                                    {translations.processing_message ||
                                        "Formatting your paper..."}
                                </p>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                    <motion.div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Result Section */}
                    {formattedFile && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-center"
                        >
                            <FileText
                                className={`w-12 h-12 mx-auto mb-4 ${
                                    isDarkMode
                                        ? "text-blue-400"
                                        : "text-blue-600"
                                }`}
                            />
                            <p
                                className={`text-lg ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                } mb-4`}
                            >
                                {translations.result_message ||
                                    "Your paper has been formatted!"}
                            </p>
                            <a
                                href={formattedFile.url}
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                                aria-label="Download formatted paper"
                            >
                                <Download size={20} />
                                {translations.download_button ||
                                    "Download Formatted Paper"}
                            </a>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default UploadPage;
