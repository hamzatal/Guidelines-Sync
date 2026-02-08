import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    FileText,
    Send,
    X,
    GraduationCap,
    Sparkles,
    Brain,
    CheckCircle2,
    AlertCircle,
    FileCheck,
    Award,
    Target,
    MessageCircle,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatBot = ({ isChatOpen, toggleChat }) => {
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            text: "مرحبًا! أنا مساعد Guidelines Sync الذكي. كيف يمكنني مساعدتك في تحسين بحثك الأكاديمي؟",
            sender: "bot",
            language: "ar",
        },
        {
            text: "Hello! I'm the Guidelines Sync AI Assistant. How can I help you improve your academic research today?",
            sender: "bot",
            language: "en",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState("en");
    const messagesEndRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const detectLanguage = (message) => {
        return /[ء-ي]/.test(message) ? "ar" : "en";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        const userLanguage = detectLanguage(userMessage);
        setCurrentLanguage(userLanguage);

        setMessages((prev) => [
            ...prev,
            { text: userMessage, sender: "user", language: userLanguage },
        ]);
        setInputMessage("");
        setIsLoading(true);

        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post("/chatbot", {
                message: userMessage,
            });
            const botMessage = response.data.response;
            const botLanguage = response.data.language || userLanguage;

            const botText =
                typeof botMessage === "string"
                    ? botMessage
                    : JSON.stringify(botMessage);

            setMessages((prev) => [
                ...prev,
                {
                    text: botText,
                    sender: "bot",
                    language: botLanguage,
                },
            ]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    text:
                        userLanguage === "ar"
                            ? "عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى."
                            : "Sorry, an error occurred. Please try again.",
                    sender: "bot",
                    language: userLanguage,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = async (suggestion) => {
        const suggestionText =
            suggestion.text[currentLanguage] || suggestion.text.en;
        setMessages((prev) => [
            ...prev,
            { text: suggestionText, sender: "user", language: currentLanguage },
        ]);
        setIsLoading(true);

        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post("/chatbot", {
                message:
                    suggestion.prompt[currentLanguage] || suggestion.prompt.en,
            });
            const botMessage = response.data.response;
            const botLanguage = response.data.language || currentLanguage;

            const botText =
                typeof botMessage === "string"
                    ? botMessage
                    : JSON.stringify(botMessage);

            setMessages((prev) => [
                ...prev,
                {
                    text: botText,
                    sender: "bot",
                    language: botLanguage,
                },
            ]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    text:
                        currentLanguage === "ar"
                            ? "عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى."
                            : "Sorry, an error occurred. Please try again.",
                    sender: "bot",
                    language: currentLanguage,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatMessage = (messageText) => {
        return (
            <div className="text-gray-200 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => (
                            <h1
                                className="text-lg font-bold mt-3 mb-2 text-white"
                                {...props}
                            />
                        ),
                        h2: ({ node, ...props }) => (
                            <h2
                                className="text-base font-semibold mt-3 mb-2 text-blue-200"
                                {...props}
                            />
                        ),
                        h3: ({ node, ...props }) => (
                            <h3
                                className="text-sm font-medium mt-2 mb-1 text-blue-300"
                                {...props}
                            />
                        ),
                        p: ({ node, ...props }) => (
                            <p
                                className="text-sm leading-relaxed mb-2 text-gray-300"
                                {...props}
                            />
                        ),
                        ul: ({ node, ...props }) => (
                            <ul
                                className="list-none pl-0 mb-2 space-y-1"
                                {...props}
                            />
                        ),
                        li: ({ node, ...props }) => (
                            <li
                                className="text-sm flex items-start gap-2 mb-1.5"
                                {...props}
                            >
                                <span className="text-blue-400 mt-1.5">•</span>
                                <span className="flex-1">{props.children}</span>
                            </li>
                        ),
                        strong: ({ node, ...props }) => (
                            <strong className="text-blue-300 font-semibold" {...props} />
                        ),
                        code: ({ node, ...props }) => (
                            <code
                                className="bg-gray-900/50 px-1.5 py-0.5 rounded text-blue-300 text-xs"
                                {...props}
                            />
                        ),
                    }}
                >
                    {messageText}
                </ReactMarkdown>
            </div>
        );
    };

    const suggestions = [
        {
            text: { en: "Citation Styles", ar: "أنماط الاقتباس" },
            icon: <FileText size={16} />,
            prompt: {
                en: "What citation styles does Guidelines Sync support?",
                ar: "ما هي أنماط الاقتباس التي يدعمها Guidelines Sync؟",
            },
        },
        {
            text: { en: "AI Accuracy", ar: "دقة الذكاء الاصطناعي" },
            icon: <Brain size={16} />,
            prompt: {
                en: "How accurate is the AI correction system?",
                ar: "ما مدى دقة نظام التصحيح بالذكاء الاصطناعي؟",
            },
        },
        {
            text: { en: "File Formats", ar: "صيغ الملفات" },
            icon: <FileCheck size={16} />,
            prompt: {
                en: "What file formats can I upload?",
                ar: "ما هي صيغ الملفات التي يمكنني رفعها؟",
            },
        },
        {
            text: { en: "Get Started", ar: "كيف أبدأ" },
            icon: <Target size={16} />,
            prompt: {
                en: "How do I get started with Guidelines Sync?",
                ar: "كيف أبدأ مع Guidelines Sync؟",
            },
        },
    ];

    return (
        <>
            <style>
                {`
                    .scrollbar-academic::-webkit-scrollbar {
                        width: 8px;
                    }
                    .scrollbar-academic::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, #3b82f6 0%, #6366f1 100%);
                        border-radius: 10px;
                    }
                    .scrollbar-academic::-webkit-scrollbar-track {
                        background: rgba(15, 23, 42, 0.5);
                        border-radius: 10px;
                    }
                    .scrollbar-academic {
                        scrollbar-color: #3b82f6 rgba(15, 23, 42, 0.5);
                        scrollbar-width: thin;
                    }
                `}
            </style>

            <div className="relative">
                {/* Chat Toggle Button - New Professional Design */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleChat}
                    aria-label="Toggle academic assistant"
                    className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden"
                >
                    {/* Animated Background Rings */}
                    <div className="absolute inset-0">
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white/20"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white/20"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />
                    </div>

                    {/* Gradient Mesh Background */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 bg-blue-200 rounded-full blur-xl" />
                    </div>

                    {/* Icon Container */}
                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            {isChatOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <X className="w-8 h-8 text-white drop-shadow-lg" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="open"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative"
                                >
                                    {/* Main Icon */}
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <GraduationCap className="w-10 h-10 text-white drop-shadow-2xl" />
                                    </motion.div>

                                    {/* Sparkle Effect */}
                                    <motion.div
                                        className="absolute -top-1 -right-1"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [1, 0.5, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4 text-yellow-300" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Notification Badge */}
                    {!isChatOpen && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <MessageCircle className="w-3 h-3 text-white" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                </motion.button>

                {/* Chat Window */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="absolute bottom-24 right-0 w-96 h-[600px] flex flex-col shadow-2xl rounded-3xl overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                            }}
                        >
                            {/* Header */}
                            <div className="relative p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
                                {/* Animated Background Elements */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse delay-500" />
                                </div>

                                <div className="relative flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Logo */}
                                        <motion.div
                                            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <GraduationCap className="w-7 h-7 text-white drop-shadow-lg" />
                                        </motion.div>

                                        {/* Title */}
                                        <div>
                                            <h4 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
                                                Academic AI
                                            </h4>
                                            <p className="text-xs text-blue-100/80 font-medium flex items-center gap-1.5">
                                                <Sparkles className="w-3 h-3" />
                                                {currentLanguage === "ar"
                                                    ? "مساعدك البحثي الذكي"
                                                    : "Your Research Assistant"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleChat}
                                        className="text-white/90 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                {/* Status Indicator */}
                                <div className="relative mt-4 flex items-center gap-2 text-white/90 text-xs">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="font-medium">
                                        {currentLanguage === "ar"
                                            ? "متصل ومتاح للمساعدة"
                                            : "Online & Ready to Help"}
                                    </span>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-academic">
                                {messages
                                    .filter(
                                        (msg) =>
                                            !msg.language ||
                                            msg.language === currentLanguage
                                    )
                                    .map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                            }}
                                            className={`flex ${
                                                msg.sender === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            {msg.sender === "bot" && (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-lg">
                                                    <Brain
                                                        size={16}
                                                        className="text-white"
                                                    />
                                                </div>
                                            )}

                                            <div
                                                className={`max-w-[75%] ${
                                                    msg.sender === "user"
                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl rounded-tr-md px-5 py-3 shadow-lg"
                                                        : "bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm text-gray-100 rounded-3xl rounded-tl-md px-5 py-4 shadow-xl border border-slate-700/50"
                                                }`}
                                            >
                                                {formatMessage(msg.text)}

                                                {msg.sender === "bot" && (
                                                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/50">
                                                        <Award
                                                            size={12}
                                                            className="text-blue-400"
                                                        />
                                                        <p className="text-xs text-blue-400/80 font-medium">
                                                            Guidelines Sync AI
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2,
                                                    ease: "linear",
                                                }}
                                            >
                                                <Brain
                                                    size={16}
                                                    className="text-white"
                                                />
                                            </motion.div>
                                        </div>
                                        <div className="flex items-center gap-2 px-5 py-3 rounded-3xl rounded-tl-md bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 shadow-xl">
                                            <div className="flex gap-1">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 h-2 bg-blue-400 rounded-full"
                                                        animate={{
                                                            scale: [1, 1.3, 1],
                                                        }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 1,
                                                            delay: i * 0.2,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-blue-300 font-medium">
                                                {currentLanguage === "ar"
                                                    ? "يفكر..."
                                                    : "Thinking..."}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggestions */}
                            <div className="px-5 py-4 bg-gradient-to-b from-slate-900/50 to-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
                                <div className="grid grid-cols-2 gap-2">
                                    {suggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{
                                                scale: 1.05,
                                                y: -2,
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                handleSuggestionClick(suggestion)
                                            }
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm text-blue-300 text-sm font-medium rounded-2xl hover:from-blue-600/20 hover:to-indigo-700/20 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 shadow-lg"
                                        >
                                            {suggestion.icon}
                                            <span>
                                                {suggestion.text[currentLanguage] ||
                                                    suggestion.text.en}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Area */}
                            <form
                                onSubmit={handleSubmit}
                                className="p-5 bg-gradient-to-t from-slate-900 to-slate-900/80 backdrop-blur-sm border-t border-slate-700/50"
                            >
                                <div className="relative flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) =>
                                                setInputMessage(e.target.value)
                                            }
                                            onKeyDown={handleKeyDown}
                                            placeholder={
                                                currentLanguage === "ar"
                                                    ? "اسأل عن بحثك الأكاديمي..."
                                                    : "Ask about your research..."
                                            }
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-800/80 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50 text-sm font-medium shadow-lg transition-all duration-300"
                                            dir={
                                                currentLanguage === "ar"
                                                    ? "rtl"
                                                    : "ltr"
                                            }
                                        />
                                        {/* Animated Border Glow */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg ${
                                            isLoading
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        <Send className="w-5 h-5 text-white" />
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default ChatBot;