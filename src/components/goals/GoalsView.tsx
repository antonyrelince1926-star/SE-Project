import React, { useState } from 'react';
import { Goal } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  Smartphone,
  Moon,
  Droplets,
  Dumbbell,
  Sparkles,
} from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, setGoals }) => {
  const { showToast } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Goal['category']>('screen_time');
  const [targetValue, setTargetValue] = useState<number>(5.0);
  const [unit, setUnit] = useState<string>('hours');
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  const handleCategoryChange = (cat: Goal['category']) => {
    setCategory(cat);
    if (cat === 'screen_time' || cat === 'social_media') {
      setUnit('hours');
      setTargetValue(cat === 'screen_time' ? 5.0 : 1.0);
    } else if (cat === 'sleep') {
      setUnit('hours');
      setTargetValue(7.5);
    } else if (cat === 'exercise' || cat === 'meditation') {
      setUnit('mins');
      setTargetValue(cat === 'exercise' ? 30 : 15);
    } else if (cat === 'water') {
      setUnit('liters');
      setTargetValue(2.5);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { goal } = await api.createGoal({
        title,
        category,
        targetValue: Number(targetValue),
        unit,
        period,
      });
      setGoals((prev) => [...prev, goal]);
      showToast('New target goal created!', 'success');
      setIsAddModalOpen(false);
      setTitle('');
    } catch (e: any) {
      showToast('Failed to create goal', 'error');
    }
  };

  const handleToggleComplete = async (goal: Goal) => {
    const nextCompleted = !goal.isCompleted;
    try {
      const { goal: updated } = await api.updateGoal(goal.id, {
        isCompleted: nextCompleted,
        streak: nextCompleted ? goal.streak + 1 : Math.max(0, goal.streak - 1),
      });

      if (nextCompleted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(`Milestone hit! Streak increased to ${updated.streak} days 🔥`, 'success');
      }

      setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
    } catch (e) {
      showToast('Failed to update goal', 'error');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      showToast('Goal removed', 'info');
    } catch (e) {
      showToast('Failed to delete goal', 'error');
    }
  };

  const getCategoryIcon = (cat: Goal['category']) => {
    switch (cat) {
      case 'screen_time': return Smartphone;
      case 'social_media': return Flame;
      case 'sleep': return Moon;
      case 'exercise': return Dumbbell;
      case 'meditation': return Sparkles;
      case 'water': return Droplets;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Habit Goals & Streaks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Micro-behavior targets designed to protect attentional bandwidth and enforce dopamine discipline.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = getCategoryIcon(goal.category);
          const percent = Math.min(100, Math.round((goal.currentValue / (goal.targetValue || 1)) * 100));

          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {goal.period} target • Category: {goal.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Streak Flame */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{goal.streak}d streak</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Current: <strong className="text-slate-900 dark:text-white">{goal.currentValue} {goal.unit}</strong>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Target: <strong className="text-slate-900 dark:text-white">{goal.targetValue} {goal.unit}</strong>
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleComplete(goal)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    goal.isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{goal.isCompleted ? 'Completed Today' : 'Mark as Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Habit Target"
        description="Set a measurable behavioral boundary to stabilize your neurotransmitters."
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zero TikTok before 12 PM"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as Goal['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="screen_time">Screen Time Limit</option>
                <option value="social_media">Social Media Cap</option>
                <option value="sleep">Restorative Sleep</option>
                <option value="meditation">Meditation / NSDR</option>
                <option value="exercise">Exercise / Workout</option>
                <option value="water">Hydration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="daily">Daily Goal</option>
                <option value="weekly">Weekly Target</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Numeric Value
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Unit
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
