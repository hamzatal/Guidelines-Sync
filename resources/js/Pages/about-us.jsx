import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    BookOpen,
    FileText,
    PenTool,
    Search,
    Clipboard,
    CheckCircle,
} from "lucide-react";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";

const About = ({ auth }) => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
            <Head title="About Us - Guidelines Sync" />

            {/* Navigation */}
            <Nav auth={auth} />

            {/* Hero Section */}
            <div className="relative h-64 md:h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                <div className="absolute inset-0 bg-[url('/images/academic-bg.svg')] bg-no-repeat bg-center opacity-30 bg-fill"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-6xl font-extrabold mb-2 leading-tight"
                        >
                            About <span className="text-green-400">Us</span>
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                {/* Introduction */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <p className="text-xl mb-8 leading-relaxed text-gray-300">
                        At Guidelines Sync, we're dedicated to simplifying the
                        academic publishing process, empowering researchers to
                        focus on their work while we handle the formatting.
                    </p>
                </motion.div>

                {/* Our Story and Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Our Story */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        variants={fadeIn}
                        className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700 h-full"
                    >
                        <h2 className="text-3xl font-bold mb-6 flex items-center">
                            <span className="bg-green-600 p-2 rounded-full mr-3">
                                <BookOpen className="h-6 w-6" />
                            </span>
                            Our{" "}
                            <span className="text-green-500 ml-2">Story</span>
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Founded in 2023 by a team of academic
                                researchers, Guidelines Sync was born from a
                                desire to streamline the complex process of
                                formatting research papers for journal
                                submissions.
                            </p>
                            <p>
                                Our founders, having faced the challenges of
                                meeting diverse journal requirements, created a
                                platform that automates formatting with
                                precision and efficiency.
                            </p>
                            <p>
                                Whether you're a graduate student or a seasoned
                                researcher, Guidelines Sync is here to save you
                                time and ensure your work meets the highest
                                standards.
                            </p>
                        </div>
                    </motion.div>

                    {/* Our Vision */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        variants={fadeIn}
                        className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700 h-full"
                    >
                        <h2 className="text-3xl font-bold mb-6 flex items-center">
                            <span className="bg-green-600 p-2 rounded-full mr-3">
                                <FileText className="h-6 w-6" />
                            </span>
                            Our{" "}
                            <span className="text-green-500 ml-2">Vision</span>
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                We envision a world where researchers can focus
                                on innovation and discovery, free from the
                                burden of tedious formatting tasks.
                            </p>
                            <p>
                                Guidelines Sync aims to be the leading platform
                                for automated research formatting, bridging the
                                gap between researchers and journal requirements
                                worldwide.
                            </p>
                            <p>
                                By leveraging advanced technology and AI, we
                                strive to make academic publishing seamless,
                                accessible, and efficient for all scholars.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Our Mission */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="bg-gray-900 bg-opacity-30 rounded-xl p-8 shadow-2xl max-w-4xl mx-auto mb-16 border border-green-800"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
                        <span className="bg-green-600 p-2 rounded-full mr-3">
                            <CheckCircle className="h-6 w-6" />
                        </span>
                        Our <span className="text-green-500 ml-2">Mission</span>
                    </h2>
                    <div className="text-gray-200 leading-relaxed space-y-4">
                        <p>
                            We aim to empower researchers by providing a smart,
                            automated platform that formats academic papers to
                            meet journal standards effortlessly.
                        </p>
                        <p>
                            Our commitment goes beyond formatting - we're
                            dedicated to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Ensuring accuracy and compliance with journal
                                guidelines
                            </li>
                            <li>
                                Supporting researchers with intuitive tools and
                                resources
                            </li>
                            <li>
                                Making academic publishing accessible to
                                scholars worldwide
                            </li>
                            <li>
                                Continuously improving our platform with
                                AI-driven innovations
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8">
                        Why Choose{" "}
                        <span className="text-green-500">Guidelines Sync</span>?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                            className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg border border-gray-700"
                        >
                            <div className="bg-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Comprehensive Journal Database
                            </h3>
                            <p className="text-gray-300">
                                Access a vast database of local and
                                international journals with detailed formatting
                                requirements.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                            className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg border border-gray-700"
                        >
                            <div className="bg-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <PenTool className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Automated Formatting
                            </h3>
                            <p className="text-gray-300">
                                Upload your paper and get it formatted instantly
                                to match your target journal's guidelines.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                            className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg border border-gray-700"
                        >
                            <div className="bg-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Clipboard className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                24/7 Support
                            </h3>
                            <p className="text-gray-300">
                                Our team is available around the clock to assist
                                with any questions or issues during your
                                submission process.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Our Values */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl max-w-4xl mx-auto mb-16 border border-gray-700"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Our <span className="text-green-500">Values</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                title: "Innovation",
                                description:
                                    "We leverage AI and advanced technology to enhance the academic publishing process.",
                            },
                            {
                                title: "Accuracy",
                                description:
                                    "We ensure precise formatting to meet the strictest journal standards.",
                            },
                            {
                                title: "Accessibility",
                                description:
                                    "We make academic publishing tools available to researchers worldwide.",
                            },
                            {
                                title: "Support",
                                description:
                                    "We provide dedicated support to ensure a seamless user experience.",
                            },
                        ].map((value, index) => (
                            <div key={index} className="flex items-start p-4">
                                <div className="bg-green-600 p-2 rounded-full mr-4 mt-1">
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-400">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-300">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="text-center bg-green-900 bg-opacity-40 rounded-xl p-8 shadow-xl max-w-3xl mx-auto border border-green-800"
                >
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to Publish with{" "}
                        <span className="text-green-400">Guidelines Sync</span>?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Join thousands of researchers who trust Guidelines Sync
                        to streamline their journal submissions.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/upload"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                        >
                            Upload Your Paper
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default About;
