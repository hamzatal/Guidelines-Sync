import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Upload,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Award,
    Shield,
    Zap,
    Users,
    Globe2,
    Clock,
    FileCheck,
    Sparkles,
    Brain,
    Target,
    BarChart3,
    ChevronDown,
    Star,
    X,
    MessageCircle,
} from "lucide-react";
import { Head, usePage, Link } from "@inertiajs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import AcademicChatBot from "../Components/ChatBot";

const HomePage = ({ auth, flash = {} }) => {
    const { props } = usePage();
    const { heroSections = [], translations = {} } = props;
    const user = auth?.user || null;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);
    const [stats, setStats] = useState({
        documents: 0,
        accuracy: 0,
        users: 0,
        universities: 0,
    });

    // Animate stats on mount
    useEffect(() => {
        const targets = {
            documents: 50000,
            accuracy: 98,
            users: 150000,
            universities: 25,
        };

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;

            setStats({
                documents: Math.floor(targets.documents * progress),
                accuracy: Math.floor(targets.accuracy * progress),
                users: Math.floor(targets.users * progress),
                universities: Math.floor(targets.universities * progress),
            });

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Hero slider
    useEffect(() => {
        if (heroSections.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSections.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [heroSections]);

    // Hide tooltip
    useEffect(() => {
        const timer = setTimeout(() => setIsTooltipVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Flash messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const toggleChat = useCallback(() => setIsChatOpen((prev) => !prev), []);
    const handleCloseTooltip = useCallback(
        () => setIsTooltipVisible(false),
        []
    );

    // Features data
    const features = [
        {
            icon: Brain,
            title: "AI-Powered Correction",
            description:
                "Advanced AI trained on 1M+ peer-reviewed publications ensures 98% accuracy",
            color: "from-blue-600 to-indigo-600",
            stats: "98% Accuracy",
        },
        {
            icon: FileCheck,
            title: "Side-by-Side Comparison",
            description:
                "View original and corrected versions simultaneously with highlighted changes",
            color: "from-indigo-600 to-purple-600",
            stats: "Real-time Preview",
        },
        {
            icon: Target,
            title: "Multi-Standard Support",
            description:
                "APA, MLA, Chicago, IEEE, Harvard, Vancouver + 15 citation styles",
            color: "from-purple-600 to-pink-600",
            stats: "20+ Standards",
        },
        {
            icon: Shield,
            title: "Academic Security",
            description:
                "GDPR-compliant encryption with automatic 30-day data deletion",
            color: "from-pink-600 to-blue-600",
            stats: "Bank-level Security",
        },
    ];

    // Process steps
    const processSteps = [
        {
            step: "01",
            icon: Upload,
            title: "Upload Document",
            description:
                "Upload your research paper in PDF, DOCX, or DOC format (max 50MB)",
        },
        {
            step: "02",
            icon: Brain,
            title: "AI Analysis",
            description:
                "Our AI analyzes structure, formatting, citations, and academic standards",
        },
        {
            step: "03",
            icon: FileCheck,
            title: "Review Changes",
            description:
                "Compare original vs corrected side-by-side with full manual override",
        },
        {
            step: "04",
            icon: CheckCircle2,
            title: "Download Result",
            description:
                "Export perfectly formatted document ready for submission",
        },
    ];

    // Benefits
    const benefits = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Process documents in under 2 minutes",
        },
        {
            icon: Award,
            title: "University Trusted",
            description: "Partnered with 25+ leading institutions",
        },
        {
            icon: Globe2,
            title: "Multi-Language",
            description: "Arabic & English research support",
        },
        {
            icon: Users,
            title: "150K+ Researchers",
            description: "Join thousands of satisfied academics",
        },
    ];

    // FAQ data
    const faqs = [
        {
            question: "How accurate is the AI correction?",
            answer: "Our AI achieves 98% accuracy, validated by 25 partner universities across multiple academic disciplines.",
        },
        {
            question: "What file formats are supported?",
            answer: "We support PDF, DOCX, and DOC files up to 50MB with OCR for scanned documents.",
        },
        {
            question: "Is my research data secure?",
            answer: "Yes! We use GDPR-compliant end-to-end encryption and automatically delete files after 30 days.",
        },
        {
            question: "Which citation styles do you support?",
            answer: "We support APA, MLA, Chicago, IEEE, Harvard, Vancouver, and 15+ other academic standards.",
        },
        {
            question: "Can I manually edit the corrections?",
            answer: "Absolutely! You have full control with unlimited manual override and version history.",
        },
        {
            question: "Do you offer institutional licenses?",
            answer: "Yes! Contact partners@guidelinessync.com for university licensing options.",
        },
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            <Head>
                <title>
                    Guidelines Sync - AI-Powered Academic Research Excellence
                </title>
                <meta
                    name="description"
                    content="Transform your thesis and research papers with AI-powered formatting, citation correction, and academic standards compliance. 98% accuracy trusted by 150K+ researchers."
                />
            </Head>

            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar user={user} />

            {/* Hero Section - Original Design Preserved */}
            <section className="relative h-screen w-full overflow-hidden">
                {heroSections.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <p className="text-xl text-gray-300">
                            No hero sections available.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
                                    <img
                                        src={
                                            heroSections[currentSlide]?.image ||
                                            "/images/placeholder-hero.jpg"
                                        }
                                        alt={
                                            heroSections[currentSlide]?.title ||
                                            "Hero Image"
                                        }
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) =>
                                            (e.target.src =
                                                "/images/placeholder-hero.jpg")
                                        }
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                            <motion.div
                                key={`content-${currentSlide}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="max-w-4xl"
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                                    {heroSections[currentSlide]?.title ||
                                        "Welcome to Guidelines-Sync"}
                                </h1>
                                <p className="text-xl md:text-2xl text-white/90 mb-8">
                                    {heroSections[currentSlide]?.subtitle ||
                                        "Transform your academic research with AI precision."}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href="/upload"
                                        className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                                        aria-label="Start uploading"
                                    >
                                        {heroSections[currentSlide]?.cta_text ||
                                            "Upload Your Research"}
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors font-semibold text-lg border border-white/30"
                                        aria-label="Learn more"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8">
                            <button
                                onClick={() =>
                                    setCurrentSlide((prev) =>
                                        prev === 0
                                            ? heroSections.length - 1
                                            : prev - 1
                                    )
                                }
                                className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
                                aria-label="Previous"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentSlide((prev) =>
                                        prev === heroSections.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
                                aria-label="Next"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>

                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {heroSections.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all ${
                                        currentSlide === index
                                            ? "w-8 bg-white"
                                            : "w-2 bg-white/50"
                                    }`}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black border-y border-blue-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">
                                {stats.documents.toLocaleString()}+
                            </div>
                            <div className="text-sm text-gray-400 font-medium">
                                Documents Processed
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-indigo-400 mb-2">
                                {stats.accuracy}%
                            </div>
                            <div className="text-sm text-gray-400 font-medium">
                                AI Accuracy Rate
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2">
                                {stats.users.toLocaleString()}+
                            </div>
                            <div className="text-sm text-gray-400 font-medium">
                                Active Researchers
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-pink-400 mb-2">
                                {stats.universities}+
                            </div>
                            <div className="text-sm text-gray-400 font-medium">
                                University Partners
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-400">
                                Powerful Features
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Why Academics Choose
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Guidelines Sync
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Cutting-edge AI technology meets academic excellence
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
                                whileHover={{ y: -10 }}
                                className="relative group"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl`}
                                />
                                <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 group-hover:border-blue-500/50 transition-all h-full">
                                    <div
                                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}
                                    >
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                        <Star className="w-3 h-3 text-blue-400" />
                                        <span className="text-xs font-semibold text-blue-400">
                                            {feature.stats}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gradient-to-b from-transparent to-blue-950/30">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
                            <BarChart3 className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">
                                Simple Process
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Transform Your Research
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                In 4 Easy Steps
                            </span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20" />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative"
                                >
                                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all">
                                        {/* Step Number */}
                                        <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-lg border-4 border-gray-950 shadow-lg">
                                            {step.step}
                                        </div>

                                        {/* Icon */}
                                        <div className="mt-6 mb-6">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                                                <step.icon className="w-8 h-8 text-blue-400" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/upload"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                        >
                            <Upload className="w-5 h-5" />
                            Start Processing Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Unmatched
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                {" "}
                                Academic Benefits
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                                    <benefit.icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gradient-to-b from-transparent to-indigo-950/30">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                            <MessageCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-400">
                                Got Questions?
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Frequently Asked
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                                Questions
                            </span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-all overflow-hidden"
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaq(openFaq === index ? null : index)
                                    }
                                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                                >
                                    <span className="font-bold text-white text-lg pr-4">
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className="w-6 h-6 text-green-400" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-8 pb-6 text-gray-400 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20" />
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <GraduationCap className="w-20 h-20 text-blue-400 mx-auto mb-8" />
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Ready to Transform
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Your Research?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                            Join 150,000+ academics who've elevated their research
                            with Guidelines Sync precision AI editing. Start your
                            free trial today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {!user ? (
                                <>
                                    <Link
                                        href="/register"
                                        className="px-8 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                                    >
                                        Create Free Account
                                    </Link>
                                    <Link
                                        href="/upload"
                                        className="px-8 py-5 bg-white/5 border-2 border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                                    >
                                        Try Without Account
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/upload"
                                        className="px-8 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                                    >
                                        Upload Document
                                    </Link>
                                    
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />

            {/* ChatBot with Improved Icon */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {isTooltipVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="max-w-xs p-4 bg-gray-800/95 backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-blue-500/30"
                    >
                        <button
                            onClick={handleCloseTooltip}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                      
                    </motion.div>
                )}
                <AcademicChatBot
                    isChatOpen={isChatOpen}
                    toggleChat={toggleChat}
                />
            </div>
        </div>
    );
};

export default HomePage;