import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X, Sparkles } from "lucide-react";

const DocumentEditor = ({ document, onSave, onCancel }) => {
    const [content, setContent] = useState(document.content || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isAIAssisting, setIsAIAssisting] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(
                `/api/update-document/${document.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    body: JSON.stringify({ content }),
                }
            );

            const data = await response.json();
            if (data.success) {
                onSave({ ...document, content });
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAIAssist = async () => {
        setIsAIAssisting(true);
        try {
            const response = await fetch("/api/ai-improve-document", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({
                    content,
                    document_id: document.id,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setContent(data.improved_content);
            }
        } catch (error) {
            console.error("AI assist error:", error);
        } finally {
            setIsAIAssisting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-gray-700"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">
                    Edit <span className="text-green-500">Document</span>
                </h2>
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAIAssist}
                        disabled={isAIAssisting}
                        className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 ${
                            isAIAssisting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <Sparkles className="h-5 w-5" />
                        <span>
                            {isAIAssisting ? "AI Working..." : "AI Improve"}
                        </span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 ${
                            isSaving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <Save className="h-5 w-5" />
                        <span>{isSaving ? "Saving..." : "Save"}</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                    >
                        <X className="h-5 w-5" />
                        <span>Cancel</span>
                    </motion.button>
                </div>
            </div>

            {/* Editor */}
            <div className="bg-gray-900 rounded-lg p-6">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[600px] bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                    placeholder="Edit your document content here..."
                />
            </div>

            {/* Tips */}
            <div className="mt-4 bg-gray-700 bg-opacity-50 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                    <span className="text-green-400 font-semibold">
                        💡 Tip:
                    </span>{" "}
                    Use the AI Improve button to enhance formatting, grammar,
                    and academic style automatically.
                </p>
            </div>
        </motion.div>
    );
};

export default DocumentEditor;
