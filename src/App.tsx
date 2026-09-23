import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { HealthHeroCard } from './components/dashboard/HealthHeroCard';
import { MetricStatCards } from './components/dashboard/MetricStatCards';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { GoalsView } from './components/goals/GoalsView';
import { HistoryView } from './components/history/HistoryView';
import { ReportsView } from './components/reports/ReportsView';
import { NeuroscienceTipsView } from './components/tips/NeuroscienceTipsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { LandingView } from './components/landing/LandingView';
import { SignedOutView } from './components/auth/SignedOutView';
import { DailyTrackerModal } from './components/tracker/DailyTrackerModal';
import { Modal } from './components/common/Modal';
import { api } from './services/api';
import { DailyEntry, Goal, Recommendation } from './types';
import { calculateHabitScores } from './lib/dopamine-calculator';
import {
  CalendarCheck,
  TrendingUp,
  Brain,
  Shield,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Flame,
  Award,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isDailyTrackerOpen, setIsDailyTrackerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user data on startup
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [entriesRes, goalsRes, recsRes] = await Promise.all([
        api.getEntries(),
        api.getGoals(),
        api.getRecommendations(),
      ]);
      setEntries(entriesRes.entries);
      setGoals(goalsRes.goals);
      setRecommendations(recsRes.recommendations);
    } catch (e) {
      console.warn('Using baseline state');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  // Derived current metrics and active streak
  const latestEntry = entries[0];
  const activeStreak = user?.streak !== undefined ? user.streak : (entries.length > 0 ? entries.length : 1);
  const currentScores =
    latestEntry?.scores ||
    calculateHabitScores({
      screenTimeHours: 4.5,
      socialMediaHours: 1.2,
      gamingHours: 0,
      studyHours: 3.0,
      workHours: 5.5,
      sleepHours: 7.5,
      exerciseMinutes: 30,
      meditationMinutes: 10,
      waterIntakeLiters: 2.5,
      mood: 4,
    });

  const handleEntryLogged = async (newEntry: DailyEntry) => {
    setEntries((prev) => [newEntry, ...prev.filter((e) => e.date !== newEntry.date)]);
    setIsDailyTrackerOpen(false);
    if (refreshUser) {
      try {
        await refreshUser();
      } catch (e) {
        console.error('Failed to refresh user profile streak', e);
      }
    }
    // Refresh goals and recommendations
    try {
      const [goalsRes, recsRes] = await Promise.all([
        api.getGoals(),
        api.getRecommendations(),
      ]);
      setGoals(goalsRes.goals);
      setRecommendations(recsRes.recommendations);
    } catch (e) {
      console.error('Failed to refresh goals/recs', e);
    }
  };

  if (currentView === 'landing') {
    return <LandingView onEnterApp={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openDailyTracker={() => setIsDailyTrackerOpen(true)}
      />

      {/* Main Workspace with Sidebar and View Router */}
      <div className="max-w-7xl w-full mx-auto flex flex-1">
        {/* Persistent Responsive Sidebar */}
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                Calibrating Digital Well-Being Telemetry...
              </p>
            </div>
          ) : !user ? (
            <SignedOutView />
          ) : (
            <>
              {/* VIEW: DASHBOARD */}
              {currentView === 'dashboard' && (
                <div className="space-y-6">
                  {/* Hero Health Gauge Card */}
                  <HealthHeroCard
                    scores={currentScores}
                    latestDate={latestEntry?.date || new Date().toISOString().split('T')[0]}
                    onOpenTracker={() => setIsDailyTrackerOpen(true)}
                    streak={activeStreak}
                  />

                  {/* 5 Pillar Metric Cards with Active Habit Streak */}
                  <MetricStatCards latestEntry={latestEntry} currentStreak={activeStreak} />

                  {/* Active Streak Motivation & Milestone Tracker */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Active Consistency: {activeStreak} Consecutive Days
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                            🔥 Live Streak
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {activeStreak >= 30
                            ? 'Elite 30+ Day Habit Formator. Your synaptic pathways are fully stabilized.'
                            : activeStreak >= 21
                            ? `Only ${30 - activeStreak} days until the 30-Day Circadian & Dopamine Mastery milestone!`
                            : activeStreak >= 14
                            ? `Only ${21 - activeStreak} days until the 21-Day Neuro-Plasticity milestone!`
                            : activeStreak >= 7
                            ? `Only ${14 - activeStreak} days until the 14-Day Neuro-Sync milestone!`
                            : activeStreak >= 3
                            ? `Great momentum! Only ${7 - activeStreak} days until the 7-Day Week Warrior milestone!`
                            : activeStreak === 1
                            ? 'Day 1 baseline recorded! Log tomorrow to reach a 2-day streak and start compounding habits.'
                            : 'Log today’s habits to initiate your active streak.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setCurrentView('achievements')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View {activeStreak}d Achievements</span>
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Quick Visualizers */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Biometric Correlation Snapshot */}
                    <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                            Biometric Correlation Snapshot
                          </h3>
                          <p className="text-xs text-slate-400">
                            {entries.length === 1
                              ? 'Day 1 baseline telemetry recorded. Track daily to view your multi-day correlation trajectory.'
                              : 'Trajectory of dopamine recovery against digital exposure limits.'}
                          </p>
                        </div>
                        <button
                          onClick={() => setCurrentView('analytics')}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>Full Analytics</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {entries.length === 0 ? (
                          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                            <p className="text-xs text-slate-500">No habit logs recorded yet.</p>
                            <button
                              onClick={() => setIsDailyTrackerOpen(true)}
                              className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                            >
                              Log your Day 1 baseline
                            </button>
                          </div>
                        ) : (
                          entries.slice(0, 4).map((entry, idx) => (
                            <div
                              key={entry.id}
                              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                                  {entry.scores.dopamineScore}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                      {entry.date}
                                    </p>
                                    {entries.length === 1 && idx === 0 && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                        Day 1 Baseline
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400">
                                    Screen: {entry.screenTimeHours}h • Social: {entry.socialMediaHours}h • Sleep: {entry.sleepHours}h
                                  </p>
                                </div>
                              </div>

                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                {entry.scores.wellBeingScore}% Well-Being
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right: Active Priority AI Recommendations */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-purple-500" /> AI Interventions
                          </h3>
                          <button
                            onClick={() => setCurrentView('recommendations')}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View All
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                          Top recommended protocol based on your latest cognitive load.
                        </p>

                        {recommendations.slice(0, 2).map((rec) => (
                          <div
                            key={rec.id}
                            className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 mb-3"
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                              <span>{rec.category.replace('_', ' ')}</span>
                              <span>{rec.estimatedMinutes}m</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {rec.title}
                            </h4>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                              {rec.actionableStep}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentView('recommendations')}
                        className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run Full Gemini AI Diagnosis</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: TRACKER */}
              {currentView === 'tracker' && (
                <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Daily Biometric Habit Recording
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Log screen exposure, sleep stages, deep focus intervals, and physical regeneration activities.
                    </p>
                  </div>
                  <DailyTrackerModal
                    onSuccess={(newEntry) => {
                      handleEntryLogged(newEntry);
                      setCurrentView('dashboard');
                    }}
                    onCancel={() => setCurrentView('dashboard')}
                  />
                </div>
              )}

              {/* VIEW: ANALYTICS */}
              {currentView === 'analytics' && <AnalyticsView entries={entries} />}

              {/* VIEW: RECOMMENDATIONS */}
              {currentView === 'recommendations' && (
                <RecommendationsView
                  recommendations={recommendations}
                  setRecommendations={setRecommendations}
                  recentEntries={entries}
                />
              )}

              {/* VIEW: GOALS */}
              {currentView === 'goals' && (
                <GoalsView goals={goals} setGoals={setGoals} />
              )}

              {/* VIEW: HISTORY */}
              {currentView === 'history' && (
                <HistoryView entries={entries} setEntries={setEntries} />
              )}

              {/* VIEW: REPORTS */}
              {currentView === 'reports' && <ReportsView entries={entries} />}

              {/* VIEW: TIPS */}
              {currentView === 'tips' && <NeuroscienceTipsView />}

              {/* VIEW: ACHIEVEMENTS */}
              {currentView === 'achievements' && <AchievementsView entries={entries} />}

              {/* VIEW: PROFILE */}
              {currentView === 'profile' && <ProfileSettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Floating Daily Tracker Modal */}
      <Modal
        isOpen={isDailyTrackerOpen}
        onClose={() => setIsDailyTrackerOpen(false)}
        title="Log Daily Habits & Recalculate Dopamine"
        description="Dynamic clinical algorithm recalibrates your baseline scores instantly."
        maxWidth="max-w-2xl"
      >
        <DailyTrackerModal
          onSuccess={handleEntryLogged}
          onCancel={() => setIsDailyTrackerOpen(false)}
        />
      </Modal>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
