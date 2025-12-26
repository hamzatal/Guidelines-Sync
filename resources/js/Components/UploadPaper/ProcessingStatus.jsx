import React from "react";
import { motion } from "framer-motion";
import { Loader2, FileText, Sparkles, CheckCircle } from "lucide-react";

const ProcessingStatus = () => {
    const steps = [
        { icon: FileText, label: "Analyzing Document", status: "active" },
        { icon: Sparkles, label: "AI-Powered Formatting", status: "pending" },
        { icon: CheckCircle, label: "Finalizing Output", status: "pending" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700"
        >
            <div className="text-center mb-8">
                <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Processing Your Document</h3>
                <p className="text-gray-400 mt-2">
                    This may take a few moments...
                </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center space-x-4"
                    >
                        <div
                            className={`p-3 rounded-full ${
                                step.status === "active"
                                    ? "bg-green-600 animate-pulse"
                                    : "bg-gray-700"
                            }`}
                        >
                            <step.icon className="h-6 w-6" />
                        </div>
                        <span className="text-lg">{step.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="bg-green-500 h-2 rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default ProcessingStatus;
