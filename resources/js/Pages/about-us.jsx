import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import {
    ArrowLeft,
    Sparkles,
    Award,
    Target,
    Heart,
    Rocket,
    TrendingUp,
    Users,
    Globe2,
    GraduationCap,
    BookOpen,
    Brain,
    CheckCircle2,
    Star,
    FileText,
    Edit3,
} from "lucide-react";

const About = ({ auth }) => {
    const user = auth?.user || null;

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    // Timeline data - Guidelines Sync Academic Platform
    const timeline = [
        {
            year: "2022",
            title: "Guidelines Sync Founded",
            description:
                "Created by academic researchers to revolutionize thesis and research paper quality assurance.",
        },
        {
            year: "2023",
            title: "AI Research Engine",
            description:
                "Launched proprietary AI with 98% accuracy across APA, MLA, IEEE standards.",
        },
        {
            year: "2024",
            title: "University Partnerships",
            description:
                "Partnered with 25+ leading universities for institutional deployment.",
        },
        {
            year: "2025",
            title: "Global Academic Leader",
            description:
                "Processing 50K+ research documents monthly with AI-human collaboration tools.",
        },
    ];

    // Stats data - Academic focused
    const stats = [
        { icon: Users, value: "150K+", label: "Researchers" },
        { icon: GraduationCap, value: "50K+", label: "Documents Processed" },
        { icon: BookOpen, value: "25+", label: "University Partners" },
        { icon: Award, value: "98%", label: "AI Accuracy" },
    ];

    // Core values - Guidelines Sync
    const values = [
        {
            icon: Heart,
            title: "Academic Integrity",
            description:
                "Preserving original research voice while ensuring compliance excellence.",
            color: "from-blue-600 via-indigo-500 to-blue-700",
        },
        {
            icon: Target,
            title: "Research Precision",
            description:
                "AI trained on 1M+ peer-reviewed publications for academic excellence.",
            color: "from-indigo-500 to-blue-500",
        },
        {
            icon: Rocket,
            title: "Guidelines Innovation",
            description:
                "Pioneering AI-human collaborative editing for superior outcomes.",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: CheckCircle2,
            title: "Institutional Trust",
            description:
                "Trusted by top universities with GDPR-compliant security standards.",
            color: "from-cyan-500 to-blue-600",
        },
    ];

    // What sets Guidelines Sync apart
    const features = [
        "AI-powered thesis formatting & academic structure optimization",
        "Real-time side-by-side original vs AI-corrected document comparison",
        "98%+ accuracy across APA, MLA, Chicago, IEEE standards",
        "Full manual override with unlimited version history",
        "Plagiarism detection with 20+ academic database integration",
        "Arabic/English multi-language research support",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            <Head title="About Guidelines Sync - Academic Research Excellence" />
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Animated Background - Blue theme */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-500" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full"
                    >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">
                            Welcome to Guidelines Sync
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
                    >
                        Elevate Your{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                            Research Excellence
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
                    >
                        Guidelines Sync: The premier AI-powered platform for students, 
                        researchers, and academics. Transform your thesis and research 
                        papers with precision AI editing and guidelines compliance.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link
                            href="/upload"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all shadow-lg"
                        >
                            Start Research Upload
                            <Rocket className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-blue-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-4">
                                    <stat.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        {/* Text Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                <Star className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-semibold text-blue-400">
                                    Guidelines Sync Story
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Built by Academics,
                                <br />
                                <span className="text-blue-400">For Academics</span>
                            </h2>

                            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                                <p>
                                    Guidelines Sync was founded by PhD researchers frustrated 
                                    with manual thesis formatting and academic quality control.
                                </p>
                                <p>
                                    Our platform delivers state-of-the-art AI trained on millions 
                                    of peer-reviewed papers with intuitive side-by-side editing 
                                    trusted by universities worldwide.
                                </p>
                                <p>
                                    Today Guidelines Sync serves graduate students, professors, 
                                    and research institutions across 40+ countries with unmatched 
                                    98% academic formatting accuracy.
                                </p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500" />
                            <div className="space-y-8">
                                {timeline.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                        className="relative pl-20"
                                    >
                                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm border-4 border-gray-950 shadow-lg">
                                            {item.year}
                                        </div>
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gradient-to-b from-transparent to-blue-950/30">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            What Powers{" "}
                            <span className="text-blue-400">Guidelines Sync</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Our core principles drive every AI algorithm and academic feature
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={scaleIn}
                                whileHover={{ y: -10 }}
                                className="relative group"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                                    style={{
                                        background: `linear-gradient(to bottom right, ${value.color})`,
                                    }}
                                />
                                <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-900/50 group-hover:border-blue-500/50 transition-all h-full">
                                    <div
                                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} mb-6 shadow-lg`}
                                    >
                                        <value.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400">
                                        {value.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* What Sets Us Apart */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Visual Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-[url('/api/placeholder/600/600')] bg-cover bg-center opacity-10" />
                                <div className="relative z-10">
                                    <Brain className="w-48 h-48 text-blue-400/30" />
                                    <FileText className="w-32 h-32 text-indigo-400/50 absolute -top-8 -right-8" />
                                    <Edit3 className="w-24 h-24 text-blue-400/40 absolute -bottom-8 -left-8" />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
                                <GraduationCap className="w-16 h-16 text-white" />
                            </div>
                        </motion.div>

                        {/* Content Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Why Academics Choose{" "}
                                <span className="text-blue-400">Guidelines Sync</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-8">
                                Beyond automation - intelligent academic research enhancement
                            </p>

                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-blue-900/50 hover:border-blue-500/50 hover:bg-blue-900/10 transition-all"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-lg text-gray-300">
                                            {feature}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-700 p-12 text-center shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] bg-cover bg-center opacity-10" />
                        <div className="relative">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to Transform Your Research?
                            </h2>
                            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
                                Join 150K+ academics who've elevated their research 
                                with Guidelines Sync precision editing
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!user ? (
                                    <Link
                                        href="/register"
                                        className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
                                    >
                                        Create Academic Account
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
                                    >
                                        Access Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/upload"
                                    className="px-8 py-4 bg-transparent/20 border-2 border-white/50 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
                                >
                                    Upload Document
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
