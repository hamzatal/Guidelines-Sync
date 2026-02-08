import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield, Home, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

const AdminLoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { flash, errors: pageErrors } = usePage().props;
    const [notification, setNotification] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        email: "",
        password: "",
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setNotification({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setNotification({ type: "error", message: flash.error });
        } else if (
            pageErrors &&
            Object.keys(pageErrors).length > 0 &&
            !pageErrors.email &&
            !pageErrors.password
        ) {
            const generalError = Object.values(pageErrors)[0];
            if (typeof generalError === "string") {
                setNotification({ type: "error", message: generalError });
            }
        }
    }, [flash, pageErrors]);

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
        if (!emailRegex.test(email))
            return "Please enter a valid email address";
        if (email.length > 100) return "Email cannot exceed 100 characters";
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        return null;
    };

    const clientValidateForm = () => {
        const newClientErrors = {};
        const emailError = validateEmail(data.email);
        if (emailError) newClientErrors.email = emailError;
        const passwordError = validatePassword(data.password);
        if (passwordError) newClientErrors.password = passwordError;
        return newClientErrors;
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        setNotification(null);

        const clientSideErrors = clientValidateForm();
        if (Object.keys(clientSideErrors).length > 0) {
            Object.keys(clientSideErrors).forEach((key) => {
                setError(key, clientSideErrors[key]);
            });
            setNotification({
                type: "error",
                message: "Please fix the errors highlighted below.",
            });
            return;
        }

        post(route("admin.login.submit"), {
            onSuccess: () => {
                // Redirect handled by server
            },
            onError: (serverErrors) => {
                if (
                    !flash?.error &&
                    (!serverErrors || Object.keys(serverErrors).length === 0)
                ) {
                    setNotification({
                        type: "error",
                        message:
                            "Login failed. Please check your credentials or try again.",
                    });
                }
            },
            onFinish: () => {
                if (Object.keys(errors).length > 0 || (flash && flash.error)) {
                    reset("password");
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
            <Head title="Admin Login - Guidelines Sync" />

            {/* Fixed Home Button */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-red-600/90 hover:bg-red-600 backdrop-blur-sm text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all group"
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
                                    ? "bg-green-900/90 border-green-500/50"
                                    : "bg-red-900/90 border-red-500/50"
                            }`}
                        >
                            {notification.type === "success" ? (
                                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
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

            {/* Animated Background - Red theme */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        
                        {/* Left Side - Hero Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
                                <Shield className="w-4 h-4 text-red-400" />
                                <span className="text-sm font-semibold text-red-400">
                                    Secure Admin Portal
                                </span>
                            </div>

                            <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
                                Admin{" "}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-pink-400">
                                    Control Panel
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                Secure administrative access for Guidelines Sync platform management. Authorized personnel only.
                            </p>

                            {/* Security Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <span>Enhanced security protocols</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                                    <span>Complete platform management</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-pink-400" />
                                    <span>Real-time system monitoring</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Admin Login Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full"
                        >
                            <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-red-900/50 shadow-2xl">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-500/30 mb-4">
                                        <Shield className="w-8 h-8 text-red-400" />
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                        Admin Sign In
                                    </h2>
                                    <p className="text-gray-400">
                                        Access the administration dashboard
                                    </p>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={submit} className="space-y-5">
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Admin Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all placeholder:text-gray-500 ${
                                                    errors.email
                                                        ? "border-red-500"
                                                        : "border-red-900/50 hover:border-red-500/50"
                                                }`}
                                                placeholder="admin@guidelinessync.com"
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Admin Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all placeholder:text-gray-500 ${
                                                    errors.password
                                                        ? "border-red-500"
                                                        : "border-red-900/50 hover:border-red-500/50"
                                                }`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Reset Password Link */}
                                    <div className="flex items-center justify-end">
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-red-400 hover:text-red-300 hover:underline transition-colors"
                                        >
                                            Reset admin credentials
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-red-500/30 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                Access Admin Panel
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                {/* Footer Links */}
                                <div className="mt-8 pt-6 border-t border-gray-700">
                                    <p className="text-center text-sm text-gray-400">
                                        Return to{" "}
                                        <Link
                                            href={route("login")}
                                            className="text-red-400 font-medium hover:text-red-300 hover:underline transition-colors"
                                        >
                                            User Login
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
};

export default AdminLoginPage;