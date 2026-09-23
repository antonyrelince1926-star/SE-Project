import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  Sun,
  Moon,
  Bell,
  Check,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  Compass,
  Flame,
  ArrowRightLeft,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { api } from '../../services/api';
import { AuthModal } from '../auth/AuthModal';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openDailyTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openDailyTracker,
}) => {
  const { user, theme, toggleTheme, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register'>('signin');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const { notifications: notifs } = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.warn('Failed to load notifications');
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAuth = (tab: 'signin' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    setShowProfileMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-slate-100 bg-clip-text text-transparent">
                    DopamineFlow
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    SaaS Platform
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Digital Well-Being & Habit Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Action Controls & Navigation Shortcuts */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {user ? (
              <>
                {/* Active User Streak Pill */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400"
                  title="Current Active Daily Consistency Streak"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{user.streak ?? 1}d Streak</span>
                </div>

                {/* Quick Action: Log Habits */}
                <button
                  onClick={openDailyTracker}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Log Habit</span>
                </button>
              </>
            ) : (
              <>
                {/* Logged-Out Quick Auth Actions */}
                <button
                  onClick={() => handleOpenAuth('signin')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleOpenAuth('register')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </>
            )}

            {/* Landing Page Preview toggle */}
            <button
              onClick={() => setCurrentView('landing')}
              className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                currentView === 'landing' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40' : ''
              }`}
              title="View Public Landing Page"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No notifications at this time
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                              !notif.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(notif.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Menu */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Personal Account
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          {user.streak ?? 1}d Streak
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile & Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          await logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of DopamineFlow</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleOpenAuth('signin')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
};

