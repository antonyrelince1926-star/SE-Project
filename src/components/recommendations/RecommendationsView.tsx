import React, { useState } from 'react';
import { Recommendation, DailyEntry } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Moon,
  Smartphone,
  Eye,
  Check,
  RefreshCw,
} from 'lucide-react';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>;
  recentEntries: DailyEntry[];
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  setRecommendations,
  recentEntries,
}) => {
  const { showToast } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<string>('');

  const handleRunAiAnalysis = async () => {
    setIsGeneratingAi(true);
    try {
      const { aiReport: report, source } = await api.runAiAnalysis(recentEntries);
      setAiReport(report);
      setAiSource(source);
      showToast('AI Neuro-Cognitive Diagnosis generated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to run AI analysis', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const { recommendation } = await api.completeRecommendation(id);
      setRecommendations((prev) => prev.map((r) => (r.id === id ? recommendation : r)));
      showToast('Protocol marked as completed!', 'success');
    } catch (e) {
      showToast('Failed to update recommendation', 'error');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await api.dismissRecommendation(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      showToast('Recommendation dismissed', 'info');
    } catch (e) {
      showToast('Failed to dismiss', 'error');
    }
  };

  const filtered = recommendations.filter((r) => {
    if (r.isDismissed) return false;
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and Gemini AI Engine Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Neuro-Cognitive Recommendations
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Biochemically calibrated action protocols to restore D2 receptor density and attentional stamina.
          </p>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isGeneratingAi}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
        >
          {isGeneratingAi ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{isGeneratingAi ? 'Synthesizing Diagnosis...' : 'Run Neuro-Cognitive AI Diagnosis'}</span>
        </button>
      </div>

      {/* AI Deep Analysis Output Card */}
      {aiReport && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 border border-indigo-700/40 shadow-xl">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-indigo-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Clinical Dopamine & Behavioral Diagnosis
                </h3>
                <span className="text-[10px] text-indigo-300 font-medium">
                  Model: {aiSource} • Evaluated 14 telemetry variables
                </span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Live Synthesis
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Current Neural Baseline State
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                {aiReport.clinicalDiagnosis}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Dopamine Waveform Pattern
                </span>
                <p className="text-xs text-slate-300 mt-1">{aiReport.dopamineWaveform}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" /> Burnout Prognosis (14-Day)
                </span>
                <p className="text-xs text-slate-300 mt-1">{aiReport.burnoutPrognosis}</p>
              </div>
            </div>

            {/* 3-Step Protocol */}
            {aiReport.threeStepProtocol && (
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                  Tailored 3-Phase Habit Roadmap
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiReport.threeStepProtocol.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-indigo-900/30 border border-indigo-700/30 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-400">
                          {p.step}
                        </span>
                        <p className="text-xs font-semibold text-white mt-1">{p.action}</p>
                      </div>
                      <p className="text-[10px] text-indigo-200/80 mt-2 italic border-t border-indigo-800/40 pt-1.5">
                        {p.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Micro Habit */}
            {aiReport.recommendedMicroHabit && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-300">
                    High-Impact Micro Habit:
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5">{aiReport.recommendedMicroHabit}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Protocols' },
          { id: 'dopamine_reset', label: 'Dopamine Reset' },
          { id: 'sleep_hygiene', label: 'Sleep Hygiene' },
          { id: 'focus_boost', label: 'Focus Boost' },
          { id: 'screen_reduction', label: 'Screen Reduction' },
          { id: 'mindfulness', label: 'Mindfulness & NSDR' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => {
          return (
            <div
              key={rec.id}
              className={`p-6 rounded-2xl border transition-all ${
                rec.isCompleted
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rec.category === 'dopamine_reset'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : rec.category === 'sleep_hygiene'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : rec.category === 'focus_boost'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {rec.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {rec.estimatedMinutes}m
                  </span>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    rec.impact === 'High'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {rec.impact} Impact
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                {rec.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {rec.description}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                  Actionable Protocol:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {rec.actionableStep}
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 capitalize">
                  Difficulty: {rec.difficulty}
                </span>

                <div className="flex items-center gap-2">
                  {!rec.isCompleted && (
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Dismiss
                    </button>
                  )}

                  <button
                    onClick={() => handleComplete(rec.id)}
                    disabled={rec.isCompleted}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      rec.isCompleted
                        ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{rec.isCompleted ? 'Completed' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
