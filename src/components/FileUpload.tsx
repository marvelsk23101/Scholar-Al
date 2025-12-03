"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isAnalyzing: boolean;
}

export default function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onFileSelect(e.dataTransfer.files[0]);
            }
        },
        [onFileSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0]);
            }
        },
        [onFileSelect]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative w-full max-w-xl mx-auto mt-6 p-8 border-2 border-dashed rounded-2xl text-center transition-all duration-300 ${isDragging
                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                    : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isAnalyzing}
            />

            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                <div className={`p-3 rounded-full bg-slate-700/50 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
                    <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>
                <div>
                    <p className="text-lg font-semibold text-slate-200">
                        {isAnalyzing ? "Analyzing..." : "Drop your paper here"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Support PDF & Word (DOCX)
                    </p>
                </div>
                {!isAnalyzing && (
                    <button className="glass-button text-sm px-6 py-2 mt-4 pointer-events-auto">
                        Browse Files
                    </button>
                )}
            </div>
        </motion.div>
    );
}
