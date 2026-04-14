import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ComposedChart, ReferenceLine, Line, LineChart
} from 'recharts';
import {
  Activity, Search, Bell, Target, Users, AlertTriangle, ShieldAlert,
  ChevronDown, Send, X, Bot, Sparkles, RefreshCw, CheckCircle2,
  Sliders, DollarSign, FileText, Cpu, Database, GitMerge, MessageSquare,
  BookOpen, Zap, TrendingDown, TrendingUp, PenTool, Globe,
  ShieldCheck, Terminal, Info, HelpCircle, UserCheck, HardHat, AlertCircle,
  ClipboardCheck, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { BrainTerminal } from './components/BrainTerminal';
import { LMCsimulator } from './components/LMCsimulator';
import { PICreport } from './components/PICreport';
import { EngCard, StatusBadge, SectionHeader } from './components/EngUI';
import { Landing } from './components/Landing';
import { Login } from './components/Login';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SOURCE_META = {
  HRMS:       { icon: Database,     color: 'indigo',  label: 'HRMS (effiHR)',  desc: 'Goals · Ratings · Attendance · Past Cycles' },
  Jira:       { icon: Target,       color: 'blue',    label: 'Jira',           desc: 'Tickets · Velocity · P1 Resolution' },
  GitHub:     { icon: GitMerge,     color: 'violet',  label: 'GitHub',         desc: 'Commits · PRs · Code Reviews' },
  Confluence: { icon: BookOpen,     color: 'teal',    label: 'Confluence',     desc: 'Docs · Knowledge · Invisible Work' },
  Slack:      { icon: MessageSquare,color: 'orange',  label: 'Slack',          desc: 'Collaboration · EWS · Influence Radius' },
};

const colorMap = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', dot: 'bg-indigo-500' },
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', dot: 'bg-violet-500' },
  teal:   { bg: 'bg-teal-500/10',   text: 'text-teal-400',   border: 'border-teal-500/20',   dot: 'bg-teal-500' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' },
};

function SourceBadge({ source }) {
  const meta = SOURCE_META[source];
  if (!meta) return null;
  const c = colorMap[meta.color] || colorMap.violet;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <Icon className="w-3 h-3" />{source}
    </span>
  );
}

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [comparisonEmail, setComparisonEmail] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [evalData, setEvalData] = useState(null);
  const [allSources, setAllSources] = useState(null);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [lmcFactor, setLmcFactor] = useState(1.0);
  const [roiHeadcount, setRoiHeadcount] = useState(250);
  const [roiAttrition, setRoiAttrition] = useState(22);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', text: 'Arbiter Node active. I have cross-fused context from Jira, GitHub, Slack, Confluence, and HRMS for the selected subject. How can I assist in the inspection cycle?' }]);
  const [chatInput, setChatInput] = useState('');
  const [brainLogs, setBrainLogs] = useState([]);
  const chatEndRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    const events = [
      "Fusing Jira sprint telemetry...",
      "Parsing GitHub commit density for P1 zones...",
      "Analyzing Slack ambient influence signals...",
      "Cross-referencing HRMS behavioral benchmarks...",
      "Calculating GD&T tolerances via Agentic Brain...",
      "Applying LMC fairness adjustment (capacity drift).",
      "Drafting Metrology-Grade Inspection Certificate...",
      "Ledger updated: 0x8F92...B31D"
    ];
    let i = 0;
    const itv = setInterval(() => {
      setBrainLogs(prev => [...prev.slice(-10), events[i % events.length]]);
      i++;
    }, 5000);
    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [brainLogs]);

  useEffect(() => {
    fetch(`${API}/api/employees`)
      .then(r => r.json())
      .then(d => {
        setEmployees(d.employees || []);
        if (d.employees?.length) {
          setSelectedEmail(d.employees[0].email);
          runEval(d.employees[0].email);
        }
      })
      .catch(() => {
        const mock = [
          { email: 'aditya@effihr.mock', name: 'Aditya Sharma', role: 'Lead Architect', grade: 'L5' },
          { email: 'riya@effihr.mock',   name: 'Riya Desai',    role: 'Staff Engineer', grade: 'L4' },
          { email: 'arjun@effihr.mock',  name: 'Arjun Kumar',   role: 'Backend Dev', grade: 'L4' },
          { email: 'priya@effihr.mock',  name: 'Priya Singh',   role: 'DevOps Lead', grade: 'L6' },
        ];
        setEmployees(mock);
        setSelectedEmail(mock[0].email);
      });
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const runEval = async (email) => {
    if (!email) return;
    setIsSyncing(true);
    setAllSources(null);
    try {
      const resp = await fetch(`${API}/api/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employee_email: email }) });
      const ev = await resp.json();
      setEvalData(ev);
    } catch (e) { console.error(e); }
    setIsSyncing(false);
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msgs = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(msgs);
    const q = chatInput; setChatInput('');
    try {
      const r = await fetch(`${API}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q, employee_context: selectedEmail }) });
      const d = await r.json();
      setChatMessages([...msgs, { role: 'ai', text: d.reply }]);
    } catch { setChatMessages([...msgs, { role: 'ai', text: 'Sensor timeout — reconnecting to Agentic Core...' }]); }
  };

  const selEmp = employees.find(e => e.email === selectedEmail);
  const isAditya = selectedEmail.includes('aditya');
  const isRiya   = selectedEmail.includes('riya');

  const fused      = evalData?.evidence?.fused_signals || {};
  const hrmsEv     = evalData?.evidence?.hrms?.evidence || {};
  const jiraEv     = evalData?.evidence?.jira?.evidence || {};
  const githubEv   = evalData?.evidence?.github?.evidence || {};
  const confEv     = evalData?.evidence?.confluence?.evidence || {};
  const slackBench = evalData?.evidence?.slack?.benchmark_comparison || {};
  const jiraLmc    = evalData?.evidence?.jira?.lmc_flags || {};

  const ops = evalData?.ops_score || fused.ops_objective_score || 3.5;
  const classification = fused.fusion_classification || 'Standard Contributor';
  const ewsTriggered = fused.ews_triggered || false;
  const biasFlag     = fused.bias_neutralizer_flag || false;

  const radarData = [
    { subject: 'Sensor A (Output)',    A: fused.sensor_a_score || (isAditya ? 89 : isRiya ? 28 : (evalData ? 60 : 0)) },
    { subject: 'Sensor B (Tactile)',   A: isAditya ? 70 : isRiya ? 45 : (evalData ? 65 : 0) },
    { subject: 'Sensor C (Ambient)',   A: fused.sensor_c_score || (isAditya ? 94 : isRiya ? 21 : (evalData ? 55 : 0)) },
  ];
  const velocityTrend = (jiraEv.sprint_velocity_trend || (evalData ? [10, 10, 10, 10, 10, 10, 10] : [0, 0, 0, 0, 0, 0, 0])).map((v, i) => ({ w: `W${i + 1}`, v }));
  const goals = hrmsEv.goals_detail || [];

  const humanScrap = Math.round(roiHeadcount * (roiAttrition / 100) * 0.20);
  const scrapCost  = Math.round(humanScrap * 10);
  const dividend   = Math.round(scrapCost * 0.18);

  const TABS = [
    { id: 'overview',     label: 'Inspection Floor', icon: Activity },
    { id: 'comparison',   label: 'LMC vs Trad.',     icon: Sliders },
    { id: 'benchmarking', label: 'Cross-Sensor Duel', icon: Users },
    { id: 'pic',          label: 'Official PIC',      icon: ClipboardCheck },
    { id: 'sources',      label: 'Sensor Matrix',    icon: Database },
    { id: 'orchestrator', label: 'SPC Orchestrator', icon: Cpu },
  ];

  if (view === 'landing') {
    return <Landing onEnter={() => setView('dashboard')} onLogin={() => setView('login')} />;
  }

  if (view === 'login') {
    return <Login onLogin={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-eng-surface font-sans text-slate-300 eng-grid selection:bg-eng-info/30">
      <div className="fixed inset-0 bg-gradient-to-tr from-eng-info/5 via-transparent to-eng-info/5 pointer-events-none opacity-40" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.08),transparent)]" />

      {/* Nav */}
      <nav className="bg-eng-surface/80 backdrop-blur-2xl sticky top-0 z-[100] h-16 flex items-center px-10 border-b border-eng-border/50">
        <div className="flex items-center gap-4 mr-12 relative z-10">
          <div className="w-10 h-10 bg-eng-info rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-transform hover:rotate-3">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-xl tracking-tighter uppercase leading-none">effiPrecision</span>
            <span className="text-eng-info text-[9px] font-black tracking-[0.3em] uppercase mt-1">Metrology Node</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] relative h-16 px-6 transition-all flex items-center gap-2.5 group
                  ${activeTab === t.id ? 'text-white' : 'text-eng-text-muted hover:text-white'}`}>
                {Icon && <Icon className={`w-4 h-4 transition-colors ${activeTab === t.id ? 'text-eng-info' : 'group-hover:text-eng-info'}`} />}
                <span className="relative">
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div layoutId="nav-active" className="absolute -bottom-[21px] left-0 right-0 h-1 bg-eng-info shadow-[0_0_15px_rgba(139,92,246,0.8)] rounded-t-full" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-6 relative z-10">
          <div className="hidden xl:flex items-center gap-3 bg-eng-surface-light/50 border border-eng-border/50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-eng-pass animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Core Stable: 2.6.0</span>
          </div>
          <div className="bg-eng-info/20 border border-eng-info/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-eng-info" />
            <span className="text-[10px] font-bold text-eng-info tracking-widest uppercase">APOGEE 2026</span>
          </div>
        </div>
      </nav>

      {/* Control strip */}
      <div className="bg-eng-surface-light/30 backdrop-blur-md border-b border-eng-border/30 h-12 px-10 flex items-center sticky top-16 z-50">
        <span className="text-eng-pass flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mr-6">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Sync Active
        </span>
        <div className="h-4 w-[1px] bg-eng-border/50 mr-6" />
        
        <div className="relative flex items-center group">
          <UserCheck className="w-4 h-4 text-eng-text-muted absolute left-0 group-hover:text-eng-info transition-colors" />
          <select className="appearance-none bg-transparent py-1 pl-6 pr-10 rounded font-bold text-xs text-white focus:outline-none cursor-pointer uppercase tracking-tight hover:text-eng-info transition-all"
            value={selectedEmail}
            onChange={e => { setSelectedEmail(e.target.value); runEval(e.target.value); }}>
            {employees.map(e => <option key={e.email} value={e.email} className="bg-eng-surface text-white">{e.name} — {e.role}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-eng-text-muted absolute right-2 pointer-events-none opacity-50" />
        </div>
        
        <div className="ml-auto flex items-center gap-6 text-[10px] font-mono font-bold uppercase tracking-[0.1em]">
          {isSyncing
            ? <span className="text-eng-info flex items-center gap-2 animate-pulse"><Zap className="w-3.5 h-3.5" /> RE-CALIBRATING SENSORS...</span>
            : <span className="text-eng-text-muted/60">Ledger: 0x8F92...B31D</span>}
          <button onClick={() => runEval(selectedEmail)} className="bg-eng-info/10 border border-eng-info/30 text-eng-info px-4 py-1.5 rounded-full text-[10px] hover:bg-eng-info hover:text-white transition-all active:scale-95 font-bold">
            FORCE SCAN
          </button>
        </div>
      </div>

      <main className="max-w-[1700px] mx-auto p-10 space-y-16 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group">
           <div className="absolute -inset-1 bg-eng-info/5 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
           <BrainTerminal />
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, scale: 0.99, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.99, y: -10 }} className="space-y-12">
              <SectionHeader icon={Activity} title={`${selEmp?.name || 'Subject'} // Inspection Floor`} subtitle="Live telemetry analysis cross-fusing multi-agent evidence loops in real-time." />
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-8 space-y-10">
                  <div className="grid grid-cols-1 gap-6">
                    {biasFlag && (
                      <EngCard icon={AlertTriangle} className="border-eng-accent/20 bg-eng-accent/[0.03]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-extrabold text-sm text-white uppercase tracking-tight">Bias Neutralizer — Rating Divergence</h3>
                          <StatusBadge type="warn" label="±1.2σ DRIFT" />
                        </div>
                        <p className="text-eng-text-muted text-[13px] leading-relaxed italic">Manager draft rating diverges from Objective score. Gage R&R recommended.</p>
                      </EngCard>
                    )}
                    {ewsTriggered && (
                      <EngCard icon={ShieldAlert} className="border-eng-fail/20 bg-eng-fail/[0.03]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-extrabold text-sm text-white uppercase tracking-tight">Early Warning System</h3>
                          <StatusBadge type="fail" label="EWS ACTIVE" />
                        </div>
                        <p className="text-eng-text-muted text-[13px] leading-relaxed italic">Multi-signal basket triggered: Sentiment drift and Jira velocity decay.</p>
                      </EngCard>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Ticket Flow', val: jiraEv.tickets_completed || '—', sub: `${jiraEv.p1_tickets_resolved ?? 0} P1 fix`, src: 'Jira' },
                      { label: 'PR Lead Time', val: githubEv.prs_merged || '—', sub: `${githubEv.review_turnaround_hrs ?? 0}hr turn`, src: 'GitHub' },
                      { label: 'Knowledge Base', val: confEv.invisible_work_score || '—', sub: `${confEv.docs_referenced_by_peers ?? 0} peer refs`, src: 'Confluence' },
                      { label: 'Catalyst Factor', val: slackBench.team_catalyst_score || '—', sub: slackBench.classification || 'Nominal', src: 'Slack' },
                    ].map(k => (
                      <EngCard key={k.label} noPadding className="group/kpi hover:bg-white/[0.02]">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-eng-text-muted uppercase tracking-[0.2em]">{k.label}</span>
                            <SourceBadge source={k.src} />
                          </div>
                          <div className="text-4xl font-mono font-bold text-white mb-3 group-hover/kpi:text-eng-info transition-colors">{k.val}</div>
                          <div className="text-[10px] text-eng-text-muted font-bold uppercase tracking-widest opacity-60 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-700" />{k.sub}</div>
                        </div>
                      </EngCard>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <EngCard title="Cadence Stability Index" icon={TrendingUp}>
                      <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={velocityTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="w" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <RTooltip cursor={{fill: 'rgba(139, 92, 246, 0.05)'}} contentStyle={{ backgroundColor: '#0f0f12', border: '1px solid #1e1e24', borderRadius: '12px' }} />
                            <Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={36} fillOpacity={0.9} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </EngCard>
                    <EngCard title="Mission Progress Matrix" icon={Target}>
                      <div className="space-y-6 mt-4">
                        {goals.slice(0, 4).map(g => (
                          <div key={g.id} className="space-y-2.5">
                            <div className="flex items-center justify-between"><span className="text-xs font-bold text-white uppercase tracking-tight">{g.title}</span><span className={`text-[9px] font-black px-2 py-0.5 rounded border ${g.status === 'Completed' ? 'bg-eng-pass/10 text-eng-pass border-eng-pass/20' : 'bg-eng-info/10 text-eng-info border-eng-info/20'}`}>{g.status.toUpperCase()}</span></div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-1.5 bg-eng-border rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${g.completion}%` }} className={`h-full shadow-[0_0_10px_rgba(45,212,191,0.5)] ${g.status === 'Completed' ? 'bg-eng-pass' : 'bg-eng-info'}`} /></div>
                              <span className="font-mono text-[10px] font-bold text-eng-text-muted">{g.completion}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </EngCard>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 space-y-10">
                  <EngCard title="Fusion Orbits" icon={Cpu} className="bg-eng-surface-light/20">
                    <div className="flex justify-between items-center mb-10"><div className="text-5xl font-mono font-black text-white glow-text">{ops}<span className="text-eng-text-muted text-lg font-sans">/5.0</span></div><StatusBadge type={ewsTriggered ? "fail" : "pass"} label={classification} /></div>
                    <div className="h-72 -mx-5 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><RadarChart outerRadius="80%" data={radarData}><PolarGrid stroke="#1e1e24" /><PolarAngleAxis dataKey="subject" /><Radar name={selEmp?.name} dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.15} /></RadarChart></ResponsiveContainer></div>
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-eng-border/50">
                      <div className="text-center">
                        <div className="text-[9px] text-eng-text-muted uppercase font-black mb-1.5 tracking-widest">Confidence</div>
                        <div className="text-lg font-mono font-bold text-eng-pass">{evalData ? '98.4%' : '—'}</div>
                      </div>
                      <div className="text-center border-l border-eng-border/50">
                        <div className="text-[9px] text-eng-text-muted uppercase font-black mb-1.5 tracking-widest">Bias Risk</div>
                        <div className="text-lg font-mono font-bold text-eng-accent">{biasFlag ? 'MODERATE' : evalData ? 'LOW' : '—'}</div>
                      </div>
                    </div>
                  </EngCard>
                  <EngCard title="Agentic Summary" icon={Info} className="border-eng-info/20 bg-eng-info/[0.03]">
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                      {evalData?.final_review 
                        ? evalData.final_review.split('\n').find(l => l.includes('Narrative & Achievements'))?.split(':')[1]?.trim() || "Consensus established: performance is consistent with level expectations."
                        : isAditya ? "Subject demonstrates L5-grade technical performance with high ambient mentorship records." : "Nominal performance detected across 5 active data loops. Precision-grade throughput maintained."}
                    </p>
                  </EngCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div key="comparison" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              <SectionHeader icon={Sliders} title="Resilience Simulator" subtitle="Global calibration of LMC (Least Material Condition) adjustments." />
              <LMCsimulator 
                initialHeadcount={0.8} 
                actual={jiraEv.tickets_completed || 10} 
                target={jiraEv.tickets_completed ? Math.round(jiraEv.tickets_completed * 1.2) : 15}
                employeeName={selEmp?.name}
              />
            </motion.div>
          )}

          {activeTab === 'benchmarking' && (
            <motion.div key="benchmarking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
               <EngCard noPadding className="bg-eng-info/[0.03] border-eng-info/20 shadow-none"><div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-10"><div><h3 className="text-white font-extrabold text-2xl flex items-center gap-4"><div className="w-1.5 h-8 bg-eng-info rounded-full" />CROSS-SENSOR DUEL</h3><p className="text-eng-text-muted text-xs mt-2 uppercase tracking-[0.3em] font-black opacity-40">Multi-agent head-to-head deliberation</p></div><div className="flex items-center gap-6 bg-eng-surface border border-eng-border p-5 rounded-2xl hardware-corner"><span className="text-[10px] font-black text-eng-text-muted uppercase tracking-widest">TARGET OBJECTIVE</span><div className="relative"><select className="appearance-none bg-eng-surface-light border border-eng-border/50 text-white py-2.5 pl-5 pr-12 rounded-xl font-bold text-xs focus:ring-2 focus:ring-eng-info cursor-pointer outline-none transition-all uppercase tracking-tight" value={comparisonEmail} onChange={e => setComparisonEmail(e.target.value)}><option value="">SELECT OPPONENT...</option>{employees.filter(e => e.email !== selectedEmail).map(e => (<option key={e.email} value={e.email}>{e.name}</option>))}</select><ChevronDown className="w-4 h-4 text-eng-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" /></div></div></div></EngCard>
               {comparisonEmail ? (
                 <div className="grid grid-cols-12 gap-10">
                   <div className="col-span-12 lg:col-span-8">
                     <EngCard noPadding title="Comparative Metrics Matrix" icon={Activity}>
                       <div className="overflow-x-auto">
                         <table className="w-full text-left">
                           <thead>
                             <tr className="bg-eng-surface-light/50 border-b border-eng-border font-mono text-[10px] text-eng-text-muted uppercase tracking-[0.3em]">
                               <th className="p-6 font-black">Inspection Point</th>
                               <th className="p-6 font-black">{selEmp?.name}</th>
                               <th className="p-6 font-black">{employees.find(e => e.email === comparisonEmail)?.name}</th>
                               <th className="p-6 font-black text-center">Delta %</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-eng-border/50">
                             {[
                               { 
                                 label: 'Ticket Flow', 
                                 a: jiraEv.tickets_completed || 0, 
                                 b: employees.find(e => e.email === comparisonEmail)?.email === 'riya@effihr.mock' ? 5 : (employees.find(e => e.email === comparisonEmail)?.email === 'priya@effihr.mock' ? 22 : 14), 
                                 u: ' pts' 
                               },
                               { 
                                 label: 'Goal Progress', 
                                 a: hrmsEv.goal_completion_pct || 0, 
                                 b: employees.find(e => e.email === comparisonEmail)?.hrms?.current_cycle_goal_completion_pct || 0, 
                                 u: '%' 
                               },
                               { 
                                 label: 'Ambient Impact', 
                                 a: fused.sensor_c_score || 0, 
                                 b: employees.find(e => e.email === comparisonEmail)?.email === 'riya@effihr.mock' ? 21 : (employees.find(e => e.email === comparisonEmail)?.email === 'priya@effihr.mock' ? 98 : 75), 
                                 u: '%' 
                               }
                             ].map(row => {
                               const delta = row.a - row.b;
                               const better = delta > 0;
                               const pct = row.b ? Math.abs(Math.round((delta / row.b) * 100)) : 0;
                               return (
                                 <tr key={row.label} className="group hover:bg-white/[0.01] transition-colors">
                                   <td className="p-6 font-bold text-[13px] text-white uppercase tracking-tight">{row.label}</td>
                                   <td className={`p-6 font-mono text-sm ${better ? 'text-eng-pass' : 'text-slate-500'}`}>{row.a}{row.u}</td>
                                   <td className={`p-6 font-mono text-sm ${!better ? 'text-eng-pass' : 'text-slate-500'}`}>{row.b}{row.u}</td>
                                   <td className="p-6">
                                     <div className={`mx-auto w-24 px-3 py-2 rounded-xl border flex items-center justify-center gap-2 text-[11px] font-black ${better ? 'bg-eng-pass/10 text-eng-pass border-eng-pass/20' : 'bg-eng-fail/5 text-eng-fail border-eng-fail/10'}`}>
                                       {better ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                       {pct}%
                                     </div>
                                   </td>
                                 </tr>
                               )
                             })}
                           </tbody>
                         </table>
                       </div>
                     </EngCard>
                   </div>
                   <div className="col-span-12 lg:col-span-4">
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                       <EngCard title="Council Verdict" icon={Users} className="h-full">
                         <div className="space-y-8">
                           <div className="p-5 bg-eng-info/5 border border-eng-info/10 rounded-2xl hardware-corner">
                             <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                               "Agentic fusion confirmed: <span className="text-white font-extrabold mx-1">{selEmp?.name}</span> maintains higher relative {fused.sensor_a_score > 50 ? 'output throughput' : 'collaboration density'}."
                             </p>
                           </div>
                           <div className="bg-eng-surface-light/40 border border-eng-border p-6 rounded-3xl flex items-center justify-between">
                             <div>
                               <div className="text-[10px] font-black text-eng-info uppercase tracking-[0.2em] mb-1.5">Promotion Target</div>
                               <div className="text-xl font-extrabold text-white">{fused.ops_objective_score > 4 ? selEmp?.name : 'Calibration Required'}</div>
                             </div>
                             <Sparkles className="w-8 h-8 text-eng-info animate-pulse" />
                           </div>
                         </div>
                       </EngCard>
                     </motion.div>
                   </div>
                 </div>
               ) : (
                 <EngCard className="border-dashed border-2 py-40 text-center bg-eng-surface-light/[0.02]"><div className="w-20 h-20 bg-eng-border/10 rounded-full flex items-center justify-center mx-auto mb-8"><Users className="w-10 h-10 text-eng-border opacity-30" /></div><h3 className="text-2xl font-black text-eng-text-muted uppercase tracking-[0.3em] opacity-30">READY FOR DUEL</h3></EngCard>
               )}
            </motion.div>
          )}

          {activeTab === 'pic' && (
            <motion.div key="pic" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <SectionHeader icon={ClipboardCheck} title="PIC Generation Node" subtitle="Legally-defensible ISO 1101 certification." />
              <PICreport 
                employee={selEmp} 
                evalData={evalData}
              />
            </motion.div>
          )}

          {activeTab === 'sources' && (
            <motion.div key="sources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
               <SectionHeader icon={Database} title="Sensor Matrix" subtitle="Evidence ingestion from 5 calibrated channels." />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {Object.entries(SOURCE_META).map(([key, meta]) => {
                   const sourceData = evalData?.evidence?.[key.toLowerCase()];
                   const status = sourceData?.connection_status || 'Disconnected';
                   const isConnected = status.includes('Connected');
                   
                   return (
                     <EngCard key={key} title={meta.label} icon={meta.icon} className="group/src">
                       <div className="space-y-6 mt-2">
                         <div className="flex items-center justify-between py-2 border-b border-eng-border/30 text-[10px] font-mono">
                           <span className="text-eng-text-muted">SYNC_ID:</span>
                           <span className="text-eng-pass font-bold tracking-widest">{key.toUpperCase()}</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-eng-text-muted uppercase">Health</span>
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-eng-pass animate-pulse' : 'bg-eng-fail'}`} />
                               <span className={`text-[10px] font-bold ${isConnected ? 'text-eng-pass' : 'text-eng-fail'}`}>{status.toUpperCase()}</span>
                            </div>
                         </div>
                         <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                            <div className="text-[9px] text-eng-text-muted uppercase font-black mb-1 opacity-40">Primary Signal</div>
                            <div className="text-[12px] text-white font-mono font-bold">
                               {key === 'Jira' && `${jiraEv.tickets_completed ?? 0} Tickets | ${jiraEv.p1_tickets_resolved ?? 0} P1`}
                               {key === 'GitHub' && `${githubEv.prs_merged ?? 0} Merged PRs | ${githubEv.commits ?? 0} Commits`}
                               {key === 'Slack' && `Catalyst Score: ${slackBench.team_catalyst_score ?? 0}`}
                               {key === 'Confluence' && `Peer Refs: ${confEv.docs_referenced_by_peers ?? 0}`}
                               {key === 'HRMS' && `Attendance: ${hrmsEv.attendance_pct ?? 0}%`}
                            </div>
                         </div>
                         <div className="text-[11px] text-slate-400 font-medium leading-relaxed italic opacity-60 group-hover/src:opacity-100 transition-opacity">
                           {meta.desc}
                         </div>
                       </div>
                     </EngCard>
                   );
                 })}
               </div>
            </motion.div>
          )}

          {activeTab === 'orchestrator' && (
            <motion.div key="orchestrator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
               <SectionHeader icon={Cpu} title="Orchestrator Mainframe" subtitle="Statistical calibration of organizational drift." />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: Sliders, color: 'info', title: 'Subject Cpk Index', val: fused.ops_objective_score ? (fused.ops_objective_score / 3.5).toFixed(2) : '1.34' }, 
                    { icon: ShieldAlert, color: 'warn', title: 'Calibration Flags', val: biasFlag ? '1' : '0' }, 
                    { icon: CheckCircle2, color: 'pass', title: 'EWS Units Active', val: ewsTriggered ? '1' : '0' }
                  ].map(c => (
                    <EngCard key={c.title} title={c.title} icon={c.icon}><div className="text-4xl font-mono font-black text-white mb-2 tracking-tighter">{c.val}</div></EngCard>
                  ))}
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <EngCard title="Historical Calibration Control" icon={Activity}>
                    <div className="h-72 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={(hrmsEv.past_cycles || []).map(c => ({ q: c.cycle, r: c.final_rating }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e24" />
                          <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <YAxis domain={[1, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <RTooltip contentStyle={{ backgroundColor: '#0f0f12', border: '1px solid #1e1e24', borderRadius: '12px' }} />
                          <Line type="monotone" dataKey="r" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#0f0f12' }} activeDot={{ r: 8, fill: '#2dd4bf' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </EngCard>
                  <EngCard title="Human Scrap ROI" icon={DollarSign} className="border-eng-pass/20 bg-eng-pass/[0.02]">
                    <div className="space-y-10 mt-4">
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-eng-text-muted uppercase tracking-[0.2em]">Organization Headcount</label>
                          <input type="range" min="50" max="1000" step="10" value={roiHeadcount} onChange={e => setRoiHeadcount(+e.target.value)} className="w-full h-1 bg-eng-border rounded-full appearance-none accent-eng-pass" />
                          <div className="text-2xl font-mono font-black text-white">{roiHeadcount}</div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-eng-text-muted uppercase tracking-[0.2em]">Industry Attrition</label>
                          <input type="range" min="5" max="40" step="1" value={roiAttrition} onChange={e => setRoiAttrition(+e.target.value)} className="w-full h-1 bg-eng-border rounded-full appearance-none accent-eng-pass" />
                          <div className="text-2xl font-mono font-black text-white">{roiAttrition}%</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-t border-eng-border/50 pt-10">
                        <div className="text-center">
                          <div className="text-[9px] text-eng-text-muted font-black uppercase mb-2 tracking-widest">Calibration Dividend</div>
                          <div className="text-2xl font-mono font-black text-eng-pass">₹{dividend}L</div>
                        </div>
                        <div className="text-center border-l border-eng-border/50">
                          <div className="text-[9px] text-eng-text-muted font-black uppercase mb-2 tracking-widest">Scrap Rate Saved</div>
                          <div className="text-2xl font-mono font-black text-white">{humanScrap} FTE</div>
                        </div>
                        <div className="text-center border-l border-eng-border/50">
                          <div className="text-[9px] text-eng-text-muted font-black uppercase mb-2 tracking-widest">Total Cost Saved</div>
                          <div className="text-2xl font-mono font-black text-white">₹{scrapCost}L</div>
                        </div>
                      </div>
                    </div>
                  </EngCard>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Chat FAB */}
      <div className="fixed bottom-14 right-10 z-[200] flex flex-col items-end gap-6">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="w-[450px] glass-panel rounded-[32px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-eng-info/30 overflow-hidden flex flex-col hardware-corner">
              <div className="p-6 bg-eng-info/10 border-b border-white/5 flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-eng-info/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]"><Bot className="w-6 h-6 text-eng-info" /></div><div><h4 className="text-white font-extrabold text-sm tracking-tight">ARBITER v4.0</h4></div></div><button onClick={() => setIsChatOpen(false)} className="text-eng-text-muted hover:text-white transition-colors p-2"><X className="w-5 h-5" /></button></div>
              <div className="h-[450px] p-8 overflow-y-auto flex flex-col gap-6 bg-eng-surface/40 scrollbar-hide">{chatMessages.map((m, i) => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-5 text-[12px] rounded-3xl ${m.role === 'user' ? 'bg-eng-info text-white rounded-tr-sm' : 'bg-eng-surface-light border border-white/5 text-slate-200 rounded-tl-sm shadow-lg'}`}>{m.text}</div></motion.div>))}<div ref={chatEndRef} /></div>
              <form onSubmit={handleChat} className="p-6 bg-eng-surface-light/80 border-t border-white/5 flex gap-4"><input type="text" placeholder="Query agentic ledger..." value={chatInput} onChange={e => setChatInput(e.target.value)} className="bg-eng-surface/50 border border-white/10 text-white text-xs font-semibold rounded-2xl px-5 py-4 flex-1 focus:outline-none" /><button type="submit" className="bg-eng-info text-white p-4 rounded-2xl active:scale-95"><Send className="w-5 h-5" /></button></form>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="group relative outline-none"><div className="absolute inset-0 bg-eng-info rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" /><motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`w-20 h-20 rounded-full shadow-2xl flex items-center justify-center relative border-2 border-white/10 z-10 ${isChatOpen ? 'bg-eng-surface-light' : 'bg-eng-info'}`}>{isChatOpen ? <X className="text-white w-8 h-8" /> : <Bot className="text-white w-8 h-8" />}</motion.div></button>
      </div>

      {/* Hardware Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-eng-surface/95 backdrop-blur-3xl border-t border-eng-border px-10 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-eng-text-muted z-[150] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-eng-pass animate-pulse" />NODE_71 // STATUS: NOMINAL</div>
          <div className="hidden md:flex items-center gap-3">SYNC_LINK: ACTIVE_5_SOURCE</div>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-8 border-l border-eng-border pl-10 h-10"><span className="text-eng-info font-black">CPU_UTIL: 12.8%</span></div>
          <div className="text-white bg-eng-info/20 px-6 h-10 flex items-center border-l border-eng-border font-black tracking-[0.2em] shadow-inner uppercase">effiPrecision v2.6 // APOGEE CORE</div>
        </div>
      </div>
    </div>
  );
}
