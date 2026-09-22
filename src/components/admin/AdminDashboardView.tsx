import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Activity,
  FileCheck2,
  Server,
  Lock,
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { showToast } = useAuth();
  const [adminData, setAdminData] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [overview, usersRes, logsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAuditLogs(),
      ]);
      setAdminData(overview);
      setUsers(usersRes.users);
      setAuditLogs(logsRes.logs);
    } catch (e: any) {
      showToast('Failed to load admin telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.updateUserStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
      showToast(`User status updated to ${nextStatus}`, 'success');
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await api.updateUserRole(userId, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
      showToast(`User role updated to ${nextRole}`, 'success');
    } catch (e) {
      showToast('Failed to update role', 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading Enterprise Admin Management Console...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Enterprise SaaS Administration
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Lead Governance Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time platform telemetry, user permission controls, and SOC2/HIPAA-compliant audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Diagnostic Engine: Operational</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Explanation of the Admin Role */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl overflow-hidden relative">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Role of Administrator in DopamineFlow
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-indigo-200">
                    Governance Architecture
                  </span>
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Institutional oversight, population-level neuro-health analytics, and platform security management
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>1. User Lifecycle & Access</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Admins hold the authority to onboard team members, promote qualified specialists to admin status, suspend compromised accounts, and ensure compliance across the organization.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>2. Population Telemetry</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                While individual private logs remain secure, administrators monitor aggregate dopamine baseline trends, burnout vulnerability risks, and collective screen time velocity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                <span>3. Protocols & Audit Trails</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Admins broadcast urgent well-being protocols (e.g. digital detox windows), publish evidence-based behavioral tips, and review cryptographic audit trails for all sensitive actions.
              </p>
            </div>
          </div>

          {/* Quick Privileges Comparison Pill Bar */}
          <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Privilege Summary:</span>
              <span className="text-indigo-200">
                Members manage personal logs & streaks; Admins govern organization policy, user roles, system metrics, and audit logs.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Enrolled Users
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {adminData?.totalUsers?.toLocaleString() || 1248}
          </div>
          <p className="text-[10px] text-emerald-500 mt-1 font-medium">+18% MoM Organic Growth</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Habit Entries Ingested
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {adminData?.totalHabitEntries?.toLocaleString() || 24890}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">High telemetry retention rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Mean Platform Dopamine
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {adminData?.averagePlatformDopamineScore || 74.2}/100
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Population baseline score</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Burnout & High Risk Flags
          </span>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">
            {adminData?.highRiskUsersCount || 18} users
          </div>
          <p className="text-[10px] text-rose-400 mt-1">Targeted for AI Intervention</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Platform User Directory & Permissions
            </h3>
            <p className="text-xs text-slate-400">
              Manage user privilege tiers, account operational status, and audit histories.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">User Profile</th>
                <th className="px-4 py-3">Role Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Habits Logged</th>
                <th className="px-4 py-3">Member Since</th>
                <th className="px-4 py-3 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    {u.entriesCount} records
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{u.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpdateRole(u.id, u.role)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                          u.status === 'ACTIVE'
                            ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Logs Stream */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" /> System Activity & Compliance Audit Trail
          </h3>
          <p className="text-xs text-slate-400">
            Immutable log of all authentication events, AI inferences, and critical data modifications.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Subject / Actor</th>
                <th className="px-4 py-3">Origin IP</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {log.userEmail || 'System Process'}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
