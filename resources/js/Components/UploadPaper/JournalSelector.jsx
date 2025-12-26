import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, CheckCircle, RefreshCw } from "lucide-react";

const JournalSelector = ({ onSelect, selectedJournal }) => {
    const [journals, setJournals] = useState([]);
    const [filteredJournals, setFilteredJournals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        // جلب مجلات افتراضية عند التحميل
        if (!hasSearched) {
            fetchJournals("");
        }
    }, []);

    const fetchJournals = async (search = "") => {
        setIsLoading(true);
        try {
            const url = search
                ? `/api/journals?search=${encodeURIComponent(search)}`
                : "/api/journals";

            const response = await fetch(url);
            const data = await response.json();

            if (data.success && data.journals) {
                setJournals(data.journals);
                setFilteredJournals(data.journals);
                setHasSearched(true);
            }
        } catch (error) {
            console.error("Error fetching journals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            fetchJournals(searchTerm);
        }
    };

    const handleRefresh = () => {
        setSearchTerm("");
        setHasSearched(false);
        fetchJournals("");
    };

    return (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="bg-green-600 p-2 rounded-full mr-3">
                    <BookOpen className="h-6 w-6" />
                </span>
                Select Target{" "}
                <span className="text-green-500 ml-2">Journal</span>
            </h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search journals by name, field, or topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                    {isLoading ? "Searching..." : "Search"}
                </button>
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </form>

            {/* Selected Journal */}
            {selectedJournal && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-900 bg-opacity-40 border border-green-700 rounded-lg p-4 mb-6 flex items-center justify-between"
                >
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <div>
                            <p className="font-semibold">
                                {selectedJournal.name}
                            </p>
                            <p className="text-sm text-gray-400">
                                {selectedJournal.publisher}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onSelect(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Change
                    </button>
                </motion.div>
            )}

            {/* Journals List */}
            <div className="max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-gray-400 mt-4">
                            Loading journals from AI...
                        </p>
                    </div>
                ) : filteredJournals.length > 0 ? (
                    filteredJournals.map((journal, index) => (
                        <motion.div
                            key={journal.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 5 }}
                            onClick={() => onSelect(journal)}
                            className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                                selectedJournal?.name === journal.name
                                    ? "ring-2 ring-green-500 bg-opacity-100"
                                    : "hover:bg-gray-600"
                            }`}
                        >
                            <h3 className="font-semibold text-lg mb-1">
                                {journal.name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                                {journal.publisher}
                            </p>
                            <div className="flex space-x-2">
                                {journal.impact_factor && (
                                    <span className="text-xs bg-green-600 px-2 py-1 rounded">
                                        IF: {journal.impact_factor}
                                    </span>
                                )}
                                {journal.category && (
                                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                                        {journal.category}
                                    </span>
                                )}
                                {journal.issn && (
                                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                        {journal.issn}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p className="mb-4">
                            {hasSearched
                                ? "No journals found. Try a different search term."
                                : "Search for journals by name, field, or topic"}
                        </p>
                        <button
                            onClick={() => fetchJournals("computer science")}
                            className="text-green-400 hover:text-green-300 underline"
                        >
                            Load sample journals
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(55, 65, 81, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                }
            `}</style>
        </div>
    );
};

export default JournalSelector;
