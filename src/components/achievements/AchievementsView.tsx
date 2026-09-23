import React, { useMemo } from 'react';
import { Award, Zap, Shield, Flame, Moon, Sparkles, CheckCircle2, Lock, Target, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { DailyEntry } from '../../types';

interface AchievementsViewProps {
  entries?: DailyEntry[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ entries = [] }) => {
  const { user } = useAuth();

  // Active current streak from user account or entries
  const currentStreak = useMemo(() => {
    if (user?.streak !== undefined && user.streak >= 0) return user.streak;
    if (entries.length > 0) return entries.length;
    return 1;
  }, [user?.streak, entries.length]);

  const achievements = useMemo(() => [
    {
      id: 'streak-1',
      title: 'Genesis Ignition (Day 1 Active)',
      description: 'Initialize your dopamine detox baseline and register your first verified active habit check-in.',
      icon: Sparkles,
      isUnlocked: currentStreak >= 1,
      progress: Math.min(100, Math.round((currentStreak / 1) * 100)),
      dateUnlocked: currentStreak >= 1 ? 'Day 1 Baseline Activated' : undefined,
      currentStat: `${Math.min(currentStreak, 1)}/1 Day`,
      xp: 150,
      color: 'indigo',
    },
    {
      id: 'streak-3',
      title: '3-Day Discipline Kickstart',
      description: 'Build unbroken early momentum through 3 continuous days of neural logging.',
      icon: Zap,
      isUnlocked: currentStreak >= 3,
      progress: Math.min(100, Math.round((currentStreak / 3) * 100)),
      dateUnlocked: currentStreak >= 3 ? '3 Days Momentum Reached' : undefined,
      currentStat: `${Math.min(currentStreak, 3)}/3 Days`,
      xp: 200,
      color: 'blue',
    },
    {
      id: 'streak-7',
      title: 'Pioneer Streak (7-Day Consistency)',
      description: 'Log daily habit metrics and maintain circadian check-ins for 7 consecutive days.',
      icon: Flame,
      isUnlocked: currentStreak >= 7,
      progress: Math.min(100, Math.round((currentStreak / 7) * 100)),
      dateUnlocked: currentStreak >= 7 ? '7 Days Milestone Reached' : undefined,
      currentStat: `${Math.min(currentStreak, 7)}/7 Days`,
      xp: 250,
      color: 'amber',
    },
    {
      id: 'streak-14',
      title: 'Habit Transformation Titan (14-Day Streak)',
      description: 'Sustain 14 continuous days of dopamine balance and verified screen-time restraint.',
      icon: Moon,
      isUnlocked: currentStreak >= 14,
      progress: Math.min(100, Math.round((currentStreak / 14) * 100)),
      dateUnlocked: currentStreak >= 14 ? '14 Days Milestone Reached' : undefined,
      currentStat: `${Math.min(currentStreak, 14)}/14 Days`,
      xp: 350,
      color: 'blue',
    },
    {
      id: 'streak-21',
      title: 'Neuro-Plasticity Reset (21-Day Habit Formator)',
      description: 'Cross the scientific 21-day neuroplasticity threshold for lasting dopaminergic rewiring.',
      icon: Zap,
      isUnlocked: currentStreak >= 21,
      progress: Math.min(100, Math.round((currentStreak / 21) * 100)),
      dateUnlocked: currentStreak >= 21 ? '21 Days Milestone Reached' : undefined,
      currentStat: `${Math.min(currentStreak, 21)}/21 Days`,
      xp: 500,
      color: 'purple',
    },
    {
      id: 'streak-30',
      title: 'Circadian & Dopamine Mastery (30-Day Pillar)',
      description: 'Achieve a full 30 days of continuous attentional stamina and circadian sleep adherence.',
      icon: Shield,
      isUnlocked: currentStreak >= 30,
      progress: Math.min(100, Math.round((currentStreak / 30) * 100)),
      dateUnlocked: currentStreak >= 30 ? '30 Days Pillar Reached' : undefined,
      currentStat: `${Math.min(currentStreak, 30)}/30 Days`,
      xp: 750,
      color: 'emerald',
    },
    {
      id: 'streak-100',
      title: 'Century Streak Legend (100-Day Master)',
      description: 'Maintain an elite 100-day tracking streak in the DopamineFlow neuro-health ecosystem.',
      icon: Award,
      isUnlocked: currentStreak >= 100,
      progress: Math.min(100, Math.round((currentStreak / 100) * 100)),
      dateUnlocked: currentStreak >= 100 ? '100 Days Legend Reached' : undefined,
      currentStat: `${Math.min(currentStreak, 100)}/100 Days`,
      xp: 1500,
      color: 'rose',
    },
    {
      id: 'shield-pioneer',
      title: 'Dopamine Shield Pioneer',
      description: 'Kept daily screen time within healthy neural boundaries for consecutive tracked sessions.',
      icon: Shield,
      isUnlocked: currentStreak >= 5,
      progress: Math.min(100, Math.round((currentStreak / 5) * 100)),
      dateUnlocked: currentStreak >= 5 ? '5 Days Adherence' : undefined,
      currentStat: `${Math.min(currentStreak, 5)}/5 Days`,
      xp: 300,
      color: 'indigo',
    },
    {
      id: 'algorithmic-liberation',
      title: 'Algorithmic Liberation',
      description: 'Eliminate compulsive short-form video reels and doomscrolling triggers for 10+ consecutive days.',
      icon: Sparkles,
      isUnlocked: currentStreak >= 10,
      progress: Math.min(100, Math.round((currentStreak / 10) * 100)),
      dateUnlocked: currentStreak >= 10 ? '10 Days Resisted' : undefined,
      currentStat: `${Math.min(currentStreak, 10)}/10 Days`,
      xp: 450,
      color: 'emerald',
    },
    {
      id: 'neuro-zen',
      title: 'Neuro-Zen Sage',
      description: 'Sustained mindful attentional resets and NSDR recovery alongside daily logging.',
      icon: Zap,
      isUnlocked: currentStreak >= 15,
      progress: Math.min(100, Math.round((currentStreak / 15) * 100)),
      dateUnlocked: currentStreak >= 15 ? '15 Days Consistent' : undefined,
      currentStat: `${Math.min(currentStreak, 15)}/15 Days`,
      xp: 400,
      color: 'purple',
    },
  ], [currentStreak]);

  // Dynamic Gamification & Leveling Engine
  const baseAchievementXp = achievements.filter((a) => a.isUnlocked).reduce((sum, a) => sum + a.xp, 0);
  const streakBonusXp = currentStreak * 50; // Each day of active streak adds +50 XP
  const totalEarnedXp = baseAchievementXp + streakBonusXp;

  const xpPerLevel = 500;
  const currentLevel = 1 + Math.floor(totalEarnedXp / xpPerLevel);
  const currentLevelProgressXp = totalEarnedXp % xpPerLevel;
  const progressPercent = Math.round((currentLevelProgressXp / xpPerLevel) * 100);
  const xpNeededForNextLevel = xpPerLevel - currentLevelProgressXp;

  const levelTitles: Record<number, string> = {
    1: 'Initiate of Flow',
    2: 'Habit Seeker',
    3: 'Circadian Practitioner',
    4: 'Dopamine Architect',
    5: 'Neuro-Adept Titan',
    6: 'Master of Attention',
    7: 'Synaptic Pioneer',
  };
  const currentTitle = levelTitles[currentLevel] || 'Flow Vanguard';

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Level Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Neuro-Discipline Achievements & XP
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {currentStreak} Day Streak Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Dopaminergic gamification synchronized directly with your verified {currentStreak}-day habit tracking streak.
          </p>
        </div>

        <button
          onClick={handleCelebrate}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Celebrate Streak & Progress</span>
        </button>
      </div>

      {/* Level & Streak Super-Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-800/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold text-white">
                Level {currentLevel}: {currentTitle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Top Consistency Cohort
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              {totalEarnedXp.toLocaleString()} Total XP earned • {xpNeededForNextLevel} XP until Level {currentLevel + 1}
            </p>
          </div>
        </div>

        {/* Live Streak Reward & Level Bar */}
        <div className="w-full md:w-80 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Active Streak
            </span>
            <span className="font-bold text-amber-300">
              {currentStreak} Days (+{streakBonusXp} XP bonus)
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-indigo-300 font-semibold">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`p-2.5 rounded-xl ${
                      ach.isUnlocked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ach.isUnlocked
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    +{ach.xp} XP
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {ach.isUnlocked ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Unlocked
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {ach.currentStat}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ach.dateUnlocked}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {ach.currentStat}
                      </span>
                      <span>{ach.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
