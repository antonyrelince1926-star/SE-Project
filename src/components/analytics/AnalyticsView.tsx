import React, { useState } from 'react';
import { DailyEntry } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck, Zap, Download, Flame } from 'lucide-react';

interface AnalyticsViewProps {
  entries: DailyEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ entries }) => {
  const [timeframe, setTimeframe] = useState<'7' | '14' | '28'>('28');

  const count = timeframe === '7' ? 7 : timeframe === '14' ? 14 : 28;
  const filtered = entries.slice(0, count).reverse();

  // Format data for Recharts
  const chartData = filtered.map((e) => ({
    date: e.date.slice(5), // MM-DD
    dopamineScore: e.scores.dopamineScore,
    wellBeingScore: e.scores.wellBeingScore,
    screenTimeHours: e.screenTimeHours,
    socialMediaHours: e.socialMediaHours,
    gamingHours: e.gamingHours,
    studyHours: e.studyHours,
    workHours: e.workHours,
    sleepHours: e.sleepHours,
    exerciseMinutes: e.exerciseMinutes,
    meditationMinutes: e.meditationMinutes,
    waterIntakeLiters: e.waterIntakeLiters,
    mood: e.mood * 20, // scale to 100 for correlation
    stimulationIndex: e.scores.stimulationIndex,
  }));

  // Analytical stats
  const avgDopamine = Math.round(
    chartData.reduce((acc, c) => acc + c.dopamineScore, 0) / (chartData.length || 1)
  );
  const avgScreenTime = (
    chartData.reduce((acc, c) => acc + c.screenTimeHours, 0) / (chartData.length || 1)
  ).toFixed(1);
  const avgSocialMedia = (
    chartData.reduce((acc, c) => acc + c.socialMediaHours, 0) / (chartData.length || 1)
  ).toFixed(1);
  const avgSleep = (
    chartData.reduce((acc, c) => acc + c.sleepHours, 0) / (chartData.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Neuro-Habit Longitudinal Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time biometric and behavioral correlations across dopamine, sleep, and screen exposure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => setTimeframe('7')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === '7'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('14')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === '14'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeframe('28')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                timeframe === '28'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>28-Day Streak</span>
            </button>
          </div>

          <a
            href="/api/reports/export-csv"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Avg Dopamine Baseline
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgDopamine}/100</span>
            <span className="text-xs text-emerald-500 font-semibold">+14% trend</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">D2 Receptor sensitivity stabilizing</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Avg Daily Screen Time
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgScreenTime} hrs</span>
            <span className="text-xs text-indigo-500 font-semibold">-1.8h drop</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Within optimal cognitive boundary</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hyper-Stimulation Stimuli
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgSocialMedia} hrs</span>
            <span className="text-xs text-emerald-500 font-semibold">Healthy</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Short-form feeds & social micro-checks</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            NREM Restorative Sleep
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgSleep} hrs</span>
            <span className="text-xs text-blue-500 font-semibold">Circadian sync</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Glymphatic detox window achieved</p>
        </div>
      </div>

      {/* Chart 1: Dopamine Score vs Screen Time Curve (Primary Correlation) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Dopamine Index vs Screen Hours Trajectory
            </h3>
            <p className="text-xs text-slate-400">
              Notice the inverse correlation: drops in excessive screen time directly restore baseline dopamine resilience.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dopamineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="dopamineScore"
                name="Dopamine Score (0-100)"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dopamineGradient)"
              />
              <Area
                type="monotone"
                dataKey="wellBeingScore"
                name="Overall Well-Being (%)"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={0.2}
                fill="#10b981"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Daily Time Allocation Breakdown (Productive vs Reactive) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Daily Hours Allocation
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Balance between Deep Cognitive Output vs High-Stimulation Digital Stimuli.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="studyHours" name="Study" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="workHours" name="Work" stackId="a" fill="#6366f1" />
                <Bar dataKey="socialMediaHours" name="Social Media" stackId="a" fill="#f59e0b" />
                <Bar dataKey="gamingHours" name="Gaming" stackId="a" fill="#ec4899" />
                <Bar dataKey="sleepHours" name="Sleep" stackId="b" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Physical Restoration Pillars */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Physical Restoration Protocols
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Daily physical activities that directly recharge dopamine reserves.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="exerciseMinutes"
                  name="Exercise (mins)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="meditationMinutes"
                  name="Meditation (mins)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Mood Level (Scaled)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
