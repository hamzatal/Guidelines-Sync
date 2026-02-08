import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import {
    Menu,
    X,
    Search,
    FileText,
    BookOpen,
    Mail,
    Shield,
    User,
    LogOut,
    LayoutDashboard,
    Building2,
    Home,
    Download,
    ArrowRight,
    LogIn,
    LogInIcon,
     
} from "lucide-react";

axios.defaults.baseURL = window.location.origin;

const cn = (...classes) => classes.filter(Boolean).join(" ");

const NavV2 = ({ isDarkMode = true, wishlist = [] }) => {
    const { url, props } = usePage();
    const { auth } = props;

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState([]);

    const profileRef = useRef(null);
    const searchPanelRef = useRef(null);

    const isActive = useCallback(
        (href) => (href === "/" ? url === "/" : url?.startsWith(href)),
        [url]
    );

    const navItems = useMemo(
        () => [
            { label: "Home", href: "/home", icon: Home, color: "text-blue-400" },
            {
                label: "Upload Research",
                href: "/upload",
                icon: FileText,
                color: "text-indigo-400",
            },
            {
                label: "About Us",
                href: "/about-us",
                icon: BookOpen,
                color: "text-emerald-400",
            },
            {
                label: "Contact",
                href: "/ContactPage",
                icon: Mail,
                color: "text-cyan-400",
            },
            {
                label: "Terms",
                href: "/terms",
                icon: Shield,
                color: "text-purple-400",
            },
        ],
        []
    );

    const userDropdownItems = useMemo(
        () => [
            {
                label: "Profile",
                href: "/UserProfile",
                icon: User,
                method: "get",
            },
            {
                label: "Logout",
                href: route("logout"),
                icon: LogOut,
                method: "post",
            },
        ],
        []
    );

    const companyDropdownItems = useMemo(
        () => [
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
                method: "get",
            },
            {
                label: "Logout",
                href: route("company.logout"),
                icon: LogOut,
                method: "post",
            },
        ],
        []
    );

    const isCompanyUser =
        auth?.user && (auth.user.company_name || auth.user.license_number);
    const effectiveUser = isCompanyUser ? null : auth?.user;
    const effectiveCompany = isCompanyUser ? auth?.user : auth?.company;
    const isAuthenticated = auth?.user || auth?.company;

    let avatarUrl = "/images/avatar.png";
    if (effectiveUser?.avatar_url) {
        avatarUrl = `${effectiveUser.avatar_url}?t=${Date.now()}`;
    }

    const closeAllOverlays = useCallback(() => {
        setMobileOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
    }, []);

    // Scroll effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close overlays on route change
    useEffect(() => {
        closeAllOverlays();
    }, [url, closeAllOverlays]);

    // Click outside
    useEffect(() => {
        const onDown = (e) => {
            if (
                profileOpen &&
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {
                setProfileOpen(false);
            }
            if (
                searchOpen &&
                searchPanelRef.current &&
                !searchPanelRef.current.contains(e.target)
            ) {
                setSearchOpen(false);
                setQuery("");
                setResults([]);
            }
        };

        const onKey = (e) => {
            if (e.key === "Escape") {
                setMobileOpen(false);
                setProfileOpen(false);
                setSearchOpen(false);
                setQuery("");
                setResults([]);
            }
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [profileOpen, searchOpen]);

    // Live search (debounced + abort)
    useEffect(() => {
        const q = query.trim();
        if (!q) {
            setResults([]);
            setSearching(false);
            return;
        }

        const controller = new AbortController();
        setSearching(true);

        const t = setTimeout(async () => {
            try {
                const res = await axios.get("/search/live", {
                    params: { q },
                    signal: controller.signal,
                });
                setResults(res.data?.results || []);
            } catch (err) {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 250);

        return () => {
            clearTimeout(t);
            controller.abort();
        };
    }, [query]);

    const getItemUrl = (item) => {
        switch (item.type) {
            case "research":
                return `/research/${item.id}`;
            case "guideline":
                return `/guidelines/${item.id}`;
            default:
                return "#";
        }
    };

    const onSelectResult = (item) => {
        const href = getItemUrl(item);
        if (href && href !== "#") router.visit(href);
        setSearchOpen(false);
        setQuery("");
        setResults([]);
    };

    const formatPrice = (price, discountPrice) => {
        const p = Number(price || 0);
        const d = discountPrice ? Number(discountPrice) : null;
        if (d && !Number.isNaN(d))
            return `$${d.toFixed(2)} (was $${p.toFixed(2)})`;
        if (!Number.isNaN(p)) return `$${p.toFixed(2)}`;
        return "";
    };

    const NavLinkPill = ({ item, onClick }) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
            <Link
                href={item.href}
                onClick={onClick}
                className={cn(
                    "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                        ? "bg-blue-500/15 text-white ring-1 ring-blue-400/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                )}
            >
                <Icon
                    className={cn(
                        "h-5 w-5 transition",
                        item.color,
                        active && "drop-shadow"
                    )}
                />
                <span className="whitespace-nowrap">{item.label}</span>
                {active && (
                    <span className="absolute inset-x-3 -bottom-[9px] h-[2px] rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/70 to-blue-400/0" />
                )}
            </Link>
        );
    };

    const AuthButton = () => {
        if (isAuthenticated) {
            return <ProfileButton />;
        }

        return (
            <Link
                href="/login"
                className={cn(
                    "hidden md:flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                )}
            >
                <LogInIcon className="h-4 w-4" />
                Login / Register
            </Link>
        );
    };

    const ProfileButton = () => {
        return (
            <div className="relative" ref={profileRef}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setProfileOpen((v) => !v);
                    }}
                    className={cn(
                        "h-10 w-10 overflow-hidden rounded-full border transition-all",
                        "border-blue-400/30 bg-blue-500/10 hover:bg-blue-500/20 hover:scale-105",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg"
                    )}
                    aria-label="Profile menu"
                >
                    {effectiveUser ? (
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="h-full w-full object-cover rounded-full"
                            key={avatarUrl}
                        />
                    ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {profileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className={cn(
                                "absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border",
                                "border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl"
                            )}
                        >
                            <div className="px-4 py-3 border-b border-white/10">
                                <div className="text-sm font-semibold text-white">
                                    {effectiveUser
                                        ? effectiveUser.name || "User"
                                        : effectiveCompany?.company_name || "Company"}
                                </div>
                                <div className="text-xs text-blue-300 truncate">
                                    {effectiveUser?.email ||
                                        effectiveCompany?.email || ""}
                                </div>
                            </div>

                            {(effectiveUser
                                ? userDropdownItems
                                : companyDropdownItems
                            ).map((it) => {
                                const Icon = it.icon;
                                return (
                                    <Link
                                        key={it.label}
                                        href={it.href}
                                        method={it.method || "get"}
                                        as={it.method ? "button" : "a"}
                                        className={cn(
                                            "w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition-all",
                                            "text-white/90 hover:text-white hover:bg-blue-500/10 hover:pl-6 border-l-4 border-transparent hover:border-blue-400"
                                        )}
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <Icon className="h-4 w-4 text-blue-300 flex-shrink-0" />
                                        <span className="font-medium">{it.label}</span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50",
                "h-20",
                "border-b border-blue-400/10",
                scrolled ? "bg-black/70 backdrop-blur-xl" : "bg-transparent"
            )}
        >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
                {/* Logo */}
                <Link href="/home" className="flex items-center gap-3">
                    <img
                        src="/images/logo.png"
                        alt="Guidelines Sync Logo"
                        className="h-14 w-auto object-contain"
                    />
                </Link>

                {/* Center Nav (Desktop) */}
                <nav className="hidden lg:flex items-center">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur">
                        {navItems.map((item) => (
                            <NavLinkPill key={item.href} item={item} />
                        ))}
                    </div>
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    {/* Search button */}
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className={cn(
                            "h-10 w-10 rounded-full border transition-all",
                            "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-105",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-md"
                        )}
                        aria-label="Search"
                    >
                        <Search className="mx-auto h-5 w-5 text-blue-300" />
                    </button>

                    {/* Auth Button / Upload (Desktop) */}
                    <AuthButton />

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className={cn(
                            "lg:hidden h-10 w-10 rounded-full border transition-all",
                            "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-105",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-md"
                        )}
                        aria-label="Open menu"
                    >
                        <Menu className="mx-auto h-5 w-5 text-white/80" />
                    </button>
                </div>
            </div>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm"
                    >
                        <motion.div
                            ref={searchPanelRef}
                            initial={{ opacity: 0, y: -16, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -16, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className={cn(
                                "mx-auto mt-20 w-[92%] max-w-2xl overflow-hidden rounded-2xl border shadow-2xl",
                                "border-white/10 bg-black/90 backdrop-blur-xl"
                            )}
                        >
                            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
                                <Search className="h-6 w-6 text-blue-300 flex-shrink-0" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search research guidelines, academic standards, documents..."
                                    className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none text-lg font-medium"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setQuery("");
                                        setResults([]);
                                    }}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-all flex-shrink-0"
                                    aria-label="Close search"
                                >
                                    <X className="h-6 w-6 text-white/70" />
                                </button>
                            </div>

                            <div className="max-h-[22rem] overflow-y-auto">
                                {query.trim() ? (
                                    searching ? (
                                        <div className="px-6 py-8 text-center text-white/60">
                                            <div className="inline-block w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mb-4"></div>
                                            Searching academic resources...
                                        </div>
                                    ) : results.length ? (
                                        <div className="divide-y divide-white/10">
                                            {results.map((item) => (
                                                <button
                                                    key={`${item.type}-${item.id}`}
                                                    onClick={() =>
                                                        onSelectResult(item)
                                                    }
                                                    className="w-full text-left flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-all border-l-4 border-transparent hover:border-blue-400 first:rounded-t-xl last:rounded-b-xl"
                                                >
                                                    <img
                                                        src={
                                                            item.image ||
                                                            "https://via.placeholder.com/72x96/1e3a8a/94a3b8?text=Doc"
                                                        }
                                                        alt={item.title}
                                                        className="h-20 w-16 rounded-xl object-cover border border-white/10 shadow-md flex-shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="truncate text-lg font-semibold text-white">
                                                                {item.title}
                                                            </div>
                                                            <span className="px-3 py-1 bg-blue-500/10 text-xs font-bold text-blue-300 rounded-full">
                                                                {String(
                                                                    item.type || ""
                                                                ).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="truncate text-sm text-blue-300">
                                                            {formatPrice(
                                                                item.price,
                                                                item.discount_price
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-6 py-12 text-center text-white/60">
                                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-40" />
                                            <p className="text-lg">No academic resources found</p>
                                            <p className="text-sm mt-1">Try different keywords</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="px-6 py-12 text-center text-white/50">
                                        <Search className="w-20 h-20 mx-auto mb-6 opacity-40" />
                                        <p className="text-xl font-medium mb-2">Search Academic Resources</p>
                                        <p className="text-lg">Research guidelines, standards, documents...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.25 }}
                            className={cn(
                                "ml-auto h-full w-[90%] max-w-sm border-l border-white/10",
                                "bg-black/90 backdrop-blur-xl shadow-2xl"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                                <div className="text-xl font-bold text-white">
                                    Menu
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-all"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6 text-white/80" />
                                </button>
                            </div>

                            <div className="px-6 py-6 space-y-3">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 rounded-2xl px-5 py-4 transition-all shadow-lg",
                                                active
                                                    ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 ring-2 ring-blue-400/30 text-white shadow-blue-500/20"
                                                    : "bg-white/5 hover:bg-white/10 text-white/90 hover:text-white hover:shadow-xl"
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "h-6 w-6 flex-shrink-0",
                                                    item.color
                                                )}
                                            />
                                            <span className="text-base font-semibold">
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}

                                {auth?.company && (
                                    <Link
                                        href={route("company.dashboard")}
                                        onClick={() => setMobileOpen(false)}
                                        className="mt-4 flex items-center gap-4 rounded-2xl px-5 py-4 bg-white/5 hover:bg-white/10 transition-all shadow-lg"
                                    >
                                        <LayoutDashboard className="h-6 w-6 text-blue-300" />
                                        <span className="text-base font-semibold text-white/90">
                                            Dashboard
                                        </span>
                                    </Link>
                                )}

                                <div className="pt-6 mt-6 border-t border-white/10">
                                    {isAuthenticated ? (
                                        <Link
                                            href="/upload"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-all shadow-xl"
                                        >
                                            <Download className="h-5 w-5" />
                                            Upload Document
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-all shadow-xl"
                                        >
                                            <Login className="h-5 w-5" />
                                            Login / Register
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavV2;
