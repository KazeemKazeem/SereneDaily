
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../App';
import { dbService } from '../services/db';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    try {
      // Direct login for immediate response
      const user = await dbService.login(email);
      setUser(user);
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 max-w-md mx-auto transition-colors duration-300">
      <div className="w-20 h-20 bg-indigo-600 rounded-[28px] shadow-2xl flex items-center justify-center mb-8 rotate-12">
        <ArrowRight size={40} className="text-white -rotate-45" />
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-lexend font-black text-slate-900 dark:text-slate-100 mb-2">SereneDaily</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Your calm space for daily reflection.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="email" 
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 rounded-[24px] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm text-slate-900 dark:text-slate-100"
          />
        </div>
        
        <div className="relative">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="password" 
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 rounded-[24px] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm text-slate-900 dark:text-slate-100"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-bold text-sm shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
        >
          {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <div className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
          <span>Sync across devices</span>
          <div className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
