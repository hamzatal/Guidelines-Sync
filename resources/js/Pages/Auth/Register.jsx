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
                type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
        >
            {message}
        </motion.div>
    );
};

export default function Register() {
    const { flash, errors: pageErrors } = usePage().props;
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

    // Handle flash messages and general page errors
    useEffect(() => {
        if (flash?.success) {
            setNotification({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setNotification({ type: "error", message: flash.error });
        } else if (
            pageErrors &&
            Object.keys(pageErrors).length > 0 &&
            !pageErrors.name &&
            !pageErrors.email &&
            !pageErrors.password &&
            !pageErrors.password_confirmation &&
            !pageErrors.company_name &&
            !pageErrors.license_number &&
            !pageErrors.role
        ) {
            const generalError = Object.values(pageErrors)[0];
            if (typeof generalError === "string") {
                setNotification({ type: "error", message: generalError });
            }
        }
    }, [flash, pageErrors]);

    // Clear sensitive fields on unmount
    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    // Update role based on accountType
    useEffect(() => {
        setData("role", accountType);
    }, [accountType]);

    // Client-side validation functions
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
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            clearErrors();
            setNotification(null);
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
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
                role: data.role,
            },
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
                            "Registration failed. Please try again or contact support.",
                    });
                }
                if (Object.keys(serverErrors).length > 0) {
                    reset("password", "password_confirmation");
                }
            },
            onFinish: () => {
                if (Object.keys(errors).length > 0 || (flash && flash.error)) {
                    reset("password", "password_confirmation");
                }
            },
        });
    };

    const renderStepIndicator = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-6"
            >
                <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div
                                className={`rounded-full h-10 w-10 flex items-center justify-center font-medium ${
                                    currentStep === step
                                        ? "bg-green-600 text-white"
                                        : currentStep > step
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-700 text-gray-300"
                                }`}
                            >
                                {step}
                            </div>
                            {step < 3 && (
                                <ChevronRight
                                    className={`w-5 h-5 ${
                                        currentStep > step
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-3xl sm:text-4xl font-bold text-white flex items-center justify-center">
                                <Shield className="inline-block w-7 h-7 text-green-400 mr-2" />
                                Choose Account Type
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Select the type of account you want to create
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                                    accountType === "user"
                                        ? "border-green-500 bg-green-600/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                                }`}
                                onClick={() => setAccountType("user")}
                            >
                                <User
                                    className={`w-12 h-12 mb-4 ${
                                        accountType === "user"
                                            ? "text-green-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-lg font-medium text-white">
                                    Individual
                                </h4>
                                <p className="text-sm text-gray-400 text-center mt-2">
                                    For formatting your research papers
                                </p>
                            </div>
                            <div
                                className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                                    accountType === "company"
                                        ? "border-green-500 bg-green-600/20"
                                        : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                                }`}
                                onClick={() => setAccountType("company")}
                            >
                                <Building2
                                    className={`w-12 h-12 mb-4 ${
                                        accountType === "company"
                                            ? "text-green-400"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h4 className="text-lg font-medium text-white">
                                    Company
                                </h4>
                                <p className="text-sm text-gray-400 text-center mt-2">
                                    For managing academic publishing services
                                </p>
                            </div>
                        </div>
                        {errors.role && (
                            <span className="text-red-500 text-xs mt-1.5 block text-center">
                                {errors.role}
                            </span>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-3xl sm:text-4xl font-bold text-white flex items-center justify-center">
                                <Shield className="inline-block w-7 h-7 text-green-400 mr-2" />
                                {accountType === "company"
                                    ? "Company Information"
                                    : "Personal Information"}
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                {accountType === "company"
                                    ? "Tell us about your company"
                                    : "Tell us who you are"}
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-300 mb-1.5"
                            >
                                {accountType === "company"
                                    ? "Contact Person Name"
                                    : "Full Name"}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
                                        errors.name
                                            ? "border-red-500"
                                            : "border-gray-600 hover:border-gray-500"
                                    }`}
                                    placeholder={
                                        accountType === "company"
                                            ? "Contact Person Name"
                                            : "Your Name"
                                    }
                                    autoComplete="name"
                                />
                            </div>
                            {errors.name && (
                                <span className="text-red-500 text-xs mt-1.5 block">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                        {accountType === "company" && (
                            <>
                                <div>
                                    <label
                                        htmlFor="company_name"
                                        className="block text-sm font-medium text-gray-300 mb-1.5"
                                    >
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="company_name"
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) =>
                                                setData(
                                                    "company_name",
                                                    e.target.value
                                                )
                                            }
                                            className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
                                                errors.company_name
                                                    ? "border-red-500"
                                                    : "border-gray-600 hover:border-gray-500"
                                            }`}
                                            placeholder="Your Company Name"
                                        />
                                    </div>
                                    {errors.company_name && (
                                        <span className="text-red-500 text-xs mt-1.5 block">
                                            {errors.company_name}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="license_number"
                                        className="block text-sm font-medium text-gray-300 mb-1.5"
                                    >
                                        License Number
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="license_number"
                                            id="license_number"
                                            value={data.license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "license_number",
                                                    e.target.value
                                                )
                                            }
                                            className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
                                                errors.license_number
                                                    ? "border-red-500"
                                                    : "border-gray-600 hover:border-gray-500"
                                            }`}
                                            placeholder="Company License Number"
                                        />
                                    </div>
                                    {errors.license_number && (
                                        <span className="text-red-500 text-xs mt-1.5 block">
                                            {errors.license_number}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
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
                                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-gray-600 hover:border-gray-500"
                                    }`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <span className="text-red-500 text-xs mt-1.5 block">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-3xl sm:text-4xl font-bold text-white flex items-center justify-center">
                                <Shield className="inline-block w-7 h-7 text-green-400 mr-2" />
                                Set Password
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Create a secure password for your account
                            </p>
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
                                    className={`pl-10 pr-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-gray-600 hover:border-gray-500"
                                    }`}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors focus:outline-none"
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
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-300 mb-1.5"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 pr-10 w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
                                        errors.password_confirmation
                                            ? "border-red-500"
                                            : "border-gray-600 hover:border-gray-500"
                                    }`}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors focus:outline-none"
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
                            {errors.password_confirmation && (
                                <span className="text-red-500 text-xs mt-1.5 block">
                                    {errors.password_confirmation}
                                </span>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderStepButtons = () => {
        return (
            <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                    <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-2.5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Back
                    </button>
                ) : (
                    <div></div>
                )}
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-all disabled:opacity-60 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center space-x-2"
                    disabled={processing}
                >
                    {currentStep === 3 ? (
                        <>
                            <Shield className="w-5 h-5" />
                            <span>
                                {processing
                                    ? "Creating Account..."
                                    : "Complete Registration"}
                            </span>
                        </>
                    ) : (
                        <>
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full relative bg-gray-900 flex overflow-hidden">
            <Head title="Register - Guidelines Sync" />

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
                className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all text-sm"
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
            <Notification
                message={notification?.message}
                type={notification?.type}
            />

            <div className="relative z-10 min-h-screen flex w-full">
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
                            className="bg-green-600/20 p-6 rounded-full inline-block mx-auto border-2 border-green-500"
                        >
                            {accountType === "company" ? (
                                <Building2 className="w-20 h-20 text-green-400" />
                            ) : (
                                <User className="w-20 h-20 text-green-400" />
                            )}
                        </motion.div>
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl font-bold text-white"
                        >
                            Join{" "}
                            <span className="text-green-400">
                                Guidelines Sync
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-gray-300 max-w-md mx-auto text-lg"
                        >
                            {accountType === "company"
                                ? "Create a company account to manage your academic publishing services."
                                : "Create an account to format your research papers effortlessly."}
                        </motion.p>
                    </div>
                </div>

                {/* Right Registration Form Panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md p-5 rounded-xl shadow-2xl bg-gray-800/90 backdrop-blur-md border border-gray-700"
                    >
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="bg-green-600/20 p-4 rounded-full inline-block mx-auto border border-green-500/50">
                                {accountType === "company" ? (
                                    <Building2 className="w-12 h-12 text-green-400" />
                                ) : (
                                    <User className="w-12 h-12 text-green-400" />
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-white mt-4">
                                <span className="text-green-400">Register</span>
                            </h1>
                        </div>

                        {renderStepIndicator()}
                        {renderStepContent()}
                        {renderStepButtons()}

                        <p className="text-center text-xs sm:text-sm text-gray-500 mt-8">
                            Already have an account?{" "}
                            <Link
                                href={route("login")}
                                className="font-medium text-green-500 hover:text-green-400 hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
