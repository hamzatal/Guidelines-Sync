import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@inertiajs/react";

const LegalPopup = ({ type, onClose }) => {
    const content = {
        privacyPolicy: {
            title: "Privacy Policy",
            text: `
        At Guidelines Sync, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your information.

        **1. Information We Collect**
        • Personal Information: Name, email address, institutional affiliation, etc.
        • Usage Data: Information about how you use our platform, including IP address, browser type, pages visited, and uploaded research files.

        **2. How We Use Your Information**
        • To provide and maintain our research formatting services
        • To notify you about updates to our platform or your submission status
        • To allow you to access journal formatting guidelines and features
        • To provide customer support for your academic needs
        • To analyze usage patterns to improve our platform
        • To monitor platform usage and ensure security
        • To detect, prevent, and address technical issues

        **3. Data Security**
        We take the security of your data seriously. We implement robust technical and organizational measures to protect your personal information and uploaded research files from unauthorized access, use, or disclosure.

        **4. Your Rights**
        You have the right to:
        • Access your personal information
        • Request correction of your personal information
        • Request deletion of your personal information
        • Object to the processing of your personal information
        • Withdraw consent at any time where we rely on your consent to process your personal information

        **5. Changes to This Privacy Policy**
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        We will inform you via email and/or a prominent notice on our platform, prior to the change becoming effective, and update the "effective date" at the top of this Privacy Policy.
        You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.

        **6. Contact Us**
        If you have any questions about this Privacy Policy, please contact us:
        • By email: support@guidelinessync.com
        • By phone: +1 (123) 456-7890
      `,
        },
        termsOfService: {
            title: "Terms of Service",
            text: `
        Welcome to Guidelines Sync. By using our platform, you agree to the following terms and conditions:

        **1. Acceptance of Terms**
        By accessing or using our platform, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our platform.

        **2. Intellectual Property**
        All content, including text, graphics, logos, and formatting tools, is the property of Guidelines Sync or its licensors and is protected by intellectual property laws. You retain ownership of your uploaded research papers, but grant Guidelines Sync a limited license to process and format them for journal submission.

        **3. User Conduct**
        You agree to use our platform for lawful purposes and in compliance with academic integrity standards. You shall not upload content that is plagiarized, unlawful, or violates the rights of others.

        **4. Privacy Policy**
        We collect and use your information in accordance with our Privacy Policy.

        **5. Limitation of Liability**
        Guidelines Sync shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use our platform, including errors in formatting or journal submission outcomes.

        **6. Indemnification**
        You agree to indemnify and hold harmless Guidelines Sync and its affiliates, licensors, and suppliers from any claims, damages, or liabilities arising from your use of our platform.

        **7. Governing Law**
        These terms and conditions shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].

        **8. Changes to Terms**
        We may update these terms and conditions from time to time. We will notify you of any changes by posting the new terms on this page.
        You are advised to review these terms periodically for any changes. Changes are effective when posted on this page.

        **9. Contact Us**
        If you have any questions about these terms and conditions, please contact us:
        • By email: support@guidelinessync.com
        • By phone: +1 (123) 456-7890
      `,
        },
    };

    const { title, text } = content[type];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="relative w-full max-w-3xl mx-auto rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-green-50 border border-green-500/20"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 border-b border-green-200">
                        <h2 className="text-2xl font-semibold text-green-600">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full transition-all duration-300 hover:bg-green-500/20 text-gray-900"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-green-100 scrollbar-thumb-gray-400">
                        <div className="text-base text-gray-700 leading-relaxed">
                            <pre className="whitespace-pre-wrap font-sans">
                                {text.split("\n").map((line, index) => (
                                    <span
                                        key={index}
                                        className={
                                            line.trim().startsWith("**")
                                                ? "font-semibold text-gray-900"
                                                : ""
                                        }
                                    >
                                        {line.replace(/\*\*/g, "")}
                                        <br />
                                    </span>
                                ))}
                            </pre>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const Footer = () => {
    const [activePopup, setActivePopup] = useState(null);

    return (
        <>
            <footer className="bg-black/80 backdrop-blur-lg border-t border-green-500/20 py-6">
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* About */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">
                                Guidelines Sync
                            </h3>
                            <p className="text-gray-300 mb-4">
                                Streamlining academic publishing with automated
                                formatting for journals worldwide.
                            </p>
                            <div className="flex items-center space-x-2">
                                <img
                                    src="/images/icon.png"
                                    alt="Guidelines Sync Logo"
                                    className="w-8 h-8"
                                />
                                <span className="text-green-500 font-semibold">
                                    Guidelines Sync
                                </span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    { label: "Home", href: "/home" },
                                    { label: "Journals", href: "/journals" },
                                    { label: "Upload Paper", href: "/upload" },
                                    { label: "Contact", href: "/ContactPage" },
                                    { label: "About Us", href: "/about-us" },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-green-500 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">
                                Contact Us
                            </h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>Email: support@guidelinessync.com</li>
                                <li>Phone: +1 (123) 456-7890</li>
                                <li>
                                    Address: 123 Research Lane, Academic City
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-400">
                        <p className="text-sm mb-4">
                            © {new Date().getFullYear()} Guidelines Sync. All
                            rights reserved.
                        </p>
                        <div className="space-x-6">
                            <button
                                onClick={() => setActivePopup("privacyPolicy")}
                                className="text-gray-300 text-sm hover:bg-green-500/20 hover:text-green-500 rounded-full px-3 py-1 transition-all duration-300"
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => setActivePopup("termsOfService")}
                                className="text-gray-300 text-sm hover:bg-green-500/20 hover:text-green-500 rounded-full px-3 py-1 transition-all duration-300"
                            >
                                Terms of Service
                            </button>
                            <Link
                                href="/ContactPage"
                                className="text-gray-300 text-sm hover:bg-green-500/20 hover:text-green-500 rounded-full px-3 py-1 transition-all duration-300"
                            >
                                Contact
                            </Link>
                            <Link
                                href="/about-us"
                                className="text-gray-300 text-sm hover:bg-green-500/20 hover:text-green-500 rounded-full px-3 py-1 transition-all duration-300"
                            >
                                About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {activePopup && (
                <LegalPopup
                    type={activePopup}
                    onClose={() => setActivePopup(null)}
                />
            )}
        </>
    );
};

export default Footer;
