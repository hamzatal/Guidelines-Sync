// DocumentComparison.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Download,
    Edit3,
    Eye,
    EyeOff,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Save,
    Sparkles,
} from "lucide-react";

const DocumentComparison = ({
    originalDoc,
    correctedDoc,
    onSave,
    onDownload,
}) => {
    const [viewMode, setViewMode] = useState("split"); // split, original, corrected
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(correctedDoc);
    const [showDifferences, setShowDifferences] = useState(true);

    const viewModes = [
        { id: "split", label: "Side-by-Side Comparison", icon: ChevronRight },
        { id: "original", label: "Original Version", icon: FileText },
        { id: "corrected", label: "Corrected Version", icon: Sparkles },
    ];

    const handleSaveEdits = () => {
        onSave(editedContent);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-blue-500/20 shadow-xl p-6">
                {/* View Mode Selector */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        {viewModes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setViewMode(mode.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                                    ${
                                        viewMode === mode.id
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }
                                `}
                            >
                                <mode.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {mode.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                setShowDifferences(!showDifferences)
                            }
                            className="flex items-center gap-2 px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl text-purple-300 hover:bg-purple-600/30 transition-all"
                        >
                            {showDifferences ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <EyeOff className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                                Show Changes
                            </span>
                        </button>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`
                                flex items-center gap-2 px-4 py-3 rounded-2xl transition-all
                                ${
                                    isEditing
                                        ? "bg-green-600/20 border border-green-500/30 text-green-300"
                                        : "bg-orange-600/20 border border-orange-500/30 text-orange-300 hover:bg-orange-600/30"
                                }
                            `}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isEditing ? "Editing…" : "Edit"}
                            </span>
                        </button>

                        {isEditing && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={handleSaveEdits}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </motion.button>
                        )}

                        <button
                            onClick={onDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                            247
                        </div>
                        <div className="text-xs text-gray-400">
                            Applied Corrections
                        </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                            98%
                        </div>
                        <div className="text-xs text-gray-400">
                            Formatting Accuracy
                        </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                            156
                        </div>
                        <div className="text-xs text-gray-400">
                            Corrected Citations
                        </div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                            23
                        </div>
                        <div className="text-xs text-gray-400">
                            Table Formats
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Viewer */}
            <AnimatePresence mode="wait">
                {viewMode === "split" ? (
                    <motion.div
                        key="split"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {/* Original Document */}
                        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 border-b border-gray-600">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    Original Version
                                </h3>
                            </div>
                            <div className="p-6 h-[600px] overflow-y-auto custom-scrollbar">
                                <div
                                    className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: originalDoc,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Corrected Document */}
                        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-blue-500/30 shadow-xl shadow-blue-500/10 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 border-b border-blue-500">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Corrected Version
                                </h3>
                            </div>
                            <div className="p-6 h-[600px] overflow-y-auto custom-scrollbar">
                                {isEditing ? (
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) =>
                                            setEditedContent(e.target.value)
                                        }
                                        className="w-full h-full bg-transparent text-white border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                    />
                                ) : (
                                    <div
                                        className={`prose prose-invert max-w-none text-gray-100 leading-relaxed ${
                                            showDifferences
                                                ? "highlight-changes"
                                                : ""
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: correctedDoc,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-blue-500/20 shadow-xl overflow-hidden"
                    >
                        <div
                            className={`px-6 py-4 border-b ${
                                viewMode === "corrected"
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500"
                                    : "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600"
                            }`}
                        >
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {viewMode === "corrected" ? (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Corrected Version
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5" />
                                        Original Version
                                    </>
                                )}
                            </h3>
                        </div>
                        <div className="p-8 h-[700px] overflow-y-auto custom-scrollbar">
                            {isEditing && viewMode === "corrected" ? (
                                <textarea
                                    value={editedContent}
                                    onChange={(e) =>
                                        setEditedContent(e.target.value)
                                    }
                                    className="w-full h-full bg-transparent text-white border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                />
                            ) : (
                                <div
                                    className="prose prose-invert max-w-none text-gray-100 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            viewMode === "corrected"
                                                ? correctedDoc
                                                : originalDoc,
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.7);
                }
                .highlight-changes mark {
                    background-color: rgba(34, 197, 94, 0.2);
                    color: inherit;
                    padding: 2px 0;
                }
            `}</style>
        </div>
    );
};

export default DocumentComparison;
