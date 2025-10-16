'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { HeaderAnalysis } from '@/lib/analysis';

interface Props {
    name: string;
    data: HeaderAnalysis;
    index: number;
}

export default function HeaderCard({ name, data, index }: Props) {
    const [copied, setCopied] = useState(false);

    const copyValue = () => {
        if (data.value) {
            navigator.clipboard.writeText(data.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getStatusIcon = () => {
        if (data.status === 'secure') return <CheckCircle className="text-black" size={24} />;
        if (data.status === 'weak') return <AlertTriangle className="text-black" size={24} />;
        return <XCircle className="text-gray-400" size={24} />;
    };

    const getStatusLabel = () => {
        if (data.status === 'secure') return 'Secure';
        if (data.status === 'weak') return 'Weak';
        return 'Missing';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={clsx(
                "group relative p-6 rounded-[30px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all",
                data.status === 'secure' ? "bg-[#B9FF66]" : data.status === 'weak' ? "bg-[#FFCE31]" : "bg-white",
                data.status === 'missing' && "animate-shake border-red-200"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg uppercase tracking-tight">{name}</h3>
                    <div className="relative group/tooltip">
                        <HelpCircle size={16} className="text-black/40 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                            <p className="font-bold mb-1">What it does:</p>
                            <p className="mb-2 text-gray-300">{data.description}</p>
                            <p className="font-bold mb-1">Risk:</p>
                            <p className="text-gray-300">{data.recommendation}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                        </div>
                    </div>
                </div>
                {getStatusIcon()}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-black uppercase border border-black",
                        data.status === 'secure' ? "bg-black text-[#B9FF66]" : "bg-white text-black"
                    )}>
                        {getStatusLabel()}
                    </span>
                    <span className="text-xs font-bold">{data.score}/{data.maxScore} PTS</span>
                </div>

                <div className="relative">
                    <div className="text-sm font-mono bg-black/5 p-3 rounded-xl border border-black/10 break-all overflow-hidden line-clamp-2 min-h-[50px]">
                        {data.value || 'Not detected'}
                    </div>
                    {data.value && (
                        <button
                            onClick={copyValue}
                            className="absolute right-2 top-2 p-1.5 bg-black/10 hover:bg-black/20 rounded-lg transition-colors"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Animation pulses for success */}
            {data.status === 'secure' && (
                <div className="absolute inset-0 rounded-[30px] border-2 border-black z-[-1] animate-ping opacity-20 pointer-events-none"></div>
            )}
        </motion.div>
    );
}
