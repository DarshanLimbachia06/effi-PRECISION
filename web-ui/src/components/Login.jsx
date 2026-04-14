import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, User, ArrowRight, Cpu, Zap, AlertCircle } from 'lucide-react';

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock Login Logic
    setTimeout(() => {
      if (email && password) {
        onLogin();
      } else {
        setError('Invalid Auth Credentials. Check Metrology Node identity.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-eng-surface flex items-center justify-center p-6 eng-grid">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.1),transparent)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-eng-info rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(139,92,246,0.5)]"
          >
            <Cpu className="text-white w-10 h-10" />
          </motion.div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-3">Arbiter Access</h2>
          <p className="text-eng-text-muted font-bold text-[11px] uppercase tracking-[0.4em] opacity-60">Authentication Required // Node_71</p>
        </div>

        <div className="glass-panel hardware-corner p-12 rounded-[40px] border border-white/5 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-eng-info/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-eng-info uppercase tracking-[0.3em] ml-1">Personnel ID</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-eng-text-muted group-focus-within:text-eng-info transition-colors" />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr_manager_01"
                  className="w-full bg-eng-surface-light border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-eng-info/40 transition-all placeholder:opacity-30"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-eng-info uppercase tracking-[0.3em] ml-1">Encrypted Key</label>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-eng-text-muted group-focus-within:text-eng-info transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-eng-surface-light border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-eng-info/40 transition-all placeholder:opacity-30"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 bg-eng-fail/10 border border-eng-fail/20 rounded-xl text-eng-fail text-[11px] font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-eng-info hover:bg-eng-info/90 text-white font-black uppercase tracking-[0.3em] text-sm py-6 rounded-2xl shadow-[0_20px_40px_rgba(139,92,246,0.3)] transition-all active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Establish Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6 text-center">
             <div className="flex items-center justify-center gap-10 opacity-30">
                <Shield className="w-5 h-5 text-eng-info" />
                <Zap className="w-5 h-5 text-eng-info" />
                <Cpu className="w-5 h-5 text-eng-info" />
             </div>
             <p className="text-[9px] text-eng-text-muted font-black uppercase tracking-[0.5em]">ISO 27001 Secure Node</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
