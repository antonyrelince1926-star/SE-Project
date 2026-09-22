import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  Shield,
  User,
  Flame,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface AccountOption {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar: string;
  streak: number;
  description: string;
}

const ACCOUNTS: AccountOption[] = [
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    streak: 28,
    description: 'Personal dopamine scores, habit logging, 28-day active streak, and AI neuroscience protocols.',
  },
  {
    id: 'usr_admin',
    name: 'Dr. Elena Vance',
    email: 'admin@dopamineflow.io',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    streak: 14,
    description: 'Executive governance, security audit logs, user promotion & platform controls.',
  },
  {
    id: 'usr_sophia',
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    streak: 9,
    description: 'Engineering focus habits, social media detox milestones, and daily tracking.',
  },
];

export const SignedOutView: React.FC = () => {
  const { login } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'register' | 'profiles'>('signin');
  const [signingInId, setSigningInId] = useState<string | null>(null);

  const openAuth = (tab: 'signin' | 'register' | 'profiles') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleQuickSignIn = async (account: AccountOption) => {
    try {
      setSigningInId(account.id);
      await login(account.email, 'password123');
    } catch (e) {
      // Fallback
    } finally {
      setSigningInId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Hero Welcome Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mx-auto flex items-center justify-center mb-4 text-indigo-300">
          <Brain className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome to DopamineFlow
        </h2>
        <p className="text-sm text-indigo-200/80 max-w-xl mx-auto mt-2 leading-relaxed">
          You are currently signed out. Select an active profile below to enter directly, or authenticate to resume tracking your digital well-being telemetry.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuth('signin')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Password</span>
          </button>
          <button
            onClick={() => openAuth('register')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Account</span>
          </button>
        </div>
      </div>

      {/* Instant Profile Switcher Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Instant Account Access
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any profile to immediately sign in and resume tracking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACCOUNTS.map((account) => {
            const isAdmin = account.role === 'ADMIN';
            const isSigningIn = signingInId === account.id;
            return (
              <div
                key={account.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAdmin
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {isAdmin ? 'ADMINISTRATOR' : 'MEMBER'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {account.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {account.email}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{account.streak} Day Active Streak</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {account.description}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickSignIn(account)}
                  disabled={isSigningIn}
                  className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isAdmin
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                  } ${isSigningIn ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <span>{isSigningIn ? 'Authenticating...' : `Sign In as ${account.name.split(' ')[0]}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Explanation Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <Shield className="w-4 h-4 text-indigo-500" />
          <span>Understanding Roles in DopamineFlow</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide text-[10px]">
              Member Role
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed for individual habit optimization. Members log daily digital habits, track active streaks, view personalized AI dopamine recommendations, and customize personal goals.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide text-[10px]">
              Administrator Role
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed for organizational wellness leaders and security officers. Admins oversee aggregate well-being metrics, manage user lifecycle & promotions, review SOC2/HIPAA audit trails, and broadcast platform alerts.
            </p>
          </div>
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
