import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";
import FileUploadSection from "../../Components/UploadPaper/FileUploadSection";
import JournalSelector from "../../Components/UploadPaper/JournalSelector";
import ProcessingStatus from "../../Components/UploadPaper/ProcessingStatus";
import DocumentComparison from "../../Components/UploadPaper/DocumentComparison";
import DocumentEditor from "../../Components/UploadPaper/DocumentEditor";

const UploadPaper = ({ auth }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [processingStatus, setProcessingStatus] = useState("idle"); // idle, processing, completed, error
    const [originalDocument, setOriginalDocument] = useState(null);
    const [processedDocument, setProcessedDocument] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleFileUpload = (file) => {
        setUploadedFile(file);
        setProcessingStatus("idle");
    };

    const handleJournalSelect = (journal) => {
        setSelectedJournal(journal);
    };

    const handleProcessDocument = async () => {
        if (!uploadedFile || !selectedJournal) {
            alert("Please upload a file and select a journal");
            return;
        }

        setProcessingStatus("processing");

        const formData = new FormData();
        formData.append("document", uploadedFile);
        formData.append("journal_id", selectedJournal.id);
        formData.append("use_gpt", "true");

        try {
            const response = await fetch("/api/process-document", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            });

            const data = await response.json();

            if (data.success) {
                setOriginalDocument(data.original);
                setProcessedDocument(data.processed);
                setProcessingStatus("completed");
            } else {
                setProcessingStatus("error");
            }
        } catch (error) {
            console.error("Processing error:", error);
            setProcessingStatus("error");
        }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Head title="Upload Research Paper - Guidelines Sync" />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <div className="relative h-64 md:h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                <div className="absolute inset-0 bg-[url('/images/academic-bg.svg')] bg-no-repeat bg-center opacity-30 bg-fill"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-6xl font-extrabold mb-2 leading-tight"
                        >
                            Format Your{" "}
                            <span className="text-green-400">
                                Research Paper
                            </span>
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                            className="text-gray-300 mt-4 text-lg"
                        >
                            Upload your thesis or dissertation for automatic
                            formatting
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                {processingStatus === "idle" ||
                processingStatus === "processing" ? (
                    <>
                        {/* File Upload Section */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5 }}
                            variants={fadeIn}
                            className="mb-8"
                        >
                            <FileUploadSection
                                onFileUpload={handleFileUpload}
                                uploadedFile={uploadedFile}
                            />
                        </motion.div>

                        {/* Journal Selector */}
                        {uploadedFile && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.5, delay: 0.2 }}
                                variants={fadeIn}
                                className="mb-8"
                            >
                                <JournalSelector
                                    onSelect={handleJournalSelect}
                                    selectedJournal={selectedJournal}
                                />
                            </motion.div>
                        )}

                        {/* Process Button */}
                        {uploadedFile && selectedJournal && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.5, delay: 0.4 }}
                                variants={fadeIn}
                                className="text-center mb-8"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleProcessDocument}
                                    disabled={processingStatus === "processing"}
                                    className={`bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
                                        processingStatus === "processing"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {processingStatus === "processing"
                                        ? "Processing..."
                                        : "Format Document"}
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Processing Status */}
                        {processingStatus === "processing" && (
                            <ProcessingStatus />
                        )}
                    </>
                ) : processingStatus === "completed" ? (
                    <>
                        {!isEditing ? (
                            <DocumentComparison
                                originalDocument={originalDocument}
                                processedDocument={processedDocument}
                                onEdit={() => setIsEditing(true)}
                                onStartNew={() => {
                                    setUploadedFile(null);
                                    setSelectedJournal(null);
                                    setProcessingStatus("idle");
                                    setOriginalDocument(null);
                                    setProcessedDocument(null);
                                }}
                            />
                        ) : (
                            <DocumentEditor
                                document={processedDocument}
                                onSave={(editedDocument) => {
                                    setProcessedDocument(editedDocument);
                                    setIsEditing(false);
                                }}
                                onCancel={() => setIsEditing(false)}
                            />
                        )}
                    </>
                ) : (
                    processingStatus === "error" && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="bg-red-900 bg-opacity-40 border border-red-800 rounded-xl p-8 text-center"
                        >
                            <h3 className="text-2xl font-bold text-red-400 mb-4">
                                Processing Failed
                            </h3>
                            <p className="text-gray-300 mb-6">
                                There was an error processing your document.
                                Please try again.
                            </p>
                            <button
                                onClick={() => setProcessingStatus("idle")}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )
                )}
            </div>

            <Footer />
        </div>
    );
};

export default UploadPaper;
