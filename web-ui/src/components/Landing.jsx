import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Target, ShieldCheck, ChevronRight, Binary, Globe, Activity } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -8, borderColor: 'rgba(139, 92, 246, 0.4)' }}
    className="glass-panel hardware-corner p-10 rounded-[32px] group transition-all duration-500 hover:bg-white/[0.02]"
  >
    <div className="w-14 h-14 bg-eng-info/10 rounded-2xl flex items-center justify-center mb-8 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-eng-info drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
    </div>
    <h3 className="text-white font-black text-xl mb-4 tracking-tight uppercase leading-none">{title}</h3>
    <p className="text-eng-text-muted text-[14px] leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export const Landing = ({ onEnter, onLogin }) => {
  const [showSpecs, setShowSpecs] = React.useState(false);
  return (
    <div className="min-h-screen bg-eng-surface eng-grid overflow-hidden relative selection:bg-eng-info/30">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-eng-info/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-eng-info/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Particles/Grid Assets */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute bg-eng-info/20 w-[1px] h-20"
            style={{ 
              left: `${15 + (i * 15)}%`, 
              top: `${20 + (i * 10)}%`
            }}
          />
        ))}
      </div>

      {/* Header/Nav */}
      <header className="max-w-[1400px] mx-auto px-10 h-24 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-eng-info rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase whitespace-nowrap">effiPrecision</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {['Sensors', 'Metrology', 'Council', 'PIC'].map(item => (
            <a key={item} href="#" className="text-[11px] font-black uppercase tracking-[0.3em] text-eng-text-muted hover:text-white transition-colors">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="bg-eng-info/20 border border-eng-info/30 text-eng-info px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-eng-info hover:text-white transition-all active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
          >
            LOGIN / AUTH
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-10 pt-20 pb-40 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-eng-info/10 border border-eng-info/20 rounded-full mb-10 shadow-[inner_0_0_20px_rgba(139,92,246,0.1)]"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-eng-info animate-pulse shadow-[0_0_10px_#8b5cf6]" />
          <span className="text-[10px] font-black text-eng-info uppercase tracking-[0.4em]">Integrated Agentic Ledger // v2.6 Ready</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[100px] md:text-[140px] font-black text-white leading-[0.85] tracking-[-0.06em] mb-12 drop-shadow-2xl"
        >
          PRECISION <br/>
          <span className="premium-gradient">ENGINEERING</span> <br/>
          FOR TALENT.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto text-eng-text-muted text-[18px] font-medium leading-relaxed mb-16 opacity-80"
        >
          A metrology-grade HR intelligence platform. Fusing multi-sensor telemetry from Jira, GitHub, Slack, and Confluence to eliminate bias via GD&T behavioral tolerancing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <button 
            onClick={onEnter}
            className="group relative px-12 py-6 bg-eng-info rounded-3xl text-white font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(139,92,246,0.5)]"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative flex items-center gap-4">
              Enter Inspection Floor <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => setShowSpecs(true)}
            className="px-12 py-6 border border-eng-border rounded-3xl text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-white/5 transition-all"
          >
            Technical Specs
          </button>
        </motion.div>

        <AnimatePresence>
          {showSpecs && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-10">
              <div className="absolute inset-0 bg-eng-surface/80 backdrop-blur-3xl" onClick={() => setShowSpecs(false)} />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel hardware-corner p-12 rounded-[40px] max-w-3xl w-full border border-eng-info/30 relative z-10 shadow-2xl">
                <button onClick={() => setShowSpecs(false)} className="absolute top-8 right-8 text-eng-text-muted hover:text-white transition-colors"><Zap className="w-6 h-6 rotate-45" /></button>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4"><Cpu className="text-eng-info" /> Metrology Node Specs // v2.6</h2>
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-2"><div className="text-[10px] font-black text-eng-info uppercase tracking-widest">Architecture</div><div className="text-sm font-bold text-white uppercase">Multi-Agent LangGraph System</div></div>
                      <div className="space-y-2"><div className="text-[10px] font-black text-eng-info uppercase tracking-widest">Inference Engine</div><div className="text-sm font-bold text-white uppercase">Groq Llama-3 70B (Low Latency)</div></div>
                      <div className="space-y-2"><div className="text-[10px] font-black text-eng-info uppercase tracking-widest">Sensor Fusion</div><div className="text-sm font-bold text-white uppercase">ISO 1101 GD&T Metrology Standard</div></div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2"><div className="text-[10px] font-black text-eng-info uppercase tracking-widest">Data Connectors</div><div className="text-sm font-bold text-white uppercase">Jira / GitHub / Slack / Confluence</div></div>
                      <div className="space-y-2"><div className="text-[10px] font-black text-eng-info uppercase tracking-widest">Compliance</div><div className="text-sm font-bold text-white uppercase">GDPR / SOC2 / Metrology-Grade Logs</div></div>
                   </div>
                </div>
                <div className="mt-12 p-6 bg-eng-info/5 border border-eng-info/10 rounded-2xl italic text-[12px] text-slate-400">
                  "effiPrecision utilizes Least Material Condition (LMC) logic to adjust individual performance tolerances based on organizational staffing levels, ensuring unprecedented fairness."
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Feature Grid */}
      <section className="max-w-[1400px] mx-auto px-10 pb-40 grid md:grid-cols-3 gap-10 relative z-10">
        <FeatureCard 
          icon={Binary} 
          title="Multi-Sensor Fusion" 
          desc="Five calibrated ingestion channels (Sensor A/B/C) processing commits, tickets, and ambient influence in real-time."
        />
        <FeatureCard 
          icon={Zap} 
          title="Arbiter Council" 
          desc="An autonomous multi-agent graph deliberating over performance evidence to ensure objective calibration."
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Bias Neutralizer" 
          desc="Applying ISO 1101 GD&T behavioral tolerancing to detect and mitigate manager rating drift automatically."
        />
      </section>

      {/* Footer Meta */}
      <footer className="h-20 border-t border-eng-border flex items-center justify-center relative z-10">
        <div className="flex items-center gap-10 text-[9px] font-black text-eng-text-muted uppercase tracking-[0.5em] opacity-40">
          <span>Node_71 // Nominal</span>
          <div className="w-1 h-1 rounded-full bg-eng-border" />
          <span>Metrology Link Established</span>
          <div className="w-1 h-1 rounded-full bg-eng-border" />
          <span>© 2026 APOGEE CORE</span>
        </div>
      </footer>
    </div>
  );
};
