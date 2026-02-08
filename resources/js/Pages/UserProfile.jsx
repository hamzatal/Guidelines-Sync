import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Pen,
    Save,
    Camera,
    FileText,
    Phone,
    Lock,
    AlertTriangle,
    X,
    Eye,
    EyeOff,
    CheckCircle,
    Shield,
    Sparkles,
    Settings,
    ChevronRight,
    Award,
    Clock,

    Check,
    Trash2,
    Download,
    Upload as UploadIcon,
    RefreshCw,
    Key,
    UserCircle,
    Activity,
    TrendingUp,
    Calendar,
    Zap,
    Star,
    MessageSquare,
    Archive,
} from "lucide-react";
import NavBar from "../Components/Nav";
import Footer from "../Components/Footer";
import { Head, usePage, Link } from "@inertiajs/react";

import toast, { Toaster } from "react-hot-toast";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showDeactivationSuccessModal, setShowDeactivationSuccessModal] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeactivatePassword, setShowDeactivatePassword] = useState(false);
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [processingPw, setProcessingPw] = useState(false);
    const [processingDeactivate, setProcessingDeactivate] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        avatar: null,
        bio: "",
        phone: "",
    });

    const [pwData, setPwData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [deactivateData, setDeactivateData] = useState({
        password: "",
        deactivation_reason: "",
    });

    const getCsrfToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.content : "";
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/profile", {
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                });
                if (!response.ok) {
                    toast.error(`Failed to load profile: ${response.statusText}`);
                    return;
                }
                const result = await response.json();
                if (result.status === "success") {
                    setUser(result.user);
                    setData({
                        name: result.user.name || "",
                        email: result.user.email || "",
                        avatar: null,
                        bio: result.user.bio || "",
                        phone: result.user.phone || "",
                    });
                } else {
                    toast.error("Failed to load profile.");
                }
            } catch (error) {
                toast.error("Error loading profile.");
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPwData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleDeactivateChange = (e) => {
        const { name, value } = e.target;
        setDeactivateData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            if (!validTypes.includes(file.type)) {
                toast.error("Invalid file type. Please upload an image (jpeg, png, jpg, gif).");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File too large. Please upload an image smaller than 2MB.");
                return;
            }
            setData((prev) => ({ ...prev, avatar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("bio", data.bio);
        formData.append("phone", data.phone);
        if (data.avatar) {
            formData.append("avatar", data.avatar);
        }
        formData.append("_method", "POST");

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": getCsrfToken(),
                },
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                setUser(result.user);
                setData({
                    name: result.user.name,
                    email: result.user.email,
                    avatar: null,
                    bio: result.user.bio,
                    phone: result.user.phone,
                });
                setIsEditing(false);
                setPreviewImage(null);
                toast.success(result.status);
            } else {
                setErrors(result.errors || { general: "Failed to update profile." });
                toast.error("Failed to update profile. Please check the errors.");
            }
        } catch (error) {
            toast.error("Error updating profile.");
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setProcessingPw(true);
        setErrors({});

        try {
            const response = await fetch("/api/profile/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                },
                body: JSON.stringify(pwData),
            });
            const result = await response.json();
            if (response.ok) {
                setPwData({
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                });
                toast.success(result.status);
            } else {
                setErrors(result.errors || { general: "Failed to update password." });
                toast.error("Failed to update password. Please check the errors.");
            }
        } catch (error) {
            toast.error("Error updating password.");
        } finally {
            setProcessingPw(false);
        }
    };

    const handleDeactivateAccount = async (e) => {
        e.preventDefault();
        setProcessingDeactivate(true);
        setErrors({});

        try {
            const response = await fetch("/api/profile/deactivate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                },
                body: JSON.stringify(deactivateData),
            });

            const result = await response.json();

            if (response.ok) {
                setShowDeactivateModal(false);
                setShowDeactivationSuccessModal(true);
            } else {
                setErrors(result.errors || { general: "Failed to deactivate account." });
                toast.error("Failed to deactivate account. Please check the errors.");
            }
        } catch (error) {
            toast.error("Error deactivating account.");
        } finally {
            setProcessingDeactivate(false);
        }
    };

    const handleDeactivationSuccessClose = () => {
        setShowDeactivationSuccessModal(false);
        window.location.href = "/";
    };

    const displayAvatar = previewImage || (user?.avatar_url ? user.avatar_url : "/images/avatar.png");

    const tabs = [
        { 
            id: "profile", 
            label: "Personal Info", 
            icon: UserCircle,
            description: "Manage your personal information",
            gradient: "from-blue-600 to-indigo-600"
        },
        { 
            id: "security", 
            label: "Security", 
            icon: Shield,
            description: "Password and authentication",
            gradient: "from-indigo-600 to-purple-600"
        },
        { 
            id: "account", 
            label: "Account Settings", 
            icon: Settings,
            description: "Advanced account options",
            gradient: "from-purple-600 to-pink-600"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <NavBar />

            {/* Hero Header Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-500" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Your Profile Dashboard
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Welcome Back,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                {data.name || "User"}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                            Manage your account, track your progress, and customize your experience
                        </p>
                    </motion.div>

                    {/* Profile Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl" />
                        <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Avatar Section */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                                    <div className="relative">
                                        <img
                                            src={displayAvatar}
                                            alt="Profile Avatar"
                                            className="w-40 h-40 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                                        />
                                        {/* {isEditing && activeTab === "profile" && (
                                            <label className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-full">
                                                <Camera className="text-white w-10 h-10 mb-2" />
                                                <span className="text-xs font-semibold">Change Photo</span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg,image/gif"
                                                    className="hidden"
                                                    onChange={handleAvatarUpload}
                                                />
                                            </label>
                                        )} */}
                                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl md:text-4xl font-black mb-2">{data.name}</h2>
                                    <p className="text-lg text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                                        <Mail className="w-5 h-5" />
                                        {data.email}
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                            <span className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                               Doctor   
                                            </span>
                                        </div>
                                        {user && (
                                            <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                                                <span className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Since {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-col gap-3">
                                     <Link
                                        href="/upload"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
                                        <UploadIcon className="w-5 h-5" />
                                        Upload Document
                                    </Link>
                                    {/* <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                                        <Archive className="w-5 h-5" />
                                        View History
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

         
            {/* Main Content */}
            <section className="py-12 relative">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tab Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsEditing(false);
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative group overflow-hidden rounded-2xl p-6 text-left transition-all ${
                                        activeTab === tab.id
                                            ? "bg-gradient-to-br " + tab.gradient
                                            : "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50"
                                    }`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                activeTab === tab.id
                                                    ? "bg-white/20"
                                                    : "bg-gray-700/50"
                                            }`}>
                                                <tab.icon className="w-6 h-6" />
                                            </div>
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{tab.label}</h3>
                                        <p className={`text-sm ${
                                            activeTab === tab.id ? "text-white/80" : "text-gray-400"
                                        }`}>
                                            {tab.description}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl blur-2xl" />
                            <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12">
                                <AnimatePresence mode="wait">
                                    {/* Profile Tab */}
                                    {activeTab === "profile" && (
                                        <motion.div
                                            key="profile"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-10">
                                                <div>
                                                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                                            <UserCircle className="w-6 h-6" />
                                                        </div>
                                                        Personal Information
                                                    </h2>
                                                    <p className="text-gray-400">Update your personal details and profile</p>
                                                </div>
                                                {!isEditing ? (
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
                                                    >
                                                        <Pen className="w-5 h-5" />
                                                        Edit Profile
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setIsEditing(false);
                                                                setPreviewImage(null);
                                                                setData((prev) => ({ ...prev, avatar: null }));
                                                            }}
                                                            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl font-bold transition-all flex items-center gap-2"
                                                        >
                                                            <X className="w-5 h-5" />
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleSaveProfile}
                                                            disabled={processing}
                                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            <Save className="w-5 h-5" />
                                                            {processing ? "Saving..." : "Save Changes"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            {isEditing ? (
                                                <div className="space-y-6">
                                                    {/* Name Field */}
                                                    <div className="relative group">
                                                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                            <User className="w-4 h-4 text-blue-400" />
                                                            Full Name
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={data.name}
                                                                onChange={handleInputChange}
                                                                className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                                placeholder="Enter your full name"
                                                            />
                                                        </div>
                                                        {errors.name && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                {errors.name}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Email Field */}
                                                    <div className="relative group">
                                                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-indigo-400" />
                                                            Email Address
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={data.email}
                                                                onChange={handleInputChange}
                                                                className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                                placeholder="your.email@example.com"
                                                            />
                                                        </div>
                                                        {errors.email && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                {errors.email}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Phone Field */}
                                                    <div className="relative group">
                                                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-purple-400" />
                                                            Phone Number
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                value={data.phone}
                                                                onChange={handleInputChange}
                                                                className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                placeholder="+1 (555) 000-0000"
                                                            />
                                                        </div>
                                                        {errors.phone && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                {errors.phone}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Bio Field */}
                                                    <div className="relative group">
                                                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-pink-400" />
                                                            Bio
                                                        </label>
                                                        <div className="relative">
                                                            <textarea
                                                                name="bio"
                                                                value={data.bio}
                                                                onChange={handleInputChange}
                                                                rows="5"
                                                                className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                                                                placeholder="Tell us about yourself..."
                                                            />
                                                        </div>
                                                        {errors.bio && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                {errors.bio}
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                user && (
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        {/* Name Card */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="relative group"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                                                                <div className="flex items-center gap-4 mb-3">
                                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                                                        <User className="w-6 h-6 text-blue-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-400 mb-1">Full Name</p>
                                                                        <p className="text-xl font-bold">{data.name}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {/* Email Card */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            className="relative group"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-indigo-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
                                                                <div className="flex items-center gap-4 mb-3">
                                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                                                                        <Mail className="w-6 h-6 text-indigo-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-400 mb-1">Email Address</p>
                                                                        <p className="text-xl font-bold truncate">{data.email}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {/* Phone Card */}
                                                        {data.phone && (
                                                            <motion.div
                                                                whileHover={{ scale: 1.02 }}
                                                                className="relative group"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                                                                    <div className="flex items-center gap-4 mb-3">
                                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center">
                                                                            <Phone className="w-6 h-6 text-purple-400" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                                                                            <p className="text-xl font-bold">{data.phone}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                        {/* Bio Card - Full Width */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.01 }}
                                                            className={`relative group ${data.phone ? 'md:col-span-1' : 'md:col-span-2'}`}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-pink-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-pink-500/50 transition-all h-full">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-pink-500/10 border border-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                        <FileText className="w-6 h-6 text-pink-400" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-gray-400 mb-2">Bio</p>
                                                                        <p className="text-gray-300 leading-relaxed">
                                                                            {data.bio || "No bio available. Click 'Edit Profile' to add one."}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                )
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Security Tab */}
                                    {activeTab === "security" && (
                                        <motion.div
                                            key="security"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Header */}
                                            <div className="mb-10">
                                                <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                        <Shield className="w-6 h-6" />
                                                    </div>
                                                    Security Settings
                                                </h2>
                                                <p className="text-gray-400">Keep your account secure with a strong password</p>
                                            </div>

                                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                                {/* Current Password */}
                                                <div className="relative group">
                                                    <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                        <Key className="w-4 h-4 text-blue-400" />
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            name="current_password"
                                                            value={pwData.current_password}
                                                            onChange={handlePasswordChange}
                                                            className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                            placeholder="Enter current password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                    {errors.current_password && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                                        >
                                                            <AlertTriangle className="w-4 h-4" />
                                                            {errors.current_password}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* New Password */}
                                                <div className="relative group">
                                                    <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                        <Key className="w-4 h-4 text-indigo-400" />
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            name="password"
                                                            value={pwData.password}
                                                            onChange={handlePasswordChange}
                                                            className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                            placeholder="Enter new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                    {errors.password && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                                        >
                                                            <AlertTriangle className="w-4 h-4" />
                                                            {errors.password}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* Confirm Password */}
                                                <div className="relative group">
                                                    <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                        <Key className="w-4 h-4 text-purple-400" />
                                                        Confirm New Password
                                                    </label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="password_confirmation"
                                                            value={pwData.password_confirmation}
                                                            onChange={handlePasswordChange}
                                                            className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Security Tips */}
                                                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
                                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                                        <Shield className="w-5 h-5 text-blue-400" />
                                                        Password Security Tips
                                                    </h4>
                                                    <ul className="space-y-2 text-sm text-gray-300">
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                            Use at least 8 characters
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                            Include uppercase and lowercase letters
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                            Add numbers and special characters
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                            Avoid common words and phrases
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={processingPw}
                                                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    <Shield className="w-6 h-6" />
                                                    {processingPw ? (
                                                        <>
                                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                                            Updating Password...
                                                        </>
                                                    ) : (
                                                        "Update Password"
                                                    )}
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}

                                    {/* Account Tab */}
                                    {activeTab === "account" && (
                                        <motion.div
                                            key="account"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Header */}
                                            <div className="mb-10">
                                                <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                        <Settings className="w-6 h-6" />
                                                    </div>
                                                    Account Management
                                                </h2>
                                                <p className="text-gray-400">Manage your account preferences and data</p>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Account Info */}
                                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                                        <Activity className="w-5 h-5 text-purple-400" />
                                                        Account Information
                                                    </h4>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="bg-gray-900/50 rounded-xl p-4">
                                                            <p className="text-sm text-gray-400 mb-1">Account Status</p>
                                                            <p className="font-bold text-green-400 flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4" />
                                                                Active
                                                            </p>
                                                        </div>
                                                        {user && (
                                                            <div className="bg-gray-900/50 rounded-xl p-4">
                                                                <p className="text-sm text-gray-400 mb-1">Member Since</p>
                                                                <p className="font-bold flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-purple-400" />
                                                                    {new Date(user.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Danger Zone */}
                                                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <AlertTriangle className="w-6 h-6 text-red-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-bold text-red-400 mb-2">
                                                                Danger Zone
                                                            </h4>
                                                            <p className="text-gray-300 leading-relaxed">
                                                                Deactivating your account will make your profile and content inaccessible. 
                                                                You can reactivate your account at any time by logging in again.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
                                                        <h5 className="font-bold mb-3 flex items-center gap-2">
                                                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                                            What happens when you deactivate?
                                                        </h5>
                                                        <ul className="space-y-2 text-sm text-gray-300">
                                                            <li className="flex items-start gap-2">
                                                                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                                Your profile will be hidden from other users
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                                You won't be able to access your documents
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                                Your data will be preserved for 30 days
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                                You can reactivate by logging in
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <button
                                                        onClick={() => setShowDeactivateModal(true)}
                                                        className="w-full py-4 px-6 bg-transparent border-2 border-red-500 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                        Deactivate Account
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Deactivate Modal */}
            <AnimatePresence>
                {showDeactivateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeactivateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-2xl" />
                            <div className="relative bg-gray-800/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-red-400" />
                                        </div>
                                        <h3 className="text-2xl font-black">Deactivate Account</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowDeactivateModal(false)}
                                        className="w-10 h-10 bg-gray-700/50 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleDeactivateAccount} className="space-y-6">
                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-red-400" />
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showDeactivatePassword ? "text" : "password"}
                                                name="password"
                                                value={deactivateData.password}
                                                onChange={handleDeactivateChange}
                                                required
                                                className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowDeactivatePassword(!showDeactivatePassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showDeactivatePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-red-400 text-sm flex items-center gap-2"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Reason Field */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-orange-400" />
                                            Reason for Deactivation (Optional)
                                        </label>
                                        <textarea
                                            name="deactivation_reason"
                                            value={deactivateData.deactivation_reason}
                                            onChange={handleDeactivateChange}
                                            rows="4"
                                            className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Help us improve by telling us why you're leaving..."
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeactivateModal(false)}
                                            className="flex-1 py-4 px-6 bg-gray-700/50 hover:bg-gray-700 rounded-xl font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processingDeactivate}
                                            className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {processingDeactivate ? (
                                                <>
                                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-5 h-5" />
                                                    Deactivate
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showDeactivationSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-md w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-2xl" />
                            <div className="relative bg-gray-800/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>

                                <h3 className="text-3xl font-black mb-4">
                                    Account Deactivated
                                </h3>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Your account has been successfully deactivated. We're sorry to see you go! 
                                    If you need any assistance, please contact our support team:
                                </p>

                                <div className="bg-gray-900/50 rounded-2xl p-6 mb-6 space-y-4 text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Phone</p>
                                            <p className="font-bold">+1234567890</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Email</p>
                                            <p className="font-bold">Guidelines-Sync@support.com</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDeactivationSuccessClose}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default UserProfile;