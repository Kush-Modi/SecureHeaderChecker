'use client';

import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import clsx from 'clsx';

interface Props {
    score: number;
    maxScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    riskLabel: string;
    riskDescription: string;
}

export default function ScoreCard({ score, maxScore, riskLevel, riskLabel, riskDescription }: Props) {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const controls = animate(0, score, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (value) => setDisplayScore(Math.floor(value))
        });

        if (score >= 18) {
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#B9FF66', '#000000', '#FFFFFF']
                });
            }, 1000);
        }

        return () => controls.stop();
    }, [score]);

    const getBgColor = () => {
        if (riskLevel === 'Low') return 'bg-[#B9FF66]';
        if (riskLevel === 'Medium') return 'bg-[#FFCE31]';
        return 'bg-white';
    };


    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={clsx(
                "relative p-10 rounded-[50px] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center gap-2 overflow-hidden",
                getBgColor()
            )}
        >
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-black/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

            <h3 className="text-xl font-black uppercase tracking-widest text-black/60">Hardening Score</h3>

            <div className="relative">
                <motion.div
                    key={displayScore}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[120px] md:text-[150px] font-black leading-none tracking-tighter"
                >
                    {displayScore}
                </motion.div>
                <div className="absolute -bottom-2 right-0 text-2xl font-black text-black/40">/{maxScore}</div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2">
                <div className="px-6 py-2 bg-black text-white rounded-full font-black text-lg uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                    {riskLabel}
                </div>
                <p className="max-w-[280px] text-xs font-bold opacity-70">
                    {riskDescription}
                </p>
            </div>

            {/* Decorative pulse for high scores */}
            {score >= 15 && (
                <div className="absolute inset-4 border-2 border-black/10 rounded-[40px] animate-pulse pointer-events-none"></div>
            )}
        </motion.div>
    );
}
