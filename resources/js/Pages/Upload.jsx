// UploadPage.jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import UploadForm from "../Components/Upload/UploadForm";
import {
    Sparkles,
    Brain,
    Shield,
    Zap,
    Globe2,
    FileCheck,
    Award,
    CheckCircle2,
    Search,
    Bot,
    Layers,
    TrendingUp,
} from "lucide-react";

const UploadPage = ({ auth }) => {
    const features = [
        {
            icon: Search,
            title: "AI Web Research",
            description:
                "The AI automatically searches official journal websites and extracts the latest rules and guidelines.",
            gradient: "from-blue-500 to-cyan-500",
            stats: "Real-time",
        },
        {
            icon: Bot,
            title: "Smart Template Matching",
            description:
                "Intelligent analysis of the selected journal format and automatic application of all rules with 99% accuracy.",
            gradient: "from-purple-500 to-pink-500",
            stats: "99% Accuracy",
        },
        {
            icon: Layers,
            title: "Side-by-Side Comparison",
            description:
                "Direct comparison between the original and improved versions with full manual editing control.",
            gradient: "from-emerald-500 to-teal-500",
            stats: "Full Control",
        },
        {
            icon: TrendingUp,
            title: "Continuous Learning",
            description:
                "The AI continuously learns from the latest global scientific publishing standards.",
            gradient: "from-orange-500 to-red-500",
            stats: "Always Updated",
        },
    ];

    const supportedJournals = [
        "Nature",
        "Science",
        "IEEE Transactions",
        "Springer",
        "Elsevier",
        "Wiley",
        "Taylor & Francis",
        "PLOS",
        "BMC",
        "MDPI",
        "And 500+ more...",
    ];

    const processSteps = [
        {
            number: "01",
            title: "Upload Your File",
            description: "Upload your research paper (PDF, DOCX, DOC).",
            icon: "📄",
        },
        {
            number: "02",
            title: "Choose Journal",
            description: "Select your target academic journal from the list.",
            icon: "🎯",
        },
        {
            number: "03",
            title: "Smart Journal Scan",
            description:
                "AI scans the journal’s official website to fetch its latest requirements.",
            icon: "🔍",
        },
        {
            number: "04",
            title: "Processing & Optimization",
            description:
                "Automatic application of all formatting, citation, and structure rules.",
            icon: "⚡",
        },
        {
            number: "05",
            title: "Review & Edit",
            description:
                "Side-by-side comparison with full manual editing capability.",
            icon: "✏️",
        },
        {
            number: "06",
            title: "Download & Submit",
            description: "Download your journal-ready, submission-optimized paper.",
            icon: "✅",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-900 text-white overflow-hidden">
            <Head title="AI-Powered Research Upload - Guidelines Sync" />
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative max-w-7xl mx-auto px-6 mb-16">
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative text-center"
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                            <span className="text-sm font-bold text-blue-300 tracking-wide">
                                100% AI-Powered • Real-Time 
                                Research
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            <span className="text-white">Upload Your Research,</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                AI Does The Rest
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                            AI automatically fetches the latest journal guidelines
                            from official websites and applies all rules with
                            stunning precision.
                        </p>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap justify-center gap-6 mb-12">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-full backdrop-blur-sm">
                                <Shield className="w-5 h-5 text-green-400" />
                                <span className="text-sm font-semibold">
                                    PDF • DOCX • DOC
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-full backdrop-blur-sm">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-semibold">
                                    Max 50MB
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-pink-500/20 rounded-full backdrop-blur-sm">
                                <Globe2 className="w-5 h-5 text-cyan-400" />
                                <span className="text-sm font-semibold">
                                    500+ Journals
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-emerald-500/20 rounded-full backdrop-blur-sm">
                                <Brain className="w-5 h-5 text-purple-400" />
                                <span className="text-sm font-semibold">
                                    Real-Time AI Research
                                </span>
                            </div>
                        </div>

                        {/* Supported Journals Ticker */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-transparent via-blue-500/5 to-transparent py-4 rounded-2xl border border-blue-500/10">
                            <div className="flex items-center gap-8 animate-scroll">
                                {[...supportedJournals, ...supportedJournals].map(
                                    (journal, index) => (
                                        <span
                                            key={index}
                                            className="text-sm font-semibold text-gray-400 whitespace-nowrap"
                                        >
                                            {journal}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* AI Features Grid */}
                <section className="max-w-7xl mx-auto px-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Powered by Advanced AI
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            No hard-coded data – every rule is researched and
                            applied dynamically by AI.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}
                                ></div>

                                <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-blue-500/50 transition-all duration-300 h-full">
                                    <div
                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                        {feature.description}
                                    </p>

                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                        <span className="text-xs font-semibold text-blue-400">
                                            {feature.stats}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Main Upload Form */}
                <section className="max-w-6xl mx-auto px-6 mb-20">
                    <UploadForm auth={auth} />
                </section>

                {/* How It Works Section */}
                <section className="max-w-7xl mx-auto px-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                            <Award className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-400">
                                How It Works
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                6 Simple Steps to Perfect Submission
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                                <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300">
                                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-lg border-4 border-gray-950 shadow-xl">
                                        {step.number}
                                    </div>

                                    <div className="text-5xl mb-4">{step.icon}</div>

                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Trust Section */}
                <section className="max-w-5xl mx-auto px-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-4xl p-12 border border-blue-500/20 text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-gray-950 flex items-center justify-center text-lg"
                                    >
                                        ✓
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Join{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                150,000+
                            </span>{" "}
                            Researchers
                        </h3>

                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                            Researchers worldwide use Guidelines Sync to optimize
                            their papers and publish in top-tier scientific
                            journals.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/examples"
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
                            >
                                View Examples
                            </Link>
                            <Link
                                href="/pricing"
                                className="px-8 py-4 bg-white/5 border-2 border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                            >
                                Pricing Plans
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default UploadPage;
