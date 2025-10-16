'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { SecurityReport } from '@/lib/analysis';

interface Props {
    onSelect: (report: SecurityReport) => void;
    currentUrl: string;
}

export default function HistoryPanel({ onSelect, currentUrl }: Props) {
    const [history, setHistory] = useState<SecurityReport[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('scan_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse history');
            }
        }
    }, [currentUrl]);

    const clearHistory = () => {
        localStorage.removeItem('scan_history');
        setHistory([]);
    };

    if (history.length === 0) return null;

    return (
        <div className="fixed left-6 bottom-6 z-40">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black text-white p-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(185,255,102,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
                <History size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="absolute bottom-20 left-0 w-[320px] bg-white border-2 border-black rounded-[30px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                    >
                        <div className="p-4 bg-[#B9FF66] border-b-2 border-black flex justify-between items-center">
                            <h3 className="font-black uppercase text-sm tracking-widest">Recent Scans</h3>
                            <button
                                onClick={clearHistory}
                                className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                                title="Clear history"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                            {history.slice(0, 10).map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelect(item);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left p-3 rounded-2xl hover:bg-[#F3F3F3] border border-transparent hover:border-black transition-all flex justify-between items-center group"
                                >
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm truncate">{item.url}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-black">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#B9FF66] border border-black px-2 py-0.5 rounded-full text-[10px] font-black">
                                            {item.totalScore}
                                        </span>
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
