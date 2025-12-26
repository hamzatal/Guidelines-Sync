import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Edit, RotateCcw } from "lucide-react";

const DocumentComparison = ({
    originalDocument,
    processedDocument,
    onEdit,
    onStartNew,
}) => {
    const [activeView, setActiveView] = useState("side-by-side"); // side-by-side, processed-only

    const handleDownload = async () => {
        try {
            const response = await fetch(
                `/api/download-document/${processedDocument.id}`
            );
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `formatted_${processedDocument.filename}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center">
                            <span className="bg-green-600 p-2 rounded-full mr-3">
                                <FileText className="h-6 w-6" />
                            </span>
                            Formatting{" "}
                            <span className="text-green-500 ml-2">
                                Complete!
                            </span>
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Review your formatted document below
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <Edit className="h-5 w-5" />
                            <span>Edit</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <Download className="h-5 w-5" />
                            <span>Download</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStartNew}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <RotateCcw className="h-5 w-5" />
                            <span>New Document</span>
                        </motion.button>
                    </div>
                </div>

                {/* View Selector */}
                <div className="flex space-x-2 mt-6">
                    <button
                        onClick={() => setActiveView("side-by-side")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeView === "side-by-side"
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Side by Side
                    </button>
                    <button
                        onClick={() => setActiveView("processed-only")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeView === "processed-only"
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Processed Only
                    </button>
                </div>
            </div>

            {/* Document Views */}
            {activeView === "side-by-side" ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Document */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-gray-700"
                    >
                        <h3 className="text-xl font-bold mb-4 text-gray-400">
                            Original Document
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                            <iframe
                                src={originalDocument.preview_url}
                                className="w-full h-full min-h-[500px]"
                                title="Original Document"
                            />
                        </div>
                    </motion.div>

                    {/* Processed Document */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-green-700 ring-2 ring-green-500"
                    >
                        <h3 className="text-xl font-bold mb-4 text-green-400">
                            Formatted Document
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                            <iframe
                                src={processedDocument.preview_url}
                                className="w-full h-full min-h-[500px]"
                                title="Processed Document"
                            />
                        </div>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-green-700"
                >
                    <h3 className="text-xl font-bold mb-4 text-green-400">
                        Formatted Document
                    </h3>
                    <div className="bg-gray-900 rounded-lg p-6 max-h-[700px] overflow-y-auto custom-scrollbar">
                        <iframe
                            src={processedDocument.preview_url}
                            className="w-full h-full min-h-[600px]"
                            title="Processed Document"
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DocumentComparison;
