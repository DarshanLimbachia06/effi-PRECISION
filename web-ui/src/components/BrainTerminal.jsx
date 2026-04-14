import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const LOG_SEQUENCE = [
  "Initializing effiAgent Data Weaver...",
  "Ingesting Jira velocity (L5 Backend domain)...",
  "Pulling GitHub PRs & reviewer latency logs...",
  "Running Gage R&R gate for sensor reliability...",
  "MSU flag cleared: Metrics Stable for Utility.",
  "Applying LMC (Least Material Condition) adjustment...",
  "Bias Risk Analysis: Divergence < 4%.",
  "Computing Agentic Confidence Score...",
  "Generating Performance Inspection Certificate (PIC)...",
  "Inspection Cycle Complete. System Ready."
];

export const BrainTerminal = () => {
  const [logs, setLogs] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (currentLine < LOG_SEQUENCE.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, LOG_SEQUENCE[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, 800 + Math.random() * 1200);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black border border-eng-border rounded-lg overflow-hidden shadow-2xl mb-8">
      <div className="bg-eng-surface px-4 py-2 border-b border-eng-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-eng-pass" />
          <span className="text-[10px] font-mono font-bold text-eng-pass tracking-widest uppercase">Agentic Brain Terminal</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-eng-fail/50" />
          <div className="w-2 h-2 rounded-full bg-eng-accent/50" />
          <div className="w-2 h-2 rounded-full bg-eng-pass/50" />
        </div>
      </div>
      <div 
        ref={containerRef}
        className="h-32 p-4 font-mono text-[11px] overflow-y-auto scrollbar-hide space-y-1 block"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-eng-pass/40">[{new Date().toLocaleTimeString()}]</span>
            <span className={i === logs.length - 1 ? "text-eng-pass font-bold animate-pulse" : "text-eng-pass/80"}>
              {i === logs.length - 1 ? "> " : "  "} {log}
            </span>
          </div>
        ))}
        {currentLine < LOG_SEQUENCE.length && (
          <div className="flex gap-2 text-eng-pass/40">
            <span>[{new Date().toLocaleTimeString()}]</span>
            <span>  Thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};
