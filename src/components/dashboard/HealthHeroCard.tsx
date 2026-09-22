import React from 'react';
import { HabitScores } from '../../types';
import { getRiskColor, getBurnoutBadge } from '../../lib/dopamine-calculator';
import { Sparkles, ShieldCheck, Zap, Flame } from 'lucide-react';

interface HealthHeroCardProps {
  scores: HabitScores;
  latestDate: string;
  onOpenTracker: () => void;
  streak?: number;
}

export const HealthHeroCard: React.FC<HealthHeroCardProps> = ({
  scores,
  latestDate,
  onOpenTracker,
  streak = 28,
}) => {
  const burnout = getBurnoutBadge(scores.burnoutLevel);
  const riskColor = getRiskColor(scores.riskLevel);

  // SVG Circular progress math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scores.dopamineScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Side: Score Gauges & Diagnostics */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Radial Gauge */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {scores.dopamineScore}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Dopamine Index
              </span>
            </div>
          </div>

          {/* Diagnosis details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {streak} Day Active Streak
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskColor}`}>
                {scores.riskLevel} Risk State
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${burnout.color}`}>
                {burnout.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Sleep: {scores.sleepQuality}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Neural Baseline is in{' '}
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {scores.dopamineTrend === 'rising'
                    ? 'Resilient Recovery'
                    : scores.dopamineTrend === 'balanced'
                    ? 'Homeostatic Balance'
                    : 'Overstimulated Depletion'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Calculated from your sleep duration, screen velocity, deep work sessions, and physical recovery with active {streak}-day continuous tracking. Last recorded on {latestDate}.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action & Secondary Metrics */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
          <div className="grid grid-cols-3 gap-2 p-3 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="p-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Streak</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                {streak}d
              </div>
            </div>
            <div className="p-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Well-Being</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {scores.wellBeingScore}%
              </div>
            </div>
            <div className="p-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Focus</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                {scores.focusScore}%
              </div>
            </div>
          </div>

          <button
            onClick={onOpenTracker}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Update Today's Metrics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
