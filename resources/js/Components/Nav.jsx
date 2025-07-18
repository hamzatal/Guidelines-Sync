import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Hotel,
    Plane,
    BookOpen,
    Bookmark,
    LogOut,
    User,
    Map,
    Mail,
    Menu,
    X,
    Search,
    PackageCheck,
    LayoutDashboard,
    Building2,
    UserCog,
    Paperclip,
    PaperclipIcon,
    PartyPopper,
    LucidePaperclip,
} from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from "axios";
axios.defaults.baseURL = window.location.origin;

const Nav = ({ isDarkMode = true, wishlist = [], onDropdownToggle }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const { url, props } = usePage();
    const { auth } = props;
    const searchRef = useRef(null);
    const profileRef = useRef(null);

    // Notify parent component when dropdown state changes
    useEffect(() => {
        if (onDropdownToggle) {
            onDropdownToggle(isDropdownOpen);
        }
    }, [isDropdownOpen, onDropdownToggle]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close search bar and results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                isSearchOpen
            ) {
                setIsSearchOpen(false);
                setSearchResults([]);
                setSearchQuery("");
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target) &&
                isDropdownOpen
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen, isDropdownOpen]);

    // Real-time search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const delayDebounceFn = setTimeout(() => {
            axios
                .get(`/search/live?q=${encodeURIComponent(searchQuery)}`)
                .then((response) => {
                    setSearchResults(response.data.results || []);
                })
                .catch((error) => {
                    setSearchResults([]);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle clear search
    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setIsSearchOpen(false);
    };

    // Handle result selection
    const getItemUrl = (item) => {
        switch (item.type) {
            case "destination":
                return `/destinations/${item.id}`;
            case "package":
                return `/packages/${item.id}`;
            case "offer":
                return `/offers/${item.id}`;
            default:
                return "#";
        }
    };

    const handleResultSelect = (item) => {
        router.visit(getItemUrl(item));
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchResults([]);
            setSearchQuery("");
        }
    };

    // Format price
    const formatPrice = (price, discountPrice) => {
        if (discountPrice) {
            return `$${parseFloat(discountPrice).toFixed(2)} (was $${parseFloat(
                price
            ).toFixed(2)})`;
        }
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const navItems = [
        { label: "Home", href: "/home", icon: Hotel },
        { label: "Upload Paper", href: "/UploadPaper", icon: PaperclipIcon },
        { label: "Destinations", href: "/destinations", icon: Map },
        { label: "Offers", href: "/offers", icon: Bookmark },
        { label: "About Us", href: "/about-us", icon: BookOpen },
        { label: "Contact", href: "/ContactPage", icon: Mail },
    ];

    const userDropdownItems = [
        {
            label: "My Papers",
            href: "/UserPapers",
            icon: Paperclip,
            method: "get",
        },
        { label: "Profile", href: "/UserProfile", icon: User },
        {
            label: "Logout",
            href: route("logout"),
            icon: LogOut,
            method: "post",
        },
    ];

    const companyDropdownItems = [
        {
            label: "Dashboard",
            href: route("company.dashboard"),
            icon: LayoutDashboard,
            method: "get",
        },
        {
            label: "Company Profile",
            href: route("company.profile"),
            icon: Building2,
        },
        {
            label: "Logout",
            href: route("company.logout"),
            icon: LogOut,
            method: "post",
        },
    ];

    const adminDropdownItems = [
        {
            label: "Admin Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            method: "get",
        },
        {
            label: "Logout",
            href: route("admin.logout"),
            icon: LogOut,
            method: "post",
        },
    ];

    const isActive = (href) => url === href;

    // Toggle dropdown function
    const toggleDropdown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Dropdown animation settings
    const dropdownVariants = {
        initial: { opacity: 0, y: -10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.95 },
    };

    // Profile Button Component
    const ProfileButton = () => {
        if (!auth || (!auth.user && !auth.company && !auth.admin)) {
            return null; // Don't render if no one is authenticated
        }

        // Check if auth.user contains company-specific fields
        const isCompanyUser =
            auth.user && (auth.user.company_name || auth.user.license_number);
        const effectiveUser = isCompanyUser ? null : auth.user;
        const effectiveCompany = isCompanyUser ? auth.user : auth.company;
        const effectiveAdmin = auth.admin;

        const displayAvatar = effectiveUser?.avatar_url
            ? effectiveUser.avatar_url
            : "/images/avatar.webp";

        if (effectiveAdmin) {
            // Admin-specific button
            return (
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 focus:outline-none border-2 border-green-500 hover:bg-green-600/30 transition-colors"
                    >
                        <UserCog className="w-6 h-6 text-white" />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                variants={dropdownVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    duration: 0.2,
                                }}
                                className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg bg-black/90 text-white border border-green-500/30 z-[100] overflow-hidden will-change-transform"
                            >
                                {adminDropdownItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        method={item.method || "get"}
                                        as={item.method ? "button" : "a"}
                                        className={`flex items-center px-4 py-3 text-sm w-full text-left transition-colors ${
                                            isActive(item.href)
                                                ? "bg-green-600/30"
                                                : "hover:bg-green-600/20 focus:bg-green-600/20"
                                        }`}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5 mr-2" />
                                        {item.label}
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <div className="relative" ref={profileRef}>
                <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 focus:outline-none border-2 border-green-500 hover:bg-green-600/30 transition-colors"
                >
                    {effectiveUser && effectiveUser.avatar_url ? (
                        <img
                            src={displayAvatar}
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                            {effectiveCompany ? (
                                <Building2 className="w-6 h-6 text-white" />
                            ) : (
                                <User className="w-6 h-6 text-white" />
                            )}
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            variants={dropdownVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                duration: 0.2,
                            }}
                            className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg bg-black/90 text-white border border-green-500/30 z-[100] overflow-hidden will-change-transform"
                        >
                            {(effectiveUser
                                ? userDropdownItems
                                : companyDropdownItems
                            ).map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    method={item.method || "get"}
                                    as={item.method ? "button" : "a"}
                                    className={`flex items-center px-4 py-3 text-sm w-full text-left transition-colors ${
                                        isActive(item.href)
                                            ? "bg-green-600/30"
                                            : "hover:bg-green-600/20 focus:bg-green-600/20"
                                        }`}
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-2" />
                                    {item.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Add custom CSS for scrollbar and separator
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(16, 185, 129, 0.05);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.3);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(16, 185, 129, 0.5);
            }
            .will-change-transform {
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-[100]
                px-6 md:px-10 py-4
                flex justify-between items-center
                transition-all duration-200
                ${
                    isScrolled
                        ? "bg-black/80 backdrop-blur-sm"
                        : "bg-transparent"
                }
                border-b border-green-500/20
            `}
        >
            {/* Logo */}
            <div className="flex items-center">
                <img
                    src="/images/icon.png"
                    alt="Guidelines Sync Logo"
                    className="w-10 h-10 mr-3"
                />
                <h1 className="text-3xl font-bold text-white">
                    Guidelines <span className="text-green-500">Sync</span>
                </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center ml-4">
                <div className="flex items-center space-x-2">
                    {navItems.map((item, index) => (
                        <React.Fragment key={item.label}>
                            <Link
                                href={item.href}
                                className={`
                                    flex items-center space-x-2
                                    px-3 py-2
                                    rounded-full
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-200
                                    ${
                                        isActive(item.href)
                                            ? "bg-green-600 text-white"
                                            : "text-gray-300 hover:bg-green-600/20 hover:text-white"
                                    }
                                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                            {index < navItems.length - 1 && (
                                <div className="h-6 w-px bg-green-500/30" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </nav>

            {/* Right Section with Search, Profile/Sign In, and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
                {/* Desktop Search */}
                <div className="hidden md:block relative" ref={searchRef}>
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 focus:outline-none border border-green-500/30 hover:bg-green-600/30 transition-colors"
                    >
                        <Search className="w-5 h-5 text-white" />
                    </button>

                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    duration: 0.2,
                                }}
                                className="absolute top-full mt-2 right-0 w-96 bg-black/90 rounded-xl shadow-lg border border-green-500/30 z-[100] overflow-hidden will-change-transform"
                            >
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-400" />
                                        </div>
                                        <motion.input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Search deals, destinations..."
                                            className="w-full pl-12 pr-12 py-3 bg-green-600/10 border-b border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-t-xl"
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-green-400"
                                                type="button"
                                                onClick={handleClearSearch}
                                            >
                                                <X className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </div>
                                </form>

                                {/* Search Results Dropdown */}
                                <AnimatePresence>
                                    {searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: searchQuery
                                                    ? "auto"
                                                    : 0,
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{
                                                type: "tween",
                                                duration: 0.2,
                                            }}
                                            className="w-full bg-green-600/10 custom-scrollbar"
                                            style={{
                                                maxHeight: "18rem",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {isSearching ? (
                                                <div className="px-4 py-3 text-center border-t border-green-500/20">
                                                    <div className="animate-pulse text-sm text-gray-400">
                                                        Searching...
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {searchResults.length ===
                                                    0 ? (
                                                        <div className="px-4 py-3 text-center border-t border-green-500/20">
                                                            <p className="text-sm font-medium text-gray-400">
                                                                No results found
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="divide-y divide-green-500/20">
                                                            {searchResults.map(
                                                                (item) => (
                                                                    <motion.div
                                                                        key={`${item.type}-${item.id}`}
                                                                        whileHover={{
                                                                            backgroundColor:
                                                                                "rgba(16, 185, 129, 0.2)",
                                                                        }}
                                                                        whileTap={{
                                                                            scale: 0.98,
                                                                        }}
                                                                        onClick={() =>
                                                                            handleResultSelect(
                                                                                item
                                                                            )
                                                                        }
                                                                        className="px-4 py-3 cursor-pointer flex items-center space-x-4 transition-colors duration-200"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                item.image ||
                                                                                "https://via.placeholder.com/56x84"
                                                                            }
                                                                            alt={
                                                                                item.title
                                                                            }
                                                                            className="w-14 h-20 object-cover rounded-lg border border-green-500/30"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <h3 className="text-base font-semibold text-white truncate">
                                                                                {
                                                                                    item.title
                                                                                }
                                                                                <span className="text-xs text-gray-400 ml-1">
                                                                                    (
                                                                                    {item.type
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase() +
                                                                                        item.type.slice(
                                                                                            1
                                                                                        )}

                                                                                    )
                                                                                </span>
                                                                            </h3>
                                                                            <p className="text-sm text-gray-400 truncate">
                                                                                {formatPrice(
                                                                                    item.price,
                                                                                    item.discount_price
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </motion.div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sign In / Sign Up or Profile/Admin Button */}
                {auth && (auth.user || auth.company || auth.admin) ? (
                    <ProfileButton />
                ) : (
                    <Link
                        href="/login"
                        className="hidden md:flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors"
                    >
                        Sign In / Sign Up
                    </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-green-500/30 py-4 z-[100]">
                    {/* Mobile Search */}
                    <div className="px-6 mb-4 relative" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative overflow-hidden rounded-xl">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-400" />
                                </div>
                                <motion.input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search deals, destinations..."
                                    className="w-full pl-12 pr-12 py-3 bg-green-600/10 border-b border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-t-xl"
                                />
                                {searchQuery && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-green-400"
                                        type="button"
                                        onClick={handleClearSearch}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </div>

                            {/* Mobile Search Results */}
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: searchQuery ? "auto" : 0,
                                        }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                            type: "tween",
                                            duration: 0.2,
                                        }}
                                        className="w-full bg-green-600/10 custom-scrollbar"
                                        style={{
                                            maxHeight: "18rem",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {isSearching ? (
                                            <div className="px-4 py-3 text-center border-t border-green-500/20">
                                                <div className="animate-pulse text-sm text-gray-400">
                                                    Searching...
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {searchResults.length === 0 ? (
                                                    <div className="px-4 py-3 text-center border-t border-green-500/20">
                                                        <p className="text-sm font-medium text-gray-400">
                                                            No results found
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-green-500/20">
                                                        {searchResults.map(
                                                            (item) => (
                                                                <motion.div
                                                                    key={`${item.type}-${item.id}`}
                                                                    whileHover={{
                                                                        backgroundColor:
                                                                            "rgba(16, 185, 129, 0.2)",
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.98,
                                                                    }}
                                                                    onClick={() =>
                                                                        handleResultSelect(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="px-4 py-3 cursor-pointer flex items-center space-x-4 transition-colors duration-200"
                                                                >
                                                                    <img
                                                                        src={
                                                                            item.image ||
                                                                            "https://via.placeholder.com/56x84"
                                                                        }
                                                                        alt={
                                                                            item.title
                                                                        }
                                                                        className="w-14 h-20 object-cover rounded-lg border border-green-500/30"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h3 className="text-base font-semibold text-white truncate">
                                                                            {
                                                                                item.title
                                                                            }
                                                                            <span className="text-xs text-gray-400 ml-1">
                                                                                (
                                                                                {item.type
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                    item.type.slice(
                                                                                        1
                                                                                    )}

                                                                                )
                                                                            </span>
                                                                        </h3>
                                                                        <p className="text-sm text-gray-400 truncate">
                                                                            {formatPrice(
                                                                                item.price,
                                                                                item.discount_price
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </motion.div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Mobile Nav Items */}
                    <div className="space-y-2 px-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`
                                    flex items-center
                                    px-4 py-3
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    w-full
                                    transition-colors duration-200
                                    ${
                                        isActive(item.href)
                                            ? "bg-green-600 text-white"
                                            : "text-gray-300 hover:bg-green-600/20 hover:text-white"
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-2" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        {auth?.company && (
                            <Link
                                href={route("company.dashboard")}
                                className={`
                                    flex items-center
                                    px-4 py-3
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    w-full
                                    transition-colors duration-200
                                    ${
                                        isActive(route("company.dashboard"))
                                            ? "bg-green-600 text-white"
                                            : "text-gray-300 hover:bg-green-600/20 hover:text-white"
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <LayoutDashboard className="w-5 h-5 mr-2" />
                                <span>Company Dashboard</span>
                            </Link>
                        )}
                        {auth?.admin && (
                            <Link
                                href="/admin/dashboard"
                                className={`
                                    flex items-center
                                    px-4 py-3
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    w-full
                                    transition-colors duration-200
                                    ${
                                        isActive("/admin/dashboard")
                                            ? "bg-green-600 text-white"
                                            : "text-gray-300 hover:bg-green-600/20 hover:text-white"
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <UserCog className="w-5 h-5 mr-2" />
                                <span>Admin Dashboard</span>
                            </Link>
                        )}
                    </div>

                    {/* Sign In / Sign Up on Mobile */}
                    {(!auth || (!auth.user && !auth.company && !auth.admin)) && (
                        <div className="px-6 mt-4">
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In / Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Nav;
