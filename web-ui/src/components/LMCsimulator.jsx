import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, AlertTriangle, ShieldCheck, HardHat } from 'lucide-react';
import { EngCard, StatusBadge, CpkGauge } from './EngUI';

export const LMCsimulator = ({ initialHeadcount = 0.85, actual = 88, target = 100, employeeName = "Subject" }) => {
  const [headcount, setHeadcount] = useState(initialHeadcount);
  
  // Simulation logic: As headcount drops below 1.0, LMC kicks in.
  const lmcFactor = headcount < 1.0 ? 1 + (1 - headcount) * 0.8 : 1.0;
  
  const toleranceTrad = target * 0.1;
  const toleranceLMC = toleranceTrad * lmcFactor;
  
  const tradStatus = actual >= (target - toleranceTrad) ? "pass" : "fail";
  const lmcStatus = actual >= (target - toleranceLMC) ? "pass" : "fail";
  
  const cpkTrad = (actual - (target - toleranceTrad)) / (3); 
  const cpkLMC = (actual - (target - toleranceLMC)) / (3);

  return (
    <div className="space-y-10">
      <div className="p-8 bg-eng-info/5 border border-white/5 rounded-[32px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <HardHat className="w-20 h-20 text-eng-info" />
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-eng-info/20 flex items-center justify-center flex-shrink-0">
             <Info className="w-6 h-6 text-eng-info" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-xl text-white mb-2 tracking-tighter uppercase">LMC Resilience Protocol</h4>
            <p className="text-slate-400 leading-relaxed text-[14px] font-medium max-w-4xl">
              Understaffing (Headcount &lt; 1.0) creates systemic drag. Traditional appraisals penalize employees for this unavoidable drift. 
              <span className="text-eng-info font-bold mx-1">effiPrecision LMC</span> dynamically recalibrates behavioral tolerances, subtracting "Headcount Burden" from individual metrics to ensure metrology-grade fairness.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 glass-panel rounded-[24px] border border-white/5 hardware-corner">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[11px] font-black text-eng-text-muted uppercase tracking-[0.2em]">Operational Capacity Adjuster</span>
               <span className="text-eng-info font-mono font-black text-sm">{(headcount * 100).toFixed(0)}% STAFFING</span>
            </div>
            <div className="relative">
              <input 
                type="range" 
                min="0.5" 
                max="1.2" 
                step="0.05" 
                value={headcount} 
                onChange={(e) => setHeadcount(parseFloat(e.target.value))}
                className="w-full h-1 bg-eng-border rounded-full appearance-none cursor-pointer accent-eng-info shadow-inner"
              />
              <div className="absolute -inset-y-4 left-0 w-1 bg-white/20 rounded-full" />
              <div className="absolute -inset-y-4 right-0 w-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex justify-between mt-4 font-mono text-[9px] text-eng-text-muted/60 font-black tracking-widest uppercase">
              <span>Critical Understaffing (LMC)</span>
              <span>Maximum Capacity (MMC)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <motion.div 
            animate={{ x: [-10, 10, -10], opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="bg-eng-surface border border-white/10 rounded-3xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          >
            <ArrowRight className="w-6 h-6 text-eng-info" />
          </motion.div>
        </div>

        {/* Traditional Appraisal */}
        <EngCard title="Fixed Appraisal (Trad)" icon={AlertTriangle} className={tradStatus === 'fail' ? "border-eng-fail/20" : "border-white/5 opacity-50"}>
          <div className="flex justify-between items-start mb-10">
            <StatusBadge type={tradStatus} label={tradStatus === 'fail' ? "OUT OF TOLERANCE" : "IN SPEC"} />
            <CpkGauge value={cpkTrad} label="Fixed Capability Index" />
          </div>
          <div className="space-y-6">
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                <div className="flex justify-between text-[11px] font-mono"><span className="text-eng-text-muted uppercase font-black">Static Spec Floor:</span><span className="text-white font-bold">{target - toleranceTrad}u</span></div>
                <div className="flex justify-between text-[11px] font-mono"><span className="text-eng-text-muted uppercase font-black">Actual Throughput:</span><span className={tradStatus === 'fail' ? "text-eng-fail font-black" : "text-white font-bold"}>{actual}u</span></div>
             </div>
             <div className="w-full h-2 bg-eng-border/50 rounded-full overflow-hidden relative">
               <motion.div className={`h-full ${tradStatus === 'fail' ? 'bg-eng-fail shadow-[0_0_10px_#ff4b4b]' : 'bg-eng-info shadow-[0_0_10px_#8b5cf6]'}`} style={{ width: `${(actual / target) * 100}%` }} />
             </div>
             <p className="text-[11px] text-eng-fail/60 font-medium italic leading-relaxed">
               {tradStatus === 'fail' ? "⚠ Subject failing due to rigid limits ignoring systemic head-load." : ""}
             </p>
          </div>
        </EngCard>

        {/* Adjusted */}
        <EngCard title="Precision LMC Appraisal" icon={ShieldCheck} className={lmcStatus === 'pass' ? "border-eng-pass/20" : "border-white/5"}>
          <div className="flex justify-between items-start mb-10">
            <StatusBadge type={lmcStatus} label={lmcStatus === 'pass' ? "PASS: FAIRNESS_LOCK" : "FAIL"} />
            <CpkGauge value={cpkLMC} label="Dynamic Resilience Index" />
          </div>
          <div className="space-y-6">
             <div className="p-4 bg-eng-pass/[0.03] border border-eng-pass/10 rounded-2xl space-y-3 shadow-inner">
                <div className="flex justify-between text-[11px] font-mono"><span className="text-eng-text-muted uppercase font-black">Adjusted Spec Limit:</span><span className="text-eng-pass font-black">{(target - toleranceLMC).toFixed(1)}u</span></div>
                <div className="flex justify-between text-[11px] font-mono"><span className="text-eng-text-muted uppercase font-black">Actual Throughput:</span><span className="text-white font-bold">{actual}u</span></div>
             </div>
             <div className="w-full h-2 bg-eng-border/50 rounded-full overflow-hidden relative">
               <motion.div className="h-full bg-eng-pass shadow-[0_0_10px_#2dd4bf]" style={{ width: `${(actual / target) * 100}%` }} />
             </div>
             <p className="text-[11px] text-eng-pass/60 font-medium italic leading-relaxed">
               {lmcStatus === 'pass' ? "✓ Systemic Resilience factor applied. Individual protected from capacity drift." : ""}
             </p>
          </div>
        </EngCard>
      </div>
    </div>
  );
};
