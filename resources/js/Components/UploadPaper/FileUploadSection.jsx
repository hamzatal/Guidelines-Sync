import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, X, CheckCircle } from "lucide-react";

const FileUploadSection = ({ onFileUpload, uploadedFile }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

const handleFile = (file) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document");
        return;
    }

    if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
    }

    console.log("File selected:", file); // للتحقق
    onFileUpload(file); // تأكد من إرسال الملف نفسه
};


    const removeFile = () => {
        onFileUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="bg-green-600 p-2 rounded-full mr-3">
                    <Upload className="h-6 w-6" />
                </span>
                Upload Research{" "}
                <span className="text-green-500 ml-2">Paper</span>
            </h2>

            {!uploadedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer ${
                        isDragging
                            ? "border-green-500 bg-green-900 bg-opacity-20"
                            : "border-gray-600 hover:border-green-500 hover:bg-gray-700 bg-opacity-50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold mb-2">
                        Drag & Drop Your Document Here
                    </h3>
                    <p className="text-gray-400 mb-4">or click to browse</p>
                    <p className="text-sm text-gray-500">
                        Supported formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-700 rounded-lg p-6 flex items-center justify-between"
                >
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-600 p-3 rounded-full">
                            <File className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg">
                                {uploadedFile.name}
                            </p>
                            <p className="text-sm text-gray-400">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                            </p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <button
                        onClick={removeFile}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors duration-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default FileUploadSection;
