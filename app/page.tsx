'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Loader2, AlertTriangle, RefreshCw, Smartphone, Monitor, ChevronDown, Share2 } from 'lucide-react';
import { SecurityReport } from '@/lib/analysis';
import HeaderCard from '@/components/HeaderCard';
import ScoreCard from '@/components/ScoreCard';
import JsonView from '@/components/JsonView';
import HistoryPanel from '@/components/HistoryPanel';
import clsx from 'clsx';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SecurityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Check for URL param in search
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      setUrl(urlParam);
      handleAnalyze(undefined, urlParam);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnalyze = async (e?: React.FormEvent, targetUrl?: string) => {
    e?.preventDefault();
    const inputUrl = targetUrl || url;
    if (!inputUrl) return;

    setLoading(true);
    setError(null);
    setShowJson(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setResult(data);

      // Save to history
      const saved = localStorage.getItem('scan_history');
      const history = saved ? JSON.parse(saved) : [];
      const newHistory = [data, ...history.filter((h: any) => h.url !== data.url)].slice(0, 10);
      localStorage.setItem('scan_history', JSON.stringify(newHistory));

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (result) {
      const shareUrl = `${window.location.origin}/?url=${encodeURIComponent(result.url)}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Shareable link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] font-sans selection:bg-[#B9FF66] selection:text-black transition-colors duration-500">

      {/* Dynamic Navigation */}
      <nav className={clsx(
        "fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md border-b-2 border-black py-4" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-black p-2 rounded-xl text-[#B9FF66] shadow-[2px_2px_0px_0px_rgba(185,255,102,1)]">
              <Shield size={20} fill="#B9FF66" />
            </div>
            <span className="font-black uppercase tracking-tighter text-xl">WebSentinel<span className="text-[#B9FF66]">.</span></span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 font-black uppercase text-xs tracking-widest">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#B9FF66] transition-colors"
            >
              ANALYZER
            </button>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-2 rounded-full border-2 border-black hover:bg-[#B9FF66] hover:text-black transition-all font-black"
            >
              DOCS
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                Secure Your <br />
                <span className="bg-[#B9FF66] px-4 py-2 rounded-2xl inline-block transform -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  Web Assets
                </span>
              </h1>
              <p className="text-xl font-medium text-gray-500 max-w-lg leading-relaxed">
                Industry-grade HTTP security header analyzer. Evaluate your security hardening status and identify opportunities for advanced protection.
              </p>
            </motion.div>

            <motion.form
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={(e) => handleAnalyze(e)}
              className="relative group"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter domain (e.g. google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full text-xl p-6 rounded-[24px] border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-bold placeholder:text-gray-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="bg-black text-white px-10 py-6 rounded-[24px] border-4 border-black shadow-[10px_10px_0px_0px_rgba(185,255,102,1)] hover:bg-[#B9FF66] hover:text-black transition-all flex items-center justify-center gap-3 font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Shield size={24} />}
                  {loading ? 'Analyzing...' : 'Analyze Site'}
                </motion.button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-16 left-0 right-0 p-4 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 font-black flex items-center gap-2"
                >
                  <AlertTriangle size={18} />
                  {error}
                </motion.div>
              )}
            </motion.form>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-[#B9FF66] rounded-full blur-[120px] opacity-20 transform translate-x-20"></div>
            <div className="bg-white p-10 rounded-[60px] border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative z-10 group">
              <div className="flex justify-between items-center mb-10 border-b-2 border-black/5 pb-6">
                <div className="flex gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-400"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <div className="w-4 h-4 rounded-full bg-green-400"></div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                  <Monitor size={14} /> browser.sys
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-6 bg-black rounded-full w-full group-hover:w-3/4 transition-all duration-700 delay-100"></div>
                <div className="h-6 bg-[#B9FF66] rounded-full w-3/4 group-hover:w-full transition-all duration-700 delay-200 border-2 border-black"></div>
                <div className="h-40 bg-[#F3F3F3] rounded-[30px] border-2 border-black flex items-center justify-center">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-[#B9FF66]">
                    <Shield size={40} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded-full flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Results Section */}
        <div ref={resultsRef}>
          <AnimatePresence mode="wait">
            {result && (
              <motion.section
                key={result.url}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="space-y-16"
              >
                {/* Summary Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-black pb-10">
                  <div className="space-y-2">
                    <span className="text-sm font-black uppercase tracking-widest text-[#B9FF66] bg-black px-3 py-1 rounded-lg">Scan Report</span>
                    <h2 className="text-5xl md:text-6xl font-black break-all leading-none">{result.url}</h2>
                    <p className="text-gray-500 uppercase text-xs font-black tracking-widest">Captured at {new Date(result.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleShare}
                      className="p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#B9FF66] transition-all"
                      title="Copy share link"
                    >
                      <Share2 size={24} />
                    </button>
                    <button
                      onClick={() => handleAnalyze()}
                      className="p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#B9FF66] transition-all"
                      title="Rescan site"
                    >
                      <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>

                {/* Top Dashboard */}
                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-5">
                    <ScoreCard
                      score={result.totalScore}
                      maxScore={result.maxTotalScore}
                      riskLevel={result.riskLevel}
                      riskLabel={result.riskLabel}
                      riskDescription={result.riskDescription}
                    />
                  </div>
                  <div className="lg:col-span-7 flex flex-col justify-center gap-8">
                    <div className="p-8 bg-white rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
                      <h4 className="text-2xl font-black uppercase italic">Protection Status</h4>
                      <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        {result.riskDescription} This score represents proactive security hardening beyond core protections.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 text-sm font-black">
                          <div className="w-3 h-3 rounded-full bg-[#B9FF66] border border-black"></div> High Performance
                        </div>
                        <div className="flex items-center gap-2 text-sm font-black">
                          <div className="w-3 h-3 rounded-full bg-[#FFCE31] border border-black"></div> Room for Improvement
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Cards */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black uppercase">Detailed Analysis</h3>
                    <div className="h-[2px] bg-black flex-1"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(result.headers).map(([name, data], i) => (
                      <HeaderCard key={name} name={name} data={data} index={i} />
                    ))}
                  </div>
                </div>

                {/* Fix Suggestions */}
                <div className="bg-white p-10 rounded-[40px] border-2 border-black shadow-[10px_10px_0px_0px_rgba(185,255,102,1)] space-y-8">
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black uppercase">Hardening Opportunities</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {Object.entries(result.headers).filter(([_, d]) => d.status !== 'secure').slice(0, 4).map(([name, data]) => (
                      <div key={name} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-black text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">{name}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-500">{data.recommendation}</p>
                      </div>
                    ))}
                    {Object.values(result.headers).every(d => d.status === 'secure') && (
                      <div className="col-span-2 text-center py-10">
                        <Shield size={48} className="mx-auto mb-4 text-[#B9FF66] fill-black" />
                        <p className="text-2xl font-black italic">Perfect configuration detected. No immediate fixes required!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* JSON Toggle */}
                <div className="space-y-6 pt-10">
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="group flex items-center gap-3 font-black uppercase text-sm tracking-widest hover:text-[#B9FF66] transition-all"
                  >
                    <div className={clsx(
                      "w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-white group-hover:bg-black group-hover:text-[#B9FF66] transition-all",
                      showJson && "rotate-180"
                    )}>
                      <ChevronDown size={14} />
                    </div>
                    {showJson ? 'Collapse JSON View' : 'Explore Raw Scan Data'}
                  </button>

                  <AnimatePresence>
                    {showJson && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <JsonView data={result} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Persistence & History */}
      <HistoryPanel
        onSelect={(report) => {
          setResult(report);
          setUrl(report.url);
          setShowJson(false);
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        currentUrl={result?.url || ''}
      />

      <footer className="bg-black text-white px-10 py-20 mt-32 border-t-8 border-[#B9FF66]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <span className="text-3xl font-black uppercase italic text-[#B9FF66]">WebSentinel<span className="text-white">.</span></span>
            <p className="text-gray-400 max-w-sm font-medium">
              WebSentinel evaluates HTTP header configuration only. It does not assess server-side security, infrastructure, or application logic. Provided for educational purposes.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#B9FF66] hover:text-black transition-all cursor-pointer">
                <Smartphone size={18} />
              </div>
              <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#B9FF66] hover:text-black transition-all cursor-pointer">
                <Monitor size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-black uppercase text-sm tracking-widest text-white/40">Resources</h5>
            <ul className="space-y-2 font-bold text-sm">
              <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" target="_blank" className="hover:text-[#B9FF66]">MDN Web Docs</a></li>
              <li><a href="https://owasp.org" target="_blank" className="hover:text-[#B9FF66]">OWASP Foundation</a></li>
              <li><a href="https://securityheaders.com" target="_blank" className="hover:text-[#B9FF66]">SecurityHeaders.com</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-black uppercase text-sm tracking-widest text-white/40">Legal</h5>
            <ul className="space-y-2 font-bold text-sm">
              <li><a href="#" className="hover:text-[#B9FF66]">Disclaimer</a></li>
              <li><a href="#" className="hover:text-[#B9FF66]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#B9FF66]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[3px] text-gray-600">
          <span>&copy; 2026 WebSentinel. Built with Next.js.</span>
          <span>Made with ❤️ for the security community</span>
        </div>
      </footer>
    </div>
  );
}
