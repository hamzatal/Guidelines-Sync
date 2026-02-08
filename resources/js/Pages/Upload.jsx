import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import UploadForm from "../Components/Upload/UploadForm";
import { Sparkles, Eye, Award, Shield, Zap, Globe2, Brain, Edit3, CheckCircle2 } from "lucide-react";

const UploadPage = ({ auth }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-blue-900 text-white overflow-hidden">
            <Head title="Upload Research Document - Guidelines Sync" />
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero Header */}
                <section className="relative max-w-7xl mx-auto px-6 text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-3xl backdrop-blur-sm shadow-xl"
                    >
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        <span className="text-lg font-bold text-blue-300 tracking-wide">
                            AI-Powered Academic Enhancement
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent leading-tight"
                    >
                        Upload Your{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
                            Research Document
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
                    >
                        Advanced AI analyzes your thesis/research with 98% accuracy. 
                        Side-by-side comparison + manual editing. PDF/DOCX up to 10MB.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <Link
                            href="/examples"
                            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/50 transition-all duration-300 border border-indigo-500/30"
                        >
                            <Eye className="w-6 h-6" />
                            View Examples
                        </Link>
                        <Link
                            href="/pricing"
                            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/50 transition-all duration-300 border border-emerald-500/30"
                        >
                            <Award className="w-6 h-6" />
                            Pricing Plans
                        </Link>
                    </div>

                    {/* Supported Formats */}
                    <div className="flex flex-wrap gap-6 justify-center items-center text-lg font-medium text-blue-300">
                        <span className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-green-400" />
                            PDF • DOC • DOCX
                        </span>
                        <span className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Max 10MB
                        </span>
                        <span className="flex items-center gap-2">
                            <Globe2 className="w-6 h-6 text-cyan-400" />
                            15+ Languages
                        </span>
                    </div>
                </section>

                {/* Main Upload Form */}
                <section className="max-w-6xl mx-auto px-6">
                    <UploadForm auth={auth} />
                </section>

                {/* Quick Features */}
                <section className="max-w-7xl mx-auto px-6 mt-24">
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 },
                            },
                        }}
                    >
                        {[
                            {
                                icon: Brain,
                                title: "Intelligent Analysis",
                                desc: "98% accuracy across APA, MLA, IEEE, Chicago standards",
                            },
                            {
                                icon: Edit3,
                                title: "Side-by-Side Editing",
                                desc: "Original vs AI-corrected with unlimited manual edits",
                            },
                            {
                                icon: CheckCircle2,
                                title: "Instant Results",
                                desc: "Processing starts immediately - results in minutes",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                className="group p-8 rounded-3xl bg-gradient-to-b from-blue-500/10 to-indigo-500/10 border border-blue-500/20 hover:border-blue-400/40 hover:bg-blue-500/15 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                                    <feature.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default UploadPage;
