import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Home,
    Building2,
    User,
    PhoneCall,
    Shield,
} from "lucide-react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";


// Notification Component (from AdminLoginPage.jsx)
const Notification = ({ message, type }) => {
    const [visible, setVisible] = useState(!!message);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000); // Notification visible for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message, type]);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-6 right-6 z-[100] p-4 rounded-md shadow-xl text-white text-sm font-medium ${
                type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}
        >
            {message}
        </motion.div>
    );
};

export default function Login({ status }) {
    const { auth, flash, errors: pageErrors } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState(null);
    const [accountType, setAccountType] = useState(
        auth.company ? "company" : "user"
    );

    const { data, setData, post, processing, errors, reset, setError, clearErrors } =
        useForm({
            email: "",
            password: "",
            remember: false,
        });

    // Handle flash messages and general page errors
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

    // Clear password on unmount
    useEffect(() => {
        return () => reset("password");
    }, []);

    // Redirect if company is logged in
    useEffect(() => {
        if (auth.company && accountType === "company") {
            router.visit(route("home"), { replace: true });
        }
    }, [auth.company, accountType]);

    // Client-side validation
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
        setNotification(null);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([key, message]) =>
                setError(key, message)
            );
            setNotification({
                type: "error",
                message: "Please fix the errors highlighted below.",
            });
            return;
        }

        const routeName = accountType === "company" ? "company.login" : "login";
        post(route(routeName), {
            onSuccess: () => {
                // Notification handled by flash message via useEffect
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
                if (Object.keys(serverErrors).length > 0) {
                    reset("password");
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
        <div className="min-h-screen w-full relative bg-gray-900">
            <Head title="Log in - Guidelines Sync" />



            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: "url('/images/background.jpg')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-40 z-0" />

            {/* Home Button */}
            <Link
                href={route("home")}
                className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all text-sm"
            >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
            </Link>

            {/* Contact Us Button */}
            <Link
                href={route("ContactPage")}
                className="fixed top-20 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all text-sm"
            >
                <PhoneCall className="w-4 h-4" />
                <span className="font-medium">Contact Us</span>
            </Link>

            {/* Notification */}
            <Notification message={notification?.message} type={notification?.type} />

            <div className="relative z-10 min-h-screen flex">
                {/* Left Decorative Panel (Hidden on small screens) */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
                    <div className="text-center space-y-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 0.5,
                                type: "spring",
                                stiffness: 120,
                            }}
                            className="bg-blue-600/20 p-6 rounded-full inline-block mx-auto border-2 border-blue-500"
                        >
                            {accountType === "company" ? (
                                <Building2 className="w-20 h-20 text-blue-400" />
                            ) : (
                                <User className="w-20 h-20 text-blue-400" />
                            )}
                        </motion.div>
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl font-bold text-white"
                        >
                            Welcome to{" "}
                            <span className="text-blue-400">Guidelines Sync</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-gray-300 max-w-md mx-auto text-lg"
                        >
                            {accountType === "company"
                                ? "Log in to manage your academic publishing services."
                                : "Log in to format your research papers effortlessly."}
                        </motion.p>
                    </div>
                </div>

                {/* Right Login Form Panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md p-8 rounded-xl shadow-2xl bg-gray-800/90 backdrop-blur-md border border-gray-700"
                    >
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="bg-blue-600/20 p-4 rounded-full inline-block mx-auto border border-blue-500/50">
                                {accountType === "company" ? (
                                    <Building2 className="w-12 h-12 text-blue-400" />
                                ) : (
                                    <User className="w-12 h-12 text-blue-400" />
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-white mt-4">
                                <span className="text-blue-400">Log in</span>
                            </h1>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2 flex items-center justify-center">
                            <Shield className="inline-block w-7 h-7 text-blue-400 mr-2" />
                            {accountType === "company" ? "Company Login" : "User Login"}
                        </h2>
                        <p className="text-gray-400 text-center mb-8 text-sm">
                            Select your account type to continue.
                        </p>

                        {status && (
                            <div className="mb-4 text-sm text-blue-500 text-center">
                                {status}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                                    accountType === "user"
                                        ? "border-blue-500 bg-blue-600/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                                }`}
                                onClick={() => setAccountType("user")}
                            >
                                <User
                                    className={`w-8 h-8 mb-2 ${
                                        accountType === "user"
                                            ? "text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-sm font-medium text-white">
                                    Individual
                                </h4>
                            </div>
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                                    accountType === "company"
                                        ? "border-blue-500 bg-blue-600/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                                }`}
                                onClick={() => setAccountType("company")}
                            >
                                <Building2
                                    className={`w-8 h-8 mb-2 ${
                                        accountType === "company"
                                            ? "text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-sm font-medium text-white">
                                    Company
                                </h4>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-300 mb-1.5"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-600 hover:border-gray-500"
                                        }`}
                                        placeholder="you@example.com"
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && (
                                    <span className="text-red-500 text-xs mt-1.5 block">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-300 mb-1.5"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`pl-10 pr-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-600 hover:border-gray-500"
                                        }`}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="text-red-500 text-xs mt-1.5 block">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <label className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                        className="mr-2 h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-700"
                                    />
                                    Remember me
                                </label>
                                <Link
                                    href={route("password.request")}
                                    className="font-medium text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 flex items-center justify-center bg-blue-600 text-white rounded-lg font-semibold text-base transition-all hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                <Shield className="w-5 h-5 mr-2.5" />
                                {processing ? "Logging In..." : "Log In"}
                            </button>

                            <p className="text-center text-xs sm:text-sm text-gray-500 mt-8">
                                Don’t have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                                >
                                    Sign up
                                </Link>
                                <span> / </span>
                                <Link
                                    href={
                                        auth.admin
                                            ? route("admin.dashboard")
                                            : route("admin.login")
                                    }
                                    className="font-medium text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                                >
                                    Admin ?
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}