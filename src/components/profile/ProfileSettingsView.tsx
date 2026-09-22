import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Bell, Shield, Sliders, Save, CheckCircle } from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { user, updateProfile, showToast } = useAuth();

  const [name, setName] = useState<string>(user?.name || '');
  const [screenBudget, setScreenBudget] = useState<number>(user?.settings?.screenTimeBudget || 5.0);
  const [socialBudget, setSocialBudget] = useState<number>(user?.settings?.socialMediaBudget || 1.0);
  const [sleepTarget, setSleepTarget] = useState<number>(user?.settings?.sleepTarget || 7.5);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(user?.settings?.emailAlerts ?? true);
  const [dailyReminder, setDailyReminder] = useState<boolean>(user?.settings?.dailyReminder ?? true);
  const [dopamineAlerts, setDopamineAlerts] = useState<boolean>(user?.settings?.dopamineSpikeAlert ?? true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const currentSettings = user?.settings || {
        theme: 'dark' as const,
        notificationsEnabled: true,
        emailDigest: 'daily' as const,
        soundEnabled: true,
        dailyGoalReminderTime: '20:30',
      };

      const payload = {
        name,
        settings: {
          ...currentSettings,
          screenTimeBudget: Number(screenBudget),
          socialMediaBudget: Number(socialBudget),
          sleepTarget: Number(sleepTarget),
          emailAlerts,
          dailyReminder,
          dopamineSpikeAlert: dopamineAlerts,
        },
      };

      await updateProfile(payload);
      showToast('Profile and habit settings updated!', 'success');
    } catch (e: any) {
      showToast('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Neural Calibration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure your personal biometric boundaries, notification triggers, and neuro-budgeting parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Profile Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Personal Identity
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {user?.role} PRIVILEGES
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Account Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Biometric Budgets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" /> Biometric Habit Budgets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Screen Time Ceiling (Hours/Day)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={screenBudget}
                onChange={(e) => setScreenBudget(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Social Media Cap (Hours/Day)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="8"
                value={socialBudget}
                onChange={(e) => setSocialBudget(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Restorative Sleep Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="12"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Neural Notification Triggers */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" /> Notifications & Telemetry
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Dopamine Trough / Overstimulation Alerts
                </span>
                <span className="text-[11px] text-slate-500">
                  Notify me when logged screen time exceeds 5 hours or stimulation spikes.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dopamineAlerts}
                onChange={(e) => setDopamineAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Daily Habit Logging Reminder
                </span>
                <span className="text-[11px] text-slate-500">
                  Send a reminder at 8:30 PM to record daily screen and focus metrics.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dailyReminder}
                onChange={(e) => setDailyReminder(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Weekly Executive Email Digest
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive a weekly clinical summary of dopamine recovery progress.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-98 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Habit Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
