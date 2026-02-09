import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";

const JournalSelector = ({ selectedJournal, setSelectedJournal, error }) => {
    const journals = [
        {
            id: "ieee",
            name: "IEEE Transactions",
            description: "Institute of Electrical and Electronics Engineers",
            category: "Engineering & Technology",
            impact: "High Impact Factor",
            color: "from-blue-500 to-cyan-500",
        },
        {
            id: "nature",
            name: "Nature",
            description: "International Weekly Journal of Science",
            category: "Multidisciplinary Sciences",
            impact: "Top Tier",
            color: "from-green-500 to-emerald-500",
        },
        {
            id: "science",
            name: "Science Magazine",
            description: "American Association for the Advancement of Science",
            category: "Multidisciplinary Sciences",
            impact: "Top Tier",
            color: "from-purple-500 to-pink-500",
        },
        {
            id: "springer",
            name: "Springer Nature",
            description: "Academic Journal Publisher",
            category: "Various Scientific Fields",
            impact: "High Quality",
            color: "from-orange-500 to-red-500",
        },
        {
            id: "elsevier",
            name: "Elsevier Journals",
            description: "Science Direct Publishing",
            category: "Medical & Life Sciences",
            impact: "Peer Reviewed",
            color: "from-indigo-500 to-blue-500",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    اختر المجلة العلمية | Select Journal
                </label>
                <p className="text-gray-400 mb-6">
                    اختر المجلة التي تريد تطبيق قالبها على بحثك | Choose the journal template for your research
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {journals.map((journal, index) => (
                    <motion.div
                        key={journal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedJournal(journal.id)}
                        className={`
                            relative group cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300
                            ${
                                selectedJournal === journal.id
                                    ? `border-blue-400 bg-gradient-to-br ${journal.color} bg-opacity-10 shadow-xl shadow-blue-500/30`
                                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70"
                            }
                        `}
                    >
                        {/* Selection Indicator */}
                        {selectedJournal === journal.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900"
                            >
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </motion.div>
                        )}

                        {/* Journal Icon */}
                        <div
                            className={`
                            w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${journal.color} 
                            flex items-center justify-center shadow-lg
                            ${selectedJournal === journal.id ? "scale-110" : ""}
                            transition-transform duration-300
                        `}
                        >
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>

                        {/* Journal Info */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {journal.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">{journal.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-300">
                                {journal.category}
                            </span>
                            <span
                                className={`px-3 py-1 bg-gradient-to-r ${journal.color} bg-opacity-20 border border-white/20 rounded-full text-xs font-semibold text-white`}
                            >
                                {journal.impact}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-red-400 text-sm mt-2 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default JournalSelector;