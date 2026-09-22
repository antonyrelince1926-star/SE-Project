import React, { useState, useMemo } from 'react';
import { DailyEntry } from '../../types';
import { calculateHabitScores, getRiskColor, getBurnoutBadge } from '../../lib/dopamine-calculator';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Smartphone,
  Flame,
  Moon,
  Droplets,
  Dumbbell,
  Smile,
  Frown,
  Meh,
  Sparkles,
  Save,
  BookOpen,
} from 'lucide-react';

interface DailyTrackerProps {
  onSuccess: (newEntry: DailyEntry) => void;
  onCancel?: () => void;
  initialEntry?: Partial<DailyEntry>;
}

export const DailyTrackerModal: React.FC<DailyTrackerProps> = ({
  onSuccess,
  onCancel,
  initialEntry,
}) => {
  const { showToast } = useAuth();
  const [date, setDate] = useState<string>(
    initialEntry?.date || new Date().toISOString().split('T')[0]
  );
  const [screenTime, setScreenTime] = useState<number>(initialEntry?.screenTimeHours ?? 4.5);
  const [socialMedia, setSocialMedia] = useState<number>(initialEntry?.socialMediaHours ?? 1.2);
  const [gaming, setGaming] = useState<number>(initialEntry?.gamingHours ?? 0.0);
  const [study, setStudy] = useState<number>(initialEntry?.studyHours ?? 3.0);
  const [work, setWork] = useState<number>(initialEntry?.workHours ?? 5.5);
  const [sleep, setSleep] = useState<number>(initialEntry?.sleepHours ?? 7.5);
  const [exercise, setExercise] = useState<number>(initialEntry?.exerciseMinutes ?? 30);
  const [meditation, setMeditation] = useState<number>(initialEntry?.meditationMinutes ?? 10);
  const [water, setWater] = useState<number>(initialEntry?.waterIntakeLiters ?? 2.5);
  const [mood, setMood] = useState<number>(initialEntry?.mood ?? 4);
  const [notes, setNotes] = useState<string>(initialEntry?.notes || '');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(
    initialEntry?.triggers || ['Social Media Feeds']
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const availableTriggers = [
    'Short-Form Video (TikTok/Reels)',
    'Late Night Screen (< 45m before sleep)',
    'Compulsive Notification Checking',
    'Gaming Binge',
    'Multitasking with Background Video',
    'Work Email Checking in Bed',
    'Infinite News Doomscroll',
    'Uncontrolled Browser Tabs',
  ];

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  // Instant real-time recalculation as user moves sliders
  const liveScores = useMemo(() => {
    return calculateHabitScores({
      screenTimeHours: Number(screenTime),
      socialMediaHours: Number(socialMedia),
      gamingHours: Number(gaming),
      studyHours: Number(study),
      workHours: Number(work),
      sleepHours: Number(sleep),
      exerciseMinutes: Number(exercise),
      meditationMinutes: Number(meditation),
      waterIntakeLiters: Number(water),
      mood: Number(mood),
    });
  }, [screenTime, socialMedia, gaming, study, work, sleep, exercise, meditation, water, mood]);

  const riskBadge = getRiskColor(liveScores.riskLevel);
  const burnoutBadge = getBurnoutBadge(liveScores.burnoutLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: Partial<DailyEntry> = {
        date,
        screenTimeHours: Number(screenTime),
        socialMediaHours: Number(socialMedia),
        gamingHours: Number(gaming),
        studyHours: Number(study),
        workHours: Number(work),
        sleepHours: Number(sleep),
        exerciseMinutes: Number(exercise),
        meditationMinutes: Number(meditation),
        waterIntakeLiters: Number(water),
        mood: Number(mood),
        notes,
        triggers: selectedTriggers,
        scores: liveScores,
      };

      const { entry } = await api.saveEntry(payload);
      showToast('Daily habits and dopamine scores successfully logged!', 'success');
      onSuccess(entry);
    } catch (err: any) {
      showToast(err.message || 'Failed to save entry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Live Calculated Score HUD Header */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Live Neuro Health Computation
            </span>
            <div className="text-xl font-extrabold flex items-center gap-2 mt-0.5">
              <span>Dopamine Score: {liveScores.dopamineScore}/100</span>
              <span className="text-sm font-normal text-slate-400">
                (Well-Being: {liveScores.wellBeingScore}%)
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskBadge}`}>
              {liveScores.riskLevel} Risk
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${burnoutBadge.color}`}>
              {burnoutBadge.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 text-[10px]">Attentional Focus</span>
            <div className="font-bold text-amber-400">{liveScores.focusScore}%</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Sleep Quality</span>
            <div className="font-bold text-blue-400">{liveScores.sleepQuality}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Stimulation Index</span>
            <div className="font-bold text-rose-400">{liveScores.stimulationIndex}%</div>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Tracking Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
          required
        />
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Screen Time */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" /> Total Screen Time
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {screenTime} hrs
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="16"
            step="0.5"
            value={screenTime}
            onChange={(e) => setScreenTime(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Social Media Hours */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Social Media & Feeds
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {socialMedia} hrs
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.25"
            value={socialMedia}
            onChange={(e) => setSocialMedia(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Gaming Hours */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Gaming Hours
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {gaming} hrs
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={gaming}
            onChange={(e) => setGaming(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Sleep Hours */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-blue-500" /> Sleep Duration
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {sleep} hrs
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            step="0.5"
            value={sleep}
            onChange={(e) => setSleep(parseFloat(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Deep Work & Study */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Study & Deep Work
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {(study + work).toFixed(1)} hrs
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">Study: {study}h</span>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={study}
                onChange={(e) => setStudy(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Work: {work}h</span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={work}
                onChange={(e) => setWork(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Physical Exercise & Meditation */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-teal-500" /> Exercise & Mind
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              {exercise}m / {meditation}m
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">Exercise: {exercise}m</span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={exercise}
                onChange={(e) => setExercise(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Meditation: {meditation}m</span>
              <input
                type="range"
                min="0"
                max="45"
                step="5"
                value={meditation}
                onChange={(e) => setMeditation(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Water & Mood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Water Intake */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Water Intake
            </span>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {water} Liters
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.25"
            value={water}
            onChange={(e) => setWater(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Mood Selector */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Emotional & Dopamine Valence (Mood)
          </label>
          <div className="flex items-center justify-between gap-1">
            {[
              { val: 1, label: 'Exhausted', icon: Frown },
              { val: 2, label: 'Low', icon: Frown },
              { val: 3, label: 'Neutral', icon: Meh },
              { val: 4, label: 'Focused', icon: Smile },
              { val: 5, label: 'Peak Flow', icon: Sparkles },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = mood === m.val;
              return (
                <button
                  type="button"
                  key={m.val}
                  onClick={() => setMood(m.val)}
                  className={`flex-1 flex flex-col items-center p-1.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Triggers Tagging */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select Environmental & Digital Stimuli Experienced Today:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableTriggers.map((t) => {
            const isSelected = selectedTriggers.includes(t);
            return (
              <button
                type="button"
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reflection Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Neuro-Cognitive Notes & Reflections
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g., Felt sharp focus in the morning after sunlight exposure. Struggled with Instagram reels around 4 PM..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Calculating...' : 'Save & Recalculate Scores'}</span>
        </button>
      </div>
    </form>
  );
};
