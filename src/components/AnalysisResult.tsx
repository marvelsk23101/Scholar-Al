"use client";

import { motion } from "framer-motion";

interface AnalysisData {
    researchArea: string;
    innovativePoints: string | string[];
    experimentalResults: string;
    conclusion: string;
    summary: string;
}

interface AnalysisResultProps {
    data: AnalysisData;
}

export default function AnalysisResult({ data }: AnalysisResultProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const formatList = (content: string | string[]) => {
        if (Array.isArray(content)) {
            return (
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {content.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            );
        }
        return <p className="text-slate-300">{content}</p>;
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-4xl mx-auto mt-12 space-y-6 pb-20"
        >
            <motion.div variants={item} className="glass-panel p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-3">Research Area</h3>
                <p className="text-lg text-slate-200">{data.researchArea}</p>
            </motion.div>

            <motion.div variants={item} className="glass-panel p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Summary</h3>
                <p className="text-slate-300 leading-relaxed">{data.summary}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={item} className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-green-400 mb-3">Innovative Points</h3>
                    {formatList(data.innovativePoints)}
                </motion.div>

                <motion.div variants={item} className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-3">Experimental Results</h3>
                    <p className="text-slate-300 leading-relaxed">{data.experimentalResults}</p>
                </motion.div>
            </div>

            <motion.div variants={item} className="glass-panel p-6">
                <h3 className="text-xl font-bold text-pink-400 mb-3">Conclusion</h3>
                <p className="text-slate-300 leading-relaxed">{data.conclusion}</p>
            </motion.div>
        </motion.div>
    );
}
