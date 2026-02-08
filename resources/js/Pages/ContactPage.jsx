import React, { useState, useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    AlertCircle,
    MessageCircle,
    Headphones,
    Globe,
    Zap,
    GraduationCap,
    BookOpen,
    FileText,
    ChevronDown,
} from "lucide-react";

const Contact = ({ auth }) => {
    const [notification, setNotification] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const { data, setData, processing, errors, reset, setError, clearErrors } =
        useForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });

    const validate = () => {
        const newErrors = {};
        if (!data.name) newErrors.name = "Name is required";
        else if (data.name.length < 2)
            newErrors.name = "Name must be at least 2 characters";
        else if (data.name.length > 50)
            newErrors.name = "Name cannot exceed 50 characters";

        if (!data.email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(data.email))
            newErrors.email = "Please enter a valid email address";
        else if (data.email.length > 100)
            newErrors.email = "Email cannot exceed 100 characters";

        if (!data.subject) newErrors.subject = "Subject is required";
        else if (data.subject.length < 3)
            newErrors.subject = "Subject must be at least 3 characters";
        else if (data.subject.length > 100)
            newErrors.subject = "Subject cannot exceed 100 characters";

        if (!data.message) newErrors.message = "Message is required";
        else if (data.message.length < 10)
            newErrors.message = "Message must be at least 10 characters";
        else if (data.message.length > 500)
            newErrors.message = "Message cannot exceed 500 characters";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) =>
                setError(key, message)
            );
            setNotification({
                type: "error",
                message: "Please fix the errors below.",
            });
            return;
        }

        try {
            const response = await router.post("/contacts", data);
            setNotification({
                type: "success",
                message: response.data.message || "Message sent successfully!",
            });
            reset();
        } catch (error) {
            setNotification({
                type: "error",
                message:
                    error.response?.data?.message ||
                    "An error occurred while sending your message.",
            });
        }
    };

    // Contact methods - Guidelines Sync Academic Platform
    const contactMethods = [
        {
            icon: Mail,
            title: "Academic Support",
            description: "Research guidelines & technical support",
            contact: "support@guidelinessync.com",
            color: "from-blue-500 to-indigo-500",
            action: "mailto:support@guidelinessync.com",
        },
        {
            icon: Phone,
            title: "University Line",
            description: "Mon-Fri 9am-7pm GMT+3",
            contact: "+962-799-123456",
            color: "from-indigo-500 to-blue-600",
            action: "tel:+962799123456",
        },
        {
            icon: GraduationCap,
            title: "University Partnerships",
            description: "Institutional licensing & integration",
            contact: "partners@guidelinessync.com",
            color: "from-blue-600 to-cyan-500",
            action: "mailto:partners@guidelinessync.com",
        },
    ];

    // FAQ data - Guidelines Sync focused
    const faqs = [
        {
            question: "How does Guidelines Sync AI correction work?",
            answer: "AI analyzes research structure, formatting, citations against academic standards with 98% accuracy.",
        },
        {
            question: "What file formats does Guidelines Sync support?",
            answer: "PDF, DOCX, DOC. Maximum 50MB with OCR for scanned research papers.",
        },
        {
            question: "Is my research secure with Guidelines Sync?",
            answer: "GDPR compliant, end-to-end encryption. Data auto-deleted after 30 days.",
        },
        {
            question: "What citation styles are supported?",
            answer: "APA, MLA, Chicago, IEEE, Harvard, Vancouver + 15 academic standards.",
        },
        {
            question: "University licensing available?",
            answer: "Yes! Contact partners@guidelinessync.com for institutional plans.",
        },
        {
            question: "Guidelines Sync accuracy rate?",
            answer: "98% validated by partner universities across 10+ disciplines.",
        },
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            <Head title="Contact Us - Academic Support | Guidelines Sync" />
            <Navbar />

            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-6 right-6 z-50 max-w-md"
                    >
                        <div
                            className={`rounded-xl shadow-2xl border backdrop-blur-sm p-4 flex items-start gap-3 ${
                                notification.type === "success"
                                    ? "bg-blue-900/90 border-blue-500/50"
                                    : "bg-red-900/90 border-red-500/50"
                            }`}
                        >
                            {notification.type === "success" ? (
                                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="font-semibold mb-1">
                                    {notification.type === "success"
                                        ? "Success!"
                                        : "Error"}
                                </p>
                                <p className="text-sm text-gray-200">
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Animated Background - Blue theme */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full"
                    >
                        <Headphones className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">
                            Guidelines Sync Support
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
                    >
                        Guidelines{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                            Sync Support
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                    >
                        Expert academic support for research guidelines, AI correction, 
                        and university integration. Response within 24 hours guaranteed.
                    </motion.p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contactMethods.map((method, index) => (
                            <motion.a
                                key={index}
                                href={method.action}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="relative group"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                                    style={{
                                        background: `linear-gradient(to bottom right, ${method.color})`,
                                    }}
                                />
                                <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-900/50 group-hover:border-blue-500/50 transition-all h-full">
                                    <div
                                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} mb-4 shadow-lg`}
                                    >
                                        <method.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {method.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-3">
                                        {method.description}
                                    </p>
                                    <p className="text-blue-400 font-medium text-sm">
                                        {method.contact}
                                    </p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content - Form & Info */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Left Side - Form (3 columns) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-blue-900/50">
                                <div className="mb-8">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        Guidelines{" "}
                                        <span className="text-blue-400">Sync</span>
                                        <br />
                                        Support
                                    </h2>
                                    <p className="text-gray-400">
                                        Get help with research guidelines, AI correction features, 
                                        or institutional licensing requirements.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Name & Email Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${
                                                    errors.name
                                                        ? "border-red-500"
                                                        : "border-blue-900/50 hover:border-blue-500/50"
                                                }`}
                                                placeholder="Dr. Ahmed Al-Mansour"
                                            />
                                            {errors.name && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                University Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${
                                                    errors.email
                                                        ? "border-red-500"
                                                        : "border-blue-900/50 hover:border-blue-500/50"
                                                }`}
                                                placeholder="ahmed@university.edu.jo"
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    "subject",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${
                                                errors.subject
                                                    ? "border-red-500"
                                                    : "border-blue-900/50 hover:border-blue-500/50"
                                            }`}
                                            placeholder="Research guidelines / AI correction / University licensing"
                                        />
                                        {errors.subject && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    "message",
                                                    e.target.value
                                                )
                                            }
                                            rows="6"
                                            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all resize-none ${
                                                errors.message
                                                    ? "border-red-500"
                                                    : "border-blue-900/50 hover:border-blue-500/50"
                                            }`}
                                            placeholder="Describe your research guidelines needs, technical support requirements, or university integration inquiry..."
                                        />
                                        <div className="flex justify-between items-center mt-2">
                                            {errors.message ? (
                                                <p className="text-red-400 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.message}
                                                </p>
                                            ) : (
                                                <div />
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {data.message.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 hover:from-blue-700 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Send to Guidelines Sync
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Right Side - Info & FAQ (2 columns) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Quick Response Time */}
                            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">
                                            Guidelines Sync Priority
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            University & research inquiries receive priority 
                                            response within 12 hours during business days.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section - Accordion Style */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-900/50">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="space-y-2"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-blue-400" />
                                        Guidelines Sync FAQ
                                    </h3>
                                    {faqs.map((faq, index) => (
                                        <motion.div
                                            key={index}
                                            variants={{
                                                hidden: { opacity: 0, height: 0 },
                                                visible: { opacity: 1, height: "auto" },
                                            }}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: index * 0.1 }}
                                            className="group border-b border-blue-900/30 last:border-b-0 hover:bg-blue-900/20 transition-all rounded-lg p-3 cursor-pointer"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                                                    {faq.question}
                                                </h4>
                                                <motion.div
                                                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-blue-400 ml-2"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </motion.div>
                                            </div>
                                            <AnimatePresence>
                                                {openFaq === index && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="text-sm text-gray-300 ml-6 leading-relaxed"
                                                    >
                                                        {faq.answer}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
