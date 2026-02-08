import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";
import {
    Home,
    FileText,
    AlertCircle,
    ChevronsLeft,
    Brain,
    BookOpen,
    GraduationCap,
} from "lucide-react";

const NotFoundPage = ({ auth }) => {
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        // Trigger animation after component mount
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
            <Head title="Page Not Found | Guidelines Sync" />
            <Navbar />

            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-2xl animate-pulse delay-500" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen pt-20">
                {/* 404 Content */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={animationComplete ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mb-12 inline-block relative"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl animate-ping opacity-50 blur-xl"></div>
                            <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-blue-500/30 shadow-2xl">
                                <AlertCircle className="w-24 h-24 md:w-32 md:h-32 text-blue-400 mx-auto animate-pulse" />
                            </div>
                        </motion.div>

                        {/* 404 Numbers */}
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-8xl md:text-9xl font-black mb-8 leading-tight tracking-tight"
                        >
                            4
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 inline-block animate-bounce px-4 py-2 rounded-2xl bg-black/30 backdrop-blur-sm shadow-2xl">
                                0
                            </span>
                            4
                        </motion.h1>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent"
                        >
                            Research Not Found
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="text-xl md:text-2xl mb-12 leading-relaxed text-gray-300 max-w-2xl mx-auto"
                        >
                            This academic resource or research guideline doesn't exist in our database. 
                            It might have been moved, deleted, or you're looking in the wrong library.
                        </motion.p>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link
                                href="/home"
                                className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center gap-3"
                            >
                                <Home className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Back to Home
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="group w-full sm:w-auto bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-semibold transition-all border border-blue-500/30 hover:border-blue-400/50 flex items-center justify-center gap-3 hover:scale-105"
                            >
                                <ChevronsLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
                                Previous Page
                            </button>
                        </motion.div>

                        {/* Additional Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 1.3 }}
                            className="mt-16 pt-12 border-t border-blue-900/30 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
                        >
                            <Link href="/upload" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Upload Research
                            </Link>
                            <Link href="/about-us" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                About Guidelines Sync
                            </Link>
                            <Link href="/ContactPage" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Get Academic Support
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default NotFoundPage;
