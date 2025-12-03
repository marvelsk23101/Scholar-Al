"use client";

import { useState } from "react";
import Image from "next/image";
import FileUpload from "@/components/FileUpload";
import AnalysisResult from "@/components/AnalysisResult";

interface AnalysisData {
  researchArea: string;
  innovativePoints: string | string[];
  experimentalResults: string;
  conclusion: string;
  summary: string;
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", responseText);
        throw new Error(`Server Error: ${response.status} ${response.statusText}. Please try again.`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Analysis failed: ${response.statusText}`);
      }

      setAnalysisData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 font-[family-name:var(--font-sans)]">
      <header className="w-full max-w-3xl flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
            Scholar AI
          </h1>
        </div>
        <p className="text-base text-slate-400 max-w-xl">
          Upload your research paper (PDF or Word) and get an instant AI-powered analysis of the key insights, innovations, and results.
        </p>
      </header>

      <main className="w-full flex flex-col items-center gap-6">
        <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />

        {error && (
          <div className="w-full max-w-xl p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-center text-sm">
            {error}
          </div>
        )}

        {analysisData && <AnalysisResult data={analysisData} />}
      </main>

      <footer className="mt-10 text-slate-500 text-xs">
        Powered by Google Gemini AI
      </footer>
    </div>
  );
}
