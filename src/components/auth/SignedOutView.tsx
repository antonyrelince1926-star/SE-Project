import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  Flame,
  ArrowRight,
  UserPlus,
  LogIn,
  Sparkles,
  Target,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const SignedOutView: React.FC = () => {
  const { login } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const openAuth = (tab: 'signin' | 'register') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleQuickDemoSignIn = async () => {
    try {
      setIsSigningIn(true);
      await login('alex@cit.edu.in', 'password123');
    } catch (e) {
      // Fallback
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      {/* Hero Welcome Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mx-auto flex items-center justify-center mb-5 text-indigo-300">
          <Brain className="w-9 h-9 text-indigo-400" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Welcome to DopamineFlow
        </h2>
        <p className="text-sm text-indigo-200/80 max-w-xl mx-auto mt-3 leading-relaxed">
          Your personal neuroscience-backed habit intelligence platform. Track your daily digital stimulus, maintain active streaks, and receive personalized dopamine baseline protocols.
        </p>

        {/* Quick Launch Demo Card */}
        <div className="mt-8 max-w-md mx-auto p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Alex Rivera"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-400/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Alex Rivera</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                  30d Streak
                </span>
              </div>
              <p className="text-xs text-indigo-200/70">Personal Active Workspace</p>
            </div>
          </div>
          <button
            onClick={handleQuickDemoSignIn}
            disabled={isSigningIn}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
          >
            <span>{isSigningIn ? 'Entering...' : 'Enter App'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuth('signin')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span>Sign In with Email</span>
          </button>
          <button
            onClick={() => openAuth('register')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Create New Account</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Habit Streaks</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Build consistency milestones without guilt. Track daily log continuity with automatic streak protection.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dopamine Baseline</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Real-time algorithmic scoring calculated from screen time, deep work, sleep quality, and physical movement.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Recommendations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Circadian biology protocols and actionable neuroscience routines tailored to your personal daily patterns.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authTab}
      />
    </div>
  );
};
