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
            className="w-full max-w-3xl mx-auto mt-8 space-y-4 pb-12"
        >
            <motion.div variants={item} className="glass-panel p-5">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Research Area</h3>
                <p className="text-base text-slate-200">{data.researchArea}</p>
            </motion.div>

            <motion.div variants={item} className="glass-panel p-5">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Summary</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{data.summary}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={item} className="glass-panel p-5">
                    <h3 className="text-lg font-bold text-green-400 mb-2">Innovative Points</h3>
                    <div className="text-sm">{formatList(data.innovativePoints)}</div>
                </motion.div>

                <motion.div variants={item} className="glass-panel p-5">
                    <h3 className="text-lg font-bold text-orange-400 mb-2">Experimental Results</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.experimentalResults}</p>
                </motion.div>
            </div>

            <motion.div variants={item} className="glass-panel p-5">
                <h3 className="text-lg font-bold text-pink-400 mb-2">Conclusion</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{data.conclusion}</p>
            </motion.div>
        </motion.div>
    );
}
