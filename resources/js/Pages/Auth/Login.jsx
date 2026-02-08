import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Building2,
    User,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ArrowRight,
    Home,
    Zap,
    Shield,
    Award,
} from "lucide-react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";

export default function Login({ status }) {
    const { auth } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState(null);
    const [accountType, setAccountType] = useState("user");

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // ===== منع الوصول إذا كان مسجل دخول =====
    useEffect(() => {
        if (auth?.user) {
            router.replace(route('home'));
            return;
        }
    }, [auth]);

    // ===== منع الرجوع بالمتصفح =====
    useEffect(() => {
        // دفع state جديد للـ history
        window.history.pushState(null, '', window.location.href);

        const handlePopState = (e) => {
            // إذا كان مسجل دخول، منعه من الرجوع
            if (auth?.user) {
                e.preventDefault();
                window.history.pushState(null, '', window.location.href);
                router.replace(route('home'));
            } else {
                // إذا لم يكن مسجل، دفع state جديد
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [auth]);

    useEffect(() => {
        return () => reset("password");
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateEmail = (email) => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        return null;
    };

    const validate = () => {
        const newErrors = {};
        const emailError = validateEmail(data.email);
        if (emailError) newErrors.email = emailError;
        const passwordError = validatePassword(data.password);
        if (passwordError) newErrors.password = passwordError;
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setNotification({
                type: "error",
                message: "Please fix the errors below.",
            });
            return;
        }

        const routeName = accountType === "company" ? "company.login" : "login";
        
        post(route(routeName), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Login successful! Redirecting...",
                });
                // استخدم replace بدلاً من visit
                setTimeout(() => {
                    router.replace(route("home"));
                }, 1000);
            },
            onError: (serverErrors) => {
                setNotification({
                    type: "error",
                    message: serverErrors.email || "Login failed. Please check your credentials.",
                });
            },
        });
    };

    // لا تعرض الصفحة إذا كان مسجل دخول
    if (auth?.user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
            <Head title="Log in - Guidelines Sync" />

            {/* Fixed Home Button - Top Left */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-blue-600/90 hover:bg-blue-600 backdrop-blur-sm text-white rounded-full shadow-lg hover:shadow-blue-500/50 transition-all group"
            >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Home</span>
            </Link>

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
                                    {notification.type === "success" ? "Success!" : "Error"}
                                </p>
                                <p className="text-sm text-gray-200">{notification.message}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>

            {/* Main Content - Full Height */}
            <div className="relative min-h-screen flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        
                        {/* Left Side - Hero Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block space-y-8"
                        >
                            {/* Logo/Brand Section */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-semibold text-blue-400">
                                        AI-Powered Academic Platform
                                    </span>
                                </div>

                                <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
                                    Welcome to{" "}
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                                        Guidelines Sync
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                    {accountType === "company"
                                        ? "Manage your institution's academic workflows with enterprise-grade AI tools and collaborative features."
                                        : "Transform your research with AI-powered formatting, citation management, and academic excellence tools."}
                                </p>
                            </motion.div>

                            {/* Stats Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="grid grid-cols-3 gap-4"
                            >
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                    <Award className="w-8 h-8 text-blue-400 mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">98%</div>
                                    <div className="text-xs text-gray-400">AI Accuracy</div>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                    <Zap className="w-8 h-8 text-indigo-400 mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">150K+</div>
                                    <div className="text-xs text-gray-400">Researchers</div>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                    <Shield className="w-8 h-8 text-cyan-400 mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">25+</div>
                                    <div className="text-xs text-gray-400">Universities</div>
                                </div>
                            </motion.div>

                            {/* Feature Highlights */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span>Real-time AI correction & formatting</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                    <span>Support for APA, MLA, IEEE standards</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                    <span>Secure & GDPR compliant platform</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Login Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full"
                        >
                            <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-blue-900/50 shadow-2xl">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Sign In</h2>
                                    <p className="text-gray-400">Access your Guidelines Sync account</p>
                                </div>

                                {status && (
                                    <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl text-blue-400 text-sm">
                                        {status}
                                    </div>
                                )}

                                {/* Account Type Selection */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            accountType === "user"
                                                ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                                                : "border-gray-700 bg-gray-800/50 hover:border-blue-500/50"
                                        }`}
                                        onClick={() => setAccountType("user")}
                                    >
                                        <User className={`w-7 h-7 mb-2 mx-auto ${accountType === "user" ? "text-blue-400" : "text-gray-400"}`} />
                                        <h4 className="text-center font-semibold text-white text-sm">Individual</h4>
                                        <p className="text-xs text-center text-gray-400 mt-1">Student/Researcher</p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            accountType === "company"
                                                ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                                                : "border-gray-700 bg-gray-800/50 hover:border-blue-500/50"
                                        }`}
                                        onClick={() => setAccountType("company")}
                                    >
                                        <Building2 className={`w-7 h-7 mb-2 mx-auto ${accountType === "company" ? "text-blue-400" : "text-gray-400"}`} />
                                        <h4 className="text-center font-semibold text-white text-sm">Institution</h4>
                                        <p className="text-xs text-center text-gray-400 mt-1">University/Company</p>
                                    </motion.div>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                                    errors.email ? "border-red-500" : "border-blue-900/50 hover:border-blue-500/50"
                                                }`}
                                                placeholder="you@university.edu"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                                    errors.password ? "border-red-500" : "border-blue-900/50 hover:border-blue-500/50"
                                                }`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center text-gray-300 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData("remember", e.target.checked)}
                                                className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="group-hover:text-blue-400 transition-colors">Remember me</span>
                                        </label>
                                        <Link
                                            href={route("password.request")}
                                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                {/* Footer Links */}
                                <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
                                    <p className="text-center text-sm text-gray-400">
                                        Don't have an account?{" "}
                                        <Link
                                            href={route("register")}
                                            className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
                                        >
                                            Create Account
                                        </Link>
                                    </p>
                                    <p className="text-center text-sm text-gray-400">
                                        <Link
                                            href={route("admin.login")}
                                            className="text-red-400 font-medium hover:text-red-300 hover:underline transition-colors"
                                        >
                                            Admin Access
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}