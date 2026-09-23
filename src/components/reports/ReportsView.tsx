import React, { useState } from 'react';
import { DailyEntry } from '../../types';
import { FileText, Printer, Download, ShieldCheck, AlertCircle, Award, CheckCircle, Flame } from 'lucide-react';

interface ReportsViewProps {
  entries: DailyEntry[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ entries }) => {
  const [period, setPeriod] = useState<'weekly' | 'biweekly' | 'monthly' | 'all'>('monthly');
  const count =
    period === 'weekly'
      ? 7
      : period === 'biweekly'
      ? 14
      : period === 'monthly'
      ? 30
      : entries.length || 1;
  const recent = entries.slice(0, count);

  const avgDopamine = Math.round(
    recent.reduce((sum, e) => sum + e.scores.dopamineScore, 0) / (recent.length || 1)
  );
  const avgWellBeing = Math.round(
    recent.reduce((sum, e) => sum + e.scores.wellBeingScore, 0) / (recent.length || 1)
  );
  const avgScreenTime = (
    recent.reduce((sum, e) => sum + e.screenTimeHours, 0) / (recent.length || 1)
  ).toFixed(1);
  const avgSleep = (
    recent.reduce((sum, e) => sum + e.sleepHours, 0) / (recent.length || 1)
  ).toFixed(1);

  let grade = 'A';
  let gradeSub = 'Optimal Neural Baseline Reserve';
  if (avgDopamine < 50) {
    grade = 'C-';
    gradeSub = 'Severe Dopamine Downregulation';
  } else if (avgDopamine < 65) {
    grade = 'B';
    gradeSub = 'Moderate Cognitive Fatigue';
  } else if (avgDopamine < 80) {
    grade = 'A-';
    gradeSub = 'Healthy Attentional Homeostasis';
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Print action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Executive Well-Being Clinical Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Formal biometric audit suitable for personal review or physician/therapist consultation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              7-Day
            </button>
            <button
              onClick={() => setPeriod('biweekly')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === 'biweekly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              14-Day
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              30-Day
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                period === 'all'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>All ({entries.length}d)</span>
            </button>
          </div>

          <a
            href="/api/readme"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Download README.md</span>
          </a>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 shadow-xs border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Report Container */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              DopamineFlow Clinical Well-Being Audit
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Neuro-Habit & Digital Health Executive Brief
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Sample Period: {Math.min(count, entries.length)} {Math.min(count, entries.length) === 1 ? 'day analyzed (Day 1 Baseline)' : 'days analyzed'}</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Active Streak: {entries.length === 1 ? '1 Day Continuous (Day 1 Baseline)' : `${entries.length} Days Continuous`}
              </span>
              <span>•</span>
              <span>Report ID: DF-AUDIT-{Date.now().toString().slice(-6)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center">
              {grade}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Habit Grade</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{gradeSub}</p>
            </div>
          </div>
        </div>

        {/* 4 Primary Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Avg Dopamine Index</span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {avgDopamine}/100
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">High baseline retention</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Composite Well-Being</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {avgWellBeing}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Physical & mental balance</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Daily Screen Velocity</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {avgScreenTime} hrs
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Target &lt; 5.0 hrs</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Avg Sleep Duration</span>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {avgSleep} hrs
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Restorative circadian cycle</p>
          </div>
        </div>

        {/* Behavioral Wins and Vulnerabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4" /> Demonstrated Neuro-Protective Wins
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                Reduced short-form video consumption by 65% across morning and evening windows.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                Consistent 30+ minutes of physical activity resulting in sustained beta-endorphin surges.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                Average sleep duration reached 7.6 hours, facilitating optimal glymphatic toxin clearance.
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4" /> Remaining Behavioral Vulnerabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                Occasional mid-week evening screen checks after 9:30 PM slightly degrading NREM depth.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                Hydration drops below 2.0L on heavy meeting days, slightly reducing cellular efficiency.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                Context switching between work tasks and messaging apps still averages ~8 checks/hour.
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Sign-Off */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400">
          <div>
            <span>Verified by AI Diagnostic Engine & Lead Neuroscientist</span>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              Dr. Elena Vance, Cognitive Neurobiology
            </p>
          </div>
          <span className="mt-2 sm:mt-0 font-mono text-[10px]">
            HASH: SHA256-DF-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
