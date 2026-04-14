import React from 'react';
import { ShieldCheck, Info, Sparkles, Activity, Target, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const EngCard = ({ children, title, icon: Icon, className = "", noPadding = false }) => (
  <div className={`glass-panel hardware-corner rounded-[24px] relative overflow-hidden group transition-all duration-500 hover:border-eng-info/40 ${className}`}>
    <div className="scanline opacity-0 group-hover:opacity-100 transition-opacity" />
    
    {title && (
      <div className="flex items-center justify-between px-8 py-5 border-b border-eng-border/40 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-eng-info" />}
          <h3 className="text-white font-extrabold tracking-[0.1em] uppercase text-[11px] glow-text">{title}</h3>
        </div>
        <div className="flex gap-1.5 px-3 py-1 rounded-full bg-eng-surface-light border border-eng-border/50">
          <div className="w-1.5 h-1.5 rounded-full bg-eng-info shadow-[0_0_8px_rgba(139,92,246,0.6)] animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-eng-border" />
        </div>
      </div>
    )}
    
    <div className={noPadding ? "" : "p-8"}>
      {children}
    </div>

    {/* Subtle corner detail */}
    <div className="absolute top-0 right-0 w-12 h-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
       <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-eng-info rounded-full shadow-[0_0_10px_#8b5cf6]" />
    </div>
  </div>
);

export const StatusBadge = ({ type = "info", label }) => {
  const styles = {
    pass: "bg-eng-pass/10 text-eng-pass border-eng-pass/30 shadow-[0_0_20px_rgba(45,212,191,0.15)]",
    fail: "bg-eng-fail/10 text-eng-fail border-eng-fail/30 shadow-[0_0_20px_rgba(255,75,75,0.15)]",
    info: "bg-eng-info/10 text-eng-info border-eng-info/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    warn: "bg-eng-accent/10 text-eng-accent border-eng-accent/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  };
  return (
    <motion.span 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.25em] inline-flex items-center gap-2 group cursor-default transition-all hover:bg-opacity-20 ${styles[type]}`}
    >
      <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${type === 'pass' ? 'bg-eng-pass' : type === 'fail' ? 'bg-eng-fail' : 'bg-eng-info'}`} />
      {label}
    </motion.span>
  );
};

export const CpkGauge = ({ value, label = "Process Capability Index" }) => {
  const color = value >= 1.33 ? "text-eng-pass" : value >= 1.0 ? "text-eng-accent" : "text-eng-fail";
  const glow = value >= 1.33 ? "shadow-[0_0_25px_rgba(45,212,191,0.4)]" : value >= 1.0 ? "shadow-[0_0_25px_rgba(245,158,11,0.4)]" : "shadow-[0_0_25px_rgba(255,75,75,0.4)]";

  return (
    <div className="flex flex-col items-center group">
      <div className={`relative flex items-center justify-center`}>
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className={`text-5xl font-mono font-black ${color} drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-2 group-hover:scale-110 transition-transform`}
        >
          {value.toFixed(2)}
        </motion.div>
      </div>
      <div className="text-[10px] text-eng-text-muted uppercase tracking-[0.2em] font-black mt-2 text-center max-w-[150px] opacity-60 group-hover:opacity-100 transition-opacity">
        {label}
      </div>
    </div>
  );
};

export const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-12 relative">
    <div className="flex items-center gap-6">
      {Icon && (
        <div className="w-16 h-16 bg-eng-info/10 border border-eng-info/20 rounded-2xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] group hover:scale-105 transition-all">
          <Icon className="w-8 h-8 text-eng-info drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-5 leading-none">
          {title}
          <div className="h-[2px] flex-1 bg-gradient-to-r from-eng-info/40 via-eng-info/5 to-transparent rounded-full shadow-[0_0_10px_rgba(139,92,246,0.2)]" />
        </h2>
        {subtitle && <p className="text-eng-text-muted text-[15px] mt-3 font-medium italic opacity-70 tracking-tight leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export const ResearchTooltip = ({ content }) => (
  <div className="group relative inline-block ml-2">
    <Info className="w-4 h-4 text-eng-text-muted cursor-help hover:text-eng-info transition-colors opacity-40 group-hover:opacity-100" />
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileHover={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block w-72 p-5 bg-eng-surface-light text-[12px] text-slate-300 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-eng-info/30 z-[100] backdrop-blur-2xl"
    >
      <div className="font-black text-eng-info uppercase tracking-[0.2em] mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
         <ShieldCheck className="w-3.5 h-3.5" />
         Sensor Calibration
      </div>
      <div className="leading-relaxed font-medium">
        {content}
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-eng-surface-light border-r border-b border-eng-info/30 rotate-45" />
    </motion.div>
  </div>
);

export const InvisibleWorkBadge = () => (
  <motion.div 
    animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.02, 1] }}
    transition={{ repeat: Infinity, duration: 3 }}
    className="flex items-center gap-2 px-4 py-2 bg-eng-info/10 border border-eng-info/30 rounded-full text-eng-info text-[11px] font-black tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.15)]"
  >
    <Sparkles className="w-4 h-4 animate-spin-slow" />
    <span className="premium-gradient uppercase">Agentic Ingestion</span>
  </motion.div>
);
