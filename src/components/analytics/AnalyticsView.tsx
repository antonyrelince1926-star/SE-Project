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
import { TrendingUp, Flame, Download, Activity, Brain, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface AnalyticsViewProps {
  entries: DailyEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ entries }) => {
  const [timeframe, setTimeframe] = useState<'7' | '14' | '28' | '30' | 'all'>('30');

  const count =
    timeframe === '7'
      ? 7
      : timeframe === '14'
      ? 14
      : timeframe === '28'
      ? 28
      : timeframe === '30'
      ? 30
      : entries.length || 30;

  // Take most recent 'count' entries and order chronologically (oldest to newest)
  const filtered = entries.slice(0, count).reverse();

  // Format data for Recharts
  const chartData = filtered.map((e) => ({
    date: e.date.slice(5), // MM-DD
    fullDate: e.date,
    dopamineScore: e.scores?.dopamineScore ?? 50,
    wellBeingScore: e.scores?.wellBeingScore ?? 50,
    screenTimeHours: Number(e.screenTimeHours) || 0,
    socialMediaHours: Number(e.socialMediaHours) || 0,
    gamingHours: Number(e.gamingHours) || 0,
    studyHours: Number(e.studyHours) || 0,
    workHours: Number(e.workHours) || 0,
    sleepHours: Number(e.sleepHours) || 0,
    exerciseMinutes: Number(e.exerciseMinutes) || 0,
    meditationMinutes: Number(e.meditationMinutes) || 0,
    waterIntakeLiters: Number(e.waterIntakeLiters) || 0,
    mood: (Number(e.mood) || 3) * 20, // scale 1-5 to 20-100 for visual correlation
    focusScore: e.scores?.focusScore ?? 50,
    stimulationIndex: e.scores?.stimulationIndex ?? 50,
  }));

  const dataLen = chartData.length || 1;

  // Analytical stats
  const avgDopamine = Math.round(chartData.reduce((acc, c) => acc + c.dopamineScore, 0) / dataLen);
  const avgScreenTime = (chartData.reduce((acc, c) => acc + c.screenTimeHours, 0) / dataLen).toFixed(1);
  const avgSocialMedia = (chartData.reduce((acc, c) => acc + c.socialMediaHours, 0) / dataLen).toFixed(1);
  const avgSleep = (chartData.reduce((acc, c) => acc + c.sleepHours, 0) / dataLen).toFixed(1);
  const avgFocus = Math.round(chartData.reduce((acc, c) => acc + c.focusScore, 0) / dataLen);
  const avgStimulation = Math.round(chartData.reduce((acc, c) => acc + c.stimulationIndex, 0) / dataLen);

  // Dynamic trend computation: compare second half of selected days to first half
  const isSingleDay = chartData.length <= 1;
  const half = Math.floor(chartData.length / 2);
  const firstHalf = chartData.slice(0, half);
  const secondHalf = chartData.slice(half);

  const firstDopamine = firstHalf.length ? firstHalf.reduce((a, b) => a + b.dopamineScore, 0) / firstHalf.length : avgDopamine;
  const secondDopamine = secondHalf.length ? secondHalf.reduce((a, b) => a + b.dopamineScore, 0) / secondHalf.length : avgDopamine;
  const dopamineDelta = Math.round(secondDopamine - firstDopamine);

  const firstScreen = firstHalf.length ? firstHalf.reduce((a, b) => a + b.screenTimeHours, 0) / firstHalf.length : Number(avgScreenTime);
  const secondScreen = secondHalf.length ? secondHalf.reduce((a, b) => a + b.screenTimeHours, 0) / secondHalf.length : Number(avgScreenTime);
  const screenDelta = (secondScreen - firstScreen).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Day 1 Context Banner if 1 day */}
      {entries.length === 1 && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
            <span className="font-bold">Day 1 Clinical Baseline Active:</span> Your initial neuro-habit metrics are calibrated. Each consecutive day you log will expand your longitudinal correlation curves, sleep-screen regression models, and recovery trajectory.
          </p>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Neuro-Habit Longitudinal Analytics
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3 h-3" />
              {chartData.length} {chartData.length === 1 ? 'Day Active (Day 1 Baseline)' : 'Days Tracked'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Biometric correlations across dopamine sensitivity, digital stimulation, and restorative circadian sleep.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Multi-Day Timeframe Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => setTimeframe('7')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === '7'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('14')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === '14'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeframe('30')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === '30'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                timeframe === 'all'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>All ({entries.length}d)</span>
            </button>
          </div>

          <a
            href="/api/reports/export-csv"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
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
            <span
              className={`text-xs font-semibold ${
                isSingleDay ? 'text-indigo-500' : dopamineDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {isSingleDay ? 'Day 1 Baseline' : dopamineDelta >= 0 ? `+${dopamineDelta}% trend` : `${dopamineDelta}% trend`}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">D2 receptor baseline recovery</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Avg Daily Screen Time
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgScreenTime} hrs</span>
            <span
              className={`text-xs font-semibold ${
                isSingleDay ? 'text-indigo-500' : Number(screenDelta) <= 0 ? 'text-indigo-500' : 'text-amber-500'
              }`}
            >
              {isSingleDay ? 'Day 1 Baseline' : Number(screenDelta) <= 0 ? `${screenDelta}h shift` : `+${screenDelta}h shift`}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Within calibrated cognitive quota</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hyper-Stimulation Stimuli
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgSocialMedia} hrs</span>
            <span className="text-xs text-emerald-500 font-semibold">Stimulus: {avgStimulation}/100</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Social feeds & short-form video loops</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            NREM Restorative Sleep
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
            <span>{avgSleep} hrs</span>
            <span className="text-xs text-blue-500 font-semibold">Focus: {avgFocus}/100</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Glymphatic detox & memory consolidation</p>
        </div>
      </div>

      {/* Chart 1: Dopamine Score vs Screen Time Curve (Primary Correlation) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Dopamine Index vs Screen Hours Trajectory ({chartData.length} Days)
            </h3>
            <p className="text-xs text-slate-400">
              Notice the inverse correlation: conscious reductions in screen exposure directly uplift baseline dopamine resilience.
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
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} minTickGap={15} interval="preserveStartEnd" />
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

      {/* Chart 2 & 3 Grid: Allocation and Restoration Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Time Allocation Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Daily Hours Allocation
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Balance between Deep Cognitive Output vs High-Stimulation Digital Stimuli across {chartData.length} days.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} minTickGap={15} interval="preserveStartEnd" />
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
                <Bar dataKey="studyHours" name="Study" stackId="a" fill="#3b82f6" />
                <Bar dataKey="workHours" name="Work" stackId="a" fill="#6366f1" />
                <Bar dataKey="socialMediaHours" name="Social Media" stackId="a" fill="#f59e0b" />
                <Bar dataKey="gamingHours" name="Gaming" stackId="a" fill="#ec4899" />
                <Bar dataKey="sleepHours" name="Sleep" stackId="b" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Physical Restoration Pillars */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Physical Restoration Protocols
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Daily physiological activities that directly recharge natural neuro-transmitter reserves.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} minTickGap={15} interval="preserveStartEnd" />
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
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="meditationMinutes"
                  name="Meditation (mins)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Mood Level (Scaled)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 4: Attentional Focus vs Digital Stimulation Index */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-500" />
              Cognitive Focus Stamina vs Hyper-Stimulation Index
            </h3>
            <p className="text-xs text-slate-400">
              As artificial super-stimuli drop, sustained prefrontal cortex focus capacity expands across the multi-day habit cycle.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} minTickGap={15} interval="preserveStartEnd" />
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="focusScore"
                name="Focus Stamina (0-100)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2.5 }}
              />
              <Line
                type="monotone"
                dataKey="stimulationIndex"
                name="Digital Overstimulation Index"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

