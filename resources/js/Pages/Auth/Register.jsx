import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Home,
    Building2,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Award,
    Shield,
    Zap,
} from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [accountType, setAccountType] = useState("user");

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
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
        company_name: "",
        license_number: "",
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    useEffect(() => {
        setData("role", accountType);
    }, [accountType]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateName = (name) => {
        if (!name) return "Name is required";
        if (name.length < 2) return "Name must be at least 2 characters long";
        if (name.length > 50) return "Name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(name))
            return "Name can only contain letters, spaces, hyphens, and apostrophes";
        return null;
    };

    const validateCompanyName = (companyName) => {
        if (accountType === "company" && !companyName)
            return "Company name is required";
        if (companyName && companyName.length < 2)
            return "Company name must be at least 2 characters long";
        if (companyName && companyName.length > 100)
            return "Company name cannot exceed 100 characters";
        return null;
    };

    const validateLicenseNumber = (licenseNumber) => {
        if (accountType === "company" && !licenseNumber)
            return "License number is required";
        if (licenseNumber && licenseNumber.length > 50)
            return "License number cannot exceed 50 characters";
        if (licenseNumber && !/^[a-zA-Z0-9-]+$/.test(licenseNumber))
            return "License number can only contain letters, numbers, and hyphens";
        return null;
    };

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
        if (password.length < 8)
            return "Password must be at least 8 characters long";
        if (password.length > 64) return "Password cannot exceed 64 characters";
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasUpperCase)
            return "Password must contain at least one uppercase letter";
        if (!hasLowerCase)
            return "Password must contain at least one lowercase letter";
        if (!hasNumbers) return "Password must contain at least one number";
        if (!hasSpecialChar)
            return "Password must contain at least one special character";
        return null;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) return "Please confirm your password";
        if (password !== confirmPassword) return "Passwords do not match";
        return null;
    };

    const validate = () => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!accountType) newErrors.role = "Please select an account type";
        }
        if (currentStep === 2) {
            const nameError = validateName(data.name);
            if (nameError) newErrors.name = nameError;
            const companyNameError = validateCompanyName(data.company_name);
            if (companyNameError) newErrors.company_name = companyNameError;
            const licenseNumberError = validateLicenseNumber(
                data.license_number
            );
            if (licenseNumberError)
                newErrors.license_number = licenseNumberError;
            const emailError = validateEmail(data.email);
            if (emailError) newErrors.email = emailError;
        }
        if (currentStep === 3) {
            const passwordError = validatePassword(data.password);
            if (passwordError) newErrors.password = passwordError;
            const confirmPasswordError = validateConfirmPassword(
                data.password,
                data.password_confirmation
            );
            if (confirmPasswordError)
                newErrors.password_confirmation = confirmPasswordError;
        }
        return newErrors;
    };

    const handleNextStep = () => {
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
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
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
        const routeName =
            accountType === "company" ? "company.register" : "register";
        post(route(routeName), {
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                ...(accountType === "company" && {
                    company_name: data.company_name,
                    license_number: data.license_number,
                }),
            },
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message:
                        accountType === "company"
                            ? "Company registration successful! Redirecting to dashboard..."
                            : "Registration successful! Please verify your email.",
                });
            },
            onError: (serverErrors) => {
                setNotification({
                    type: "error",
                    message:
                        serverErrors.email ||
                        serverErrors.company_name ||
                        serverErrors.license_number ||
                        "Registration failed. Please try again.",
                });
            },
        });
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div
                                className={`rounded-full h-10 w-10 flex items-center justify-center font-medium transition-all ${
                                    currentStep === step
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                                        : currentStep > step
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-700 text-gray-400"
                                }`}
                            >
                                {step}
                            </div>
                            {step < 3 && (
                                <ChevronRight
                                    className={`w-5 h-5 ${
                                        currentStep > step
                                            ? "text-blue-500"
                                            : "text-gray-600"
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Choose Account Type
                            </h3>
                            <p className="text-sm text-gray-400">
                                Select the type of account you want to create
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                                    accountType === "user"
                                        ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-blue-500/50"
                                }`}
                                onClick={() => setAccountType("user")}
                            >
                                <User
                                    className={`w-12 h-12 mb-4 mx-auto ${
                                        accountType === "user"
                                            ? "text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-lg font-medium text-white text-center">
                                    Individual
                                </h4>
                                <p className="text-sm text-gray-400 text-center mt-2">
                                    For students & researchers
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                                    accountType === "company"
                                        ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-blue-500/50"
                                }`}
                                onClick={() => setAccountType("company")}
                            >
                                <Building2
                                    className={`w-12 h-12 mb-4 mx-auto ${
                                        accountType === "company"
                                            ? "text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-lg font-medium text-white text-center">
                                    Institution
                                </h4>
                                <p className="text-sm text-gray-400 text-center mt-2">
                                    For universities & companies
                                </p>
                            </motion.div>
                        </div>
                        {errors.role && (
                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1 justify-center">
                                <AlertCircle className="w-4 h-4" />
                                {errors.role}
                            </p>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-5">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {accountType === "company"
                                    ? "Institution Information"
                                    : "Personal Information"}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {accountType === "company"
                                    ? "Tell us about your institution"
                                    : "Tell us who you are"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                {accountType === "company"
                                    ? "Contact Person Name"
                                    : "Full Name"}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                        errors.name
                                            ? "border-red-500"
                                            : "border-blue-900/50 hover:border-blue-500/50"
                                    }`}
                                    placeholder={
                                        accountType === "company"
                                            ? "Dr. Ahmed Al-Mansour"
                                            : "Your Full Name"
                                    }
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        {accountType === "company" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Institution Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) =>
                                                setData(
                                                    "company_name",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                                errors.company_name
                                                    ? "border-red-500"
                                                    : "border-blue-900/50 hover:border-blue-500/50"
                                            }`}
                                            placeholder="University of Jordan"
                                        />
                                    </div>
                                    {errors.company_name && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.company_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        License Number
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={data.license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "license_number",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all placeholder:text-gray-500 ${
                                                errors.license_number
                                                    ? "border-red-500"
                                                    : "border-blue-900/50 hover:border-blue-500/50"
                                            }`}
                                            placeholder="LIC-123456"
                                        />
                                    </div>
                                    {errors.license_number && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.license_number}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
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
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-5">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Secure Your Account
                            </h3>
                            <p className="text-sm text-gray-400">
                                Create a strong password for your account
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
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
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
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
                            {errors.password_confirmation && (
                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
            <Head title="Register - Guidelines Sync" />

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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Side - Hero */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-semibold text-blue-400">
                                    Join Guidelines Sync
                                </span>
                            </div>

                            <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
                                Start Your{" "}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                                    Research Journey
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                {accountType === "company"
                                    ? "Create an institutional account to manage academic research workflows and empower your team with AI-driven tools."
                                    : "Join thousands of researchers using AI-powered tools for thesis formatting, citation management, and academic excellence."}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                    <Award className="w-8 h-8 text-blue-400 mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">
                                        98%
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        AI Accuracy
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                    <Zap className="w-8 h-8 text-indigo-400 mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">
                                        150K+
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Researchers
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-900/50 hover:border-blue-500/50 transition-all">
                                    <Shield className="w-8 h-8 text-cyan-400 mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">
                                        25+
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Universities
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span>AI-powered thesis formatting</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                    <span>98% accuracy across standards</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                    <span>GDPR compliant & secure</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Register Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full"
                        >
                            <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-blue-900/50 shadow-2xl">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                        Create Account
                                    </h2>
                                    <p className="text-gray-400">
                                        Step {currentStep} of 3
                                    </p>
                                </div>

                                {/* Step Indicator */}
                                {renderStepIndicator()}

                                {/* Step Content */}
                                {renderStepContent()}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 gap-4">
                                    {currentStep > 1 ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                                        >
                                            Back
                                        </motion.button>
                                    ) : (
                                        <div></div>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={processing}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {currentStep === 3 ? (
                                            processing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    Complete Registration
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </>
                                            )
                                        ) : (
                                            <>
                                                Next
                                                <ChevronRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-700">
                                    <p className="text-center text-sm text-gray-400">
                                        Already have an account?{" "}
                                        <Link
                                            href={route("login")}
                                            className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
                                        >
                                            Sign in
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