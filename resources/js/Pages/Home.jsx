import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Shield,
    Tag,
    Award,
    ArrowLeft,
    Users,
    Search,
} from "lucide-react";
import { usePage, Link } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";

const HomePage = ({ auth }) => {
    const { props } = usePage();
    const { heroSections = [], flash = {}, translations = {} } = props;
    const user = auth?.user || null;
    const successMessage = flash?.success || null;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) {
            return savedMode === "true";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [currentSlide, setCurrentSlide] = useState(0);

    // Show flash messages as toasts
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Scroll to search section
    const scrollToSearch = useCallback(() => {
        searchRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Auto advance slider for hero sections
    useEffect(() => {
        if (heroSections.length > 1 && !isDropdownOpen) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSections.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [heroSections, isDropdownOpen]);

    // Handle dropdown toggle
    const handleDropdownToggle = useCallback((isOpen) => {
        setIsDropdownOpen(isOpen);
    }, []);

    return (
        <div
            className={`min-h-screen ${
                isDarkMode
                    ? "dark bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900"
            } transition-all duration-300`}
            data-dark-mode={isDarkMode}
        >
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar
                user={user}
                isDarkMode={isDarkMode}
                onDropdownToggle={handleDropdownToggle}
            />

            {/* Hero Carousel Section */}
            <section className="relative h-screen w-full overflow-hidden">
                {heroSections.length === 0 ? (
                    <div
                        className={`absolute inset-0 flex items-center justify-center ${
                            isDarkMode
                                ? "bg-gradient-to-r from-gray-900 to-gray-800"
                                : "bg-gradient-to-r from-gray-200 to-gray-300"
                        } text-center p-6`}
                    >
                        <p
                            className={`text-xl ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                            No hero sections available.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gray-900">
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: isDropdownOpen ? 0 : 0.8,
                                        ease: [0.4, 0, 0.2, 1],
                                    }}
                                    className="absolute inset-0 will-change-opacity"
                                >
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60"></div>
                                        <img
                                            src={
                                                heroSections[currentSlide]
                                                    ?.image ||
                                                "/images/placeholder-hero.jpg"
                                            }
                                            alt={
                                                heroSections[currentSlide]
                                                    ?.title || "Hero Image"
                                            }
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/images/placeholder-hero.jpg")
                                            }
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pt-44">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: isDropdownOpen ? 0 : 0.3,
                                    duration: isDropdownOpen ? 0 : 0.8,
                                }}
                                className="max-w-5xl mx-auto text-center px-6"
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-xl">
                                    {heroSections[currentSlide]?.title ||
                                        "Welcome to Guidelines Sync"}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto font-light drop-shadow-md">
                                    {heroSections[currentSlide]?.subtitle ||
                                        "Plan your next adventure with us."}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                    <Link
                                        href="/UploadPaper"
                                        className="px-8 py-4 bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-lg min-w-48 text-center hover:scale-105 transform"
                                        aria-label="Start "
                                    >
                                        {heroSections[currentSlide]?.cta_text ||
                                            "Upload Paper"}
                                    </Link>
                                    <button
                                        onClick={scrollToSearch}
                                        className="flex items-center gap-2 px-8 py-4 border-2 border-white/80 rounded-full hover:bg-white/10 transition-all duration-300 font-medium text-white hover:scale-105 transform"
                                        aria-label="Search for destinations"
                                    >
                                        <Search size={20} />
                                        Find
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 z-20">
                            <button
                                onClick={() =>
                                    setCurrentSlide((prev) =>
                                        prev === 0
                                            ? heroSections.length - 1
                                            : prev - 1
                                    )
                                }
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 shadow-md hover:scale-110 transform"
                                aria-label="Previous slide"
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
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 shadow-md hover:scale-110 transform"
                                aria-label="Next slide"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>

                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20">
                            {heroSections.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        currentSlide === index
                                            ? "w-8 bg-white"
                                            : "w-3 bg-white/50"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Benefits Section */}
            <section
                className={`py-20 ${
                    isDarkMode
                        ? "bg-gray-900"
                        : "bg-gradient-to-b from-white to-gray-50"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: isDropdownOpen ? 0 : 0.6,
                        }}
                    >
                        <h2
                            className={`text-3xl font-bold mb-12 text-center ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            {translations.benefits_section_title ||
                                "Why Choose Guidelines Sync"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {(
                                translations.benefits || [
                                    {
                                        title: "Best Price Guarantee",
                                        description:
                                            "We guarantee the best prices compared to anywhere else.",
                                    },
                                    {
                                        title: "Secure Booking",
                                        description:
                                            "Your personal information and payments are always protected.",
                                    },
                                    {
                                        title: "High-Quality Service",
                                        description:
                                            "Our support team is available 24/7 to assist you.",
                                    },
                                    {
                                        title: "Loyalty Rewards",
                                        description:
                                            "Earn points with every booking and enjoy exclusive benefits.",
                                    },
                                ]
                            ).map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={
                                        !isDropdownOpen ? { y: -5 } : {}
                                    }
                                    className={`p-6 rounded-xl ${
                                        isDarkMode
                                            ? "bg-gray-800 hover:bg-gray-700"
                                            : "bg-white hover:bg-gray-50"
                                    } shadow-md hover:shadow-lg transition-all duration-300 will-change-transform`}
                                >
                                    <div
                                        className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${
                                            isDarkMode
                                                ? "bg-blue-900 text-blue-400"
                                                : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        {index === 0 && <Tag size={24} />}
                                        {index === 1 && <Shield size={24} />}
                                        {index === 2 && <Award size={24} />}
                                        {index === 3 && <Users size={24} />}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p
                                        className={
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }
                                    >
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer isDarkMode={isDarkMode} />

            {/* Flash Message */}
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{
                        duration: isDropdownOpen ? 0 : 0.3,
                    }}
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-md ${
                        isDarkMode
                            ? "bg-green-800 text-white"
                            : "bg-green-600 text-white"
                    } z-50`}
                    role="alert"
                >
                    {successMessage}
                </motion.div>
            )}
        </div>
    );
};

export default HomePage;
