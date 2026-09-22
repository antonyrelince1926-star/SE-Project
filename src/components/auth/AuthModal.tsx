import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  Shield,
  User,
  Sparkles,
  Lock,
  Mail,
  UserPlus,
  LogIn,
  CheckCircle2,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Activity,
  FileCheck2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialTab?: 'signin' | 'register' | 'profiles';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
}) => {
  const { login, register, switchRole, user } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register' | 'profiles'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await login(email, password);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMessage('Please fill in your name and email');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await register(name, email, password);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = async (role: 'USER' | 'ADMIN', profileEmail?: string) => {
    setLoading(true);
    try {
      await switchRole(role, profileEmail);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMessage('Failed to activate profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Brand Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
                  DopamineFlow
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">
                    SaaS v2.4
                  </span>
                </h1>
                <p className="text-xs text-indigo-100/90 font-medium">
                  Evidence-Based Digital Well-Being & Dopamine Health Analytics
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="relative z-10 flex items-center gap-1 mt-6 p-1 rounded-xl bg-black/20 backdrop-blur-xs text-xs font-semibold">
            <button
              onClick={() => {
                setTab('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'signin'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setTab('profiles');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'profiles'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-indigo-100 hover:text-white'
              }`}
            >
              Verified Profiles
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-600 dark:text-rose-400">
              {errorMessage}
            </div>
          )}

          {/* Tab 1: Sign In */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@cit.edu.in or your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (optional for instant access)"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/30 disabled:opacity-60"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Workspace</span>
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  Quick Access: Use <span className="font-semibold text-indigo-600 dark:text-indigo-400">alex@cit.edu.in</span> (Member, 28-day streak) or <span className="font-semibold text-indigo-600 dark:text-indigo-400">admin@dopamineflow.io</span> (Administrator).
                </p>
              </div>
            </form>
          )}

          {/* Tab 2: Create Account */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jordan@company.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-start gap-2">
                <Flame className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Day 1 Streak Initialized:</strong> Registering automatically provisions your digital wellness telemetry baseline, default focus goals, and circadian trackers.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/30 disabled:opacity-60"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account & Launch Streak</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 3: Verified Profiles */}
          {tab === 'profiles' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select any verified organizational profile to log in immediately:
              </p>

              {/* Alex Rivera - Preserved High Streak Profile */}
              <div
                onClick={() => handleSelectProfile('USER', 'alex@cit.edu.in')}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex Rivera"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Alex Rivera
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        28-Day Streak
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      alex@cit.edu.in • Senior Engineering Member
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Dr. Elena Vance - Lead Administrator */}
              <div
                onClick={() => handleSelectProfile('ADMIN', 'admin@dopamineflow.io')}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="Dr. Elena Vance"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Dr. Elena Vance
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-purple-500" />
                        Lead Administrator
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      admin@dopamineflow.io • Clinical Governance & Org Management
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Sophia Chen */}
              <div
                onClick={() => handleSelectProfile('USER', 'sophia.c@metaverse.org')}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    alt="Sophia Chen"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Sophia Chen
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                        9-Day Streak
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      sophia.c@metaverse.org • Product Research Member
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          )}

          {/* Role Architecture Information Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Platform Role Architecture:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                  Member (User)
                </span>
                Personal habit logging, dopamine score calculus, continuous streaks, goals, and AI neuro-coaching.
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                  Administrator
                </span>
                Population health metrics, user provisioning, security audit logs, protocol broadcast, and policy enforcement.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        {onClose && user && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
