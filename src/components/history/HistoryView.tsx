import React, { useState } from 'react';
import { DailyEntry, RiskLevel } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getRiskColor, getBurnoutBadge } from '../../lib/dopamine-calculator';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  Calendar,
  Sparkles,
  Smartphone,
  Moon,
  Flame,
} from 'lucide-react';

interface HistoryViewProps {
  entries: DailyEntry[];
  setEntries: React.Dispatch<React.SetStateAction<DailyEntry[]>>;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ entries, setEntries }) => {
  const { showToast } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [inspectEntry, setInspectEntry] = useState<DailyEntry | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this habit entry log?')) return;
    try {
      await api.deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast('Habit entry deleted', 'info');
      if (inspectEntry?.id === id) setInspectEntry(null);
    } catch (e) {
      showToast('Failed to delete entry', 'error');
    }
  };

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.date.includes(searchTerm) ||
      (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = selectedRisk === 'all' || e.scores.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const activeStreak = user?.streak !== undefined ? user.streak : (entries.length > 0 ? entries.length : 1);

  return (
    <div className="space-y-6">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Longitudinal Habit History
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {activeStreak} {activeStreak === 1 ? 'Day Active Streak' : 'Days Active Streak'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {entries.length === 1
              ? 'Day 1 baseline entry verified. Continue logging daily to build consecutive momentum.'
              : `Full chronological archive of ${entries.length} verified daily habit entries and dopamine scores.`}
          </p>
        </div>

        <a
          href="/api/reports/export-csv"
          download
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Complete CSV</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes or date (YYYY-MM-DD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Dopamine Index</th>
                <th className="px-4 py-3">Well-Being</th>
                <th className="px-4 py-3">Screen Time</th>
                <th className="px-4 py-3">Social Feeds</th>
                <th className="px-4 py-3">Sleep</th>
                <th className="px-4 py-3">Risk Assessment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No habit entries match the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const riskCls = getRiskColor(entry.scores.riskLevel);
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {entry.date}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                          {entry.scores.dopamineScore}/100
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {entry.scores.wellBeingScore}%
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                        {entry.screenTimeHours}h
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                        {entry.socialMediaHours}h
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                        {entry.sleepHours}h ({entry.scores.sleepQuality})
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${riskCls}`}>
                          {entry.scores.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectEntry(entry)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Details Inspection Modal */}
      {inspectEntry && (
        <Modal
          isOpen={!!inspectEntry}
          onClose={() => setInspectEntry(null)}
          title={`Biometric Habit Report: ${inspectEntry.date}`}
          description="Detailed breakdown of recorded inputs and clinical neuroscience scores."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <div>
                <span className="text-slate-400 text-[10px]">Dopamine Score</span>
                <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {inspectEntry.scores.dopamineScore}/100
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Well-Being Index</span>
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {inspectEntry.scores.wellBeingScore}%
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Focus Score</span>
                <div className="text-lg font-extrabold text-amber-500">
                  {inspectEntry.scores.focusScore}%
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Sleep Quality</span>
                <div className="text-lg font-extrabold text-blue-500">
                  {inspectEntry.scores.sleepQuality}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Logged Daily Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Screen Time: <strong>{inspectEntry.screenTimeHours} hrs</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Social Media: <strong>{inspectEntry.socialMediaHours} hrs</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Gaming: <strong>{inspectEntry.gamingHours} hrs</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Deep Study: <strong>{inspectEntry.studyHours} hrs</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Work Hours: <strong>{inspectEntry.workHours} hrs</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Sleep Duration: <strong>{inspectEntry.sleepHours} hrs</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Exercise: <strong>{inspectEntry.exerciseMinutes} mins</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Meditation: <strong>{inspectEntry.meditationMinutes} mins</strong>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  Water: <strong>{inspectEntry.waterIntakeLiters} Liters</strong>
                </div>
              </div>
            </div>

            {inspectEntry.notes && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">User Notes</h4>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{inspectEntry.notes}"
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
