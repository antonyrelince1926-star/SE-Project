import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  TrendingUp,
  Brain,
  Target,
  History,
  FileBarChart2,
  BookOpen,
  Award,
  Settings,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Daily Tracker', icon: CalendarCheck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain, badge: 'AI' },
    { id: 'goals', label: 'Goals & Streaks', icon: Target },
    { id: 'history', label: 'Habit History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'tips', label: 'Neuroscience Tips', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'profile', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Main Platform
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation Section */}
        {user?.role === 'ADMIN' && (
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => setCurrentView('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentView === 'admin'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-rose-950/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className={`w-4 h-4 ${currentView === 'admin' ? 'text-white' : 'text-rose-400'}`} />
                  <span>Admin Dashboard</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  MGMT
                </span>
              </button>
            </nav>
          </div>
        )}

        {/* Quick Health Card In Sidebar */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-emerald-500/5 border border-indigo-500/10 dark:border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Live Neuro Sensor
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Dopamine baseline calculation engine synced with clinical telemetry.
          </p>
        </div>
      </div>
    </aside>
  );
};
