import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Home, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const ResetPassword = ({ token, email }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validate = () => {
        const newErrors = {};
        if (!data.email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(data.email))
            newErrors.email = "Please enter a valid email address";
        else if (data.email.length > 100)
            newErrors.email = "Email cannot exceed 100 characters";

        if (!data.password) newErrors.password = "Password is required";
        else if (data.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        else if (data.password.length > 50)
            newErrors.password = "Password cannot exceed 50 characters";

        if (!data.password_confirmation)
            newErrors.password_confirmation = "Confirm password is required";
        else if (data.password !== data.password_confirmation)
            newErrors.password_confirmation = "Passwords do not match";

        return newErrors;
    };

    const submit = (e) => {
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

        post(route("password.store"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message:
                        "Password reset successfully! Redirecting to login...",
                });
                setTimeout(() => {
                    window.location.href = route("login");
                }, 2000);
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "Failed to reset password. Please try again.",
                });
            },
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
            <Head title="Reset Password - Guidelines Sync" />

            {/* Fixed Home Button */}
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

            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-blue-900/50 shadow-2xl"
                    >
                        {/* Icon & Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 mb-4">
                                <RefreshCw className="w-8 h-8 text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Reset Password
                            </h2>
                            <p className="text-gray-400">
                                Enter your new password below
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-blue-900/50 hover:border-blue-500/50"
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

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-blue-900/50 hover:border-blue-500/50"
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
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

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                            errors.password_confirmation
                                                ? "border-red-500"
                                                : "border-blue-900/50 hover:border-blue-500/50"
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

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
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <CheckCircle2 className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <p className="text-center text-sm text-gray-400">
                                Remember your password?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
                                >
                                    Back to Sign in
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;