'use client';

import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';

interface Props {
    data: any;
}

export default function JsonView({ data }: Props) {
    const [copied, setCopied] = useState(false);

    const copyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scan-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#191A23] rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(185,255,102,1)] overflow-hidden"
        >
            <div className="flex justify-between items-center px-6 py-4 bg-black/20 border-b border-white/10">
                <div className="flex items-center gap-2 text-white">
                    <Terminal size={18} className="text-[#B9FF66]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Raw Scan Data</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={copyJson}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                        onClick={downloadJson}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                        <Download size={14} />
                        Download
                    </button>
                </div>
            </div>
            <div className="p-8 font-mono text-sm overflow-x-auto max-h-[500px] custom-scrollbar">
                <pre className="text-[#B9FF66]/80 leading-relaxed">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </motion.div>
    );
}
