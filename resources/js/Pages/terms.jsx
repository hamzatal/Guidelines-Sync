import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import {
    Shield,
    FileText,
    Lock,
    UserCheck,
    Clock,
    Download,
    AlertTriangle,
} from "lucide-react";

const Terms = ({ auth }) => {
    const sections = [
        {
            id: "terms",
            title: "Terms of Service",
            icon: FileText,
            color: "text-blue-400",
            content: [
                {
                    subtitle: "1. Acceptance of Terms",
                    text: "By accessing and using Guidelines Sync, you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you do not agree, please do not use our services."
                },
                {
                    subtitle: "2. Description of Service",
                    text: "Guidelines Sync provides AI-powered academic research correction, formatting, and enhancement services for students, researchers, and academic institutions. Our platform processes uploaded documents using advanced AI algorithms trained on millions of peer-reviewed publications."
                },
                {
                    subtitle: "3. User Eligibility",
                    text: "You must be at least 18 years old or have parental consent to use our services. Academic institutions must have proper authorization to represent their organization."
                },
                {
                    subtitle: "4. Account Registration",
                    text: "You may need to create an account to access certain features. You agree to provide accurate information and keep your account credentials secure. You are responsible for all activities under your account."
                },
                {
                    subtitle: "5. Document Upload & Processing",
                    text: "You retain ownership of uploaded content. Guidelines Sync processes documents for formatting, structure, and academic quality improvement. Original and corrected versions are provided for comparison."
                },
                {
                    subtitle: "6. Prohibited Use",
                    text: "You agree not to: upload plagiarized content, copyrighted material without permission, malicious files, or content violating academic integrity policies."
                },
                {
                    subtitle: "7. Payment Terms",
                    text: "Paid plans are processed through secure payment gateways. All payments are final except as required by law. University institutional pricing available upon request."
                },
                {
                    subtitle: "8. Termination",
                    text: "We reserve the right to suspend or terminate accounts for violation of these terms. You may terminate your account at any time through your profile settings."
                },
            ]
        },
        {
            id: "privacy",
            title: "Privacy Policy",
            icon: Lock,
            color: "text-indigo-400",
            content: [
                {
                    subtitle: "1. Information We Collect",
                    text: "We collect account information, uploaded documents, IP addresses, and usage data to provide and improve our services."
                },
                {
                    subtitle: "2. How We Use Your Data",
                    text: "Your data is used to process research documents, improve AI algorithms, provide customer support, and comply with legal requirements. Documents are automatically deleted after 30 days."
                },
                {
                    subtitle: "3. Data Security",
                    text: "We use industry-standard encryption (AES-256) and GDPR-compliant security measures. Uploaded files are processed in isolated environments and never stored permanently."
                },
                {
                    subtitle: "4. Third Party Sharing",
                    text: "We do not sell your data. Limited sharing occurs with payment processors and academic integrity verification services."
                },
                {
                    subtitle: "5. Your Rights",
                    text: "You have the right to access, correct, delete your data, and withdraw consent. Contact privacy@guidelinessync.com for data requests."
                },
            ]
        },
        {
            id: "accuracy",
            title: "AI Accuracy Guarantee",
            icon: Shield,
            color: "text-emerald-400",
            content: [
                {
                    subtitle: "98% Accuracy Rate",
                    text: "Our AI achieves 98% accuracy across APA, MLA, Chicago, IEEE formatting standards, validated by 25 partner universities."
                },
                {
                    subtitle: "Human Review Option",
                    text: "All corrections include side-by-side comparison. Users can manually edit and override AI suggestions."
                },
                {
                    subtitle: "Academic Standards Compliance",
                    text: "Trained on 1M+ peer-reviewed publications from JSTOR, PubMed, IEEE Xplore, and university repositories."
                },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            <Head title="Terms of Service & Privacy Policy | Guidelines Sync" />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full"
                    >
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400">Legal</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
                    >
                        Terms of Service &{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                            Privacy Policy
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                    >
                        Last updated: February 1, 2026
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6">
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="mb-20 last:mb-0"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br from-${section.color.replace('text-', '')} to-blue-900/50 border border-${section.color.replace('text-', '')}/30`}>
                                    <section.icon className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold">{section.title}</h2>
                            </div>
                            <div className="space-y-8">
                                {section.content.map((item, idx) => (
                                    <div key={idx} className="group">
                                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3 group-hover:text-blue-400 transition-colors">
                                            {item.subtitle}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-lg">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-blue-950/30">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-blue-900/50"
                    >
                        <AlertTriangle className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Questions About Our Policies?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Contact our legal team for clarification on any terms or privacy concerns.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/ContactPage"
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/upload"
                                className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all"
                            >
                                Start Research Upload
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Terms;
