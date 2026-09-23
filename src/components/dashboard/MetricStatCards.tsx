import React from 'react';
import { DailyEntry } from '../../types';
import { Smartphone, Zap, Moon, Flame, ArrowDownRight, ArrowUpRight, Award } from 'lucide-react';

interface MetricStatCardsProps {
  latestEntry?: DailyEntry;
  currentStreak?: number;
}

export const MetricStatCards: React.FC<MetricStatCardsProps> = ({
  latestEntry,
  currentStreak = 1,
}) => {
  const screenTime = latestEntry ? latestEntry.screenTimeHours : 4.1;
  const socialHours = latestEntry ? latestEntry.socialMediaHours : 0.6;
  const sleepHours = latestEntry ? latestEntry.sleepHours : 7.8;
  const deepWorkHours = latestEntry ? latestEntry.workHours + latestEntry.studyHours : 9.8;

  const stats = [
    {
      title: 'Active Habit Streak',
      value: `${currentStreak} ${currentStreak === 1 ? 'Day' : 'Days'}`,
      subtext: currentStreak === 1 ? 'Day 1 baseline established' : 'Consecutive verified check-ins',
      status: 'good',
      change: currentStreak === 1 ? '🌟 Day 1 Initiated' : '🔥 Streak Active Today',
      isPositive: true,
      icon: Flame,
      color: 'amber',
    },
    {
      title: 'Daily Screen Exposure',
      value: `${screenTime}h`,
      subtext: 'Target: < 5.0h',
      status: screenTime <= 5.0 ? 'good' : 'warning',
      change: '-18% vs baseline',
      isPositive: true,
      icon: Smartphone,
      color: 'indigo',
    },
    {
      title: 'Hyper-Stimulation Stimuli',
      value: `${socialHours}h`,
      subtext: 'Social feeds & reels',
      status: socialHours <= 1.0 ? 'good' : 'warning',
      change: '-34% dopamine drain',
      isPositive: true,
      icon: Zap,
      color: 'rose',
    },
    {
      title: 'NREM Circadian Rest',
      value: `${sleepHours}h`,
      subtext: 'Glymphatic clearance optimal',
      status: sleepHours >= 7.0 ? 'good' : 'warning',
      change: '+45m restorative sleep',
      isPositive: true,
      icon: Moon,
      color: 'blue',
    },
    {
      title: 'Deep Attentional Flow',
      value: `${deepWorkHours}h`,
      subtext: 'Study & work without residue',
      status: deepWorkHours >= 6.0 ? 'good' : 'warning',
      change: '+2.1h flow state',
      isPositive: true,
      icon: Award,
      color: 'emerald',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${
                    stat.color === 'indigo'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : stat.color === 'amber'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                      : stat.color === 'blue'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : stat.color === 'rose'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span
                  className={`inline-flex items-center text-[11px] font-semibold ${
                    stat.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {stat.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
