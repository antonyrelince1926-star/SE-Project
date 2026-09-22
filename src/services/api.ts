import {
  User,
  DailyEntry,
  Goal,
  Recommendation,
  EducationalTip,
  NotificationItem,
  AuditLog,
  SystemMetrics,
} from '../types';

const TOKEN_KEY = 'dopamineflow_auth_token';
const LOGGED_OUT_KEY = 'dopamineflow_explicit_logout';

export const authStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(LOGGED_OUT_KEY);
  },
  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(LOGGED_OUT_KEY, 'true');
  },
  isExplicitlyLoggedOut(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(LOGGED_OUT_KEY) === 'true';
  },
  clearExplicitLogout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOGGED_OUT_KEY);
  },
};

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}

export const api = {
  // Auth
  async getCurrentUser(): Promise<{ user: User | null }> {
    const res = await authFetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to fetch user session');
    return res.json();
  },

  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    const data = await res.json();
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  async switchAccount(role?: 'USER' | 'ADMIN', email?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/switch-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email }),
    });
    if (!res.ok) throw new Error('Failed to switch account');
    const data = await res.json();
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  async register(name: string, email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  async loginWithGoogle(): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/google', { method: 'POST' });
    if (!res.ok) throw new Error('OAuth authentication failed');
    const data = await res.json();
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      authStorage.clearToken();
    }
    return { success: true };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    return res.json();
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const res = await authFetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Entries
  async getEntries(userId?: string): Promise<{ entries: DailyEntry[] }> {
    const url = userId ? `/api/entries?userId=${encodeURIComponent(userId)}` : '/api/entries';
    const res = await authFetch(url);
    if (!res.ok) throw new Error('Failed to fetch daily entries');
    return res.json();
  },

  async saveEntry(entry: Partial<DailyEntry>): Promise<{ entry: DailyEntry; streak?: number }> {
    const res = await authFetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error('Failed to save habit entry');
    return res.json();
  },

  async deleteEntry(id: string): Promise<{ success: boolean }> {
    const res = await authFetch(`/api/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete entry');
    return res.json();
  },

  // Goals
  async getGoals(): Promise<{ goals: Goal[] }> {
    const res = await authFetch('/api/goals');
    if (!res.ok) throw new Error('Failed to fetch goals');
    return res.json();
  },

  async createGoal(goal: Partial<Goal>): Promise<{ goal: Goal }> {
    const res = await authFetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    return res.json();
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<{ goal: Goal }> {
    const res = await authFetch(`/api/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update goal');
    return res.json();
  },

  async deleteGoal(id: string): Promise<{ success: boolean }> {
    const res = await authFetch(`/api/goals/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete goal');
    return res.json();
  },

  // Recommendations
  async getRecommendations(): Promise<{ recommendations: Recommendation[] }> {
    const res = await authFetch('/api/recommendations');
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async completeRecommendation(id: string): Promise<{ recommendation: Recommendation }> {
    const res = await authFetch(`/api/recommendations/${id}/complete`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to complete recommendation');
    return res.json();
  },

  async dismissRecommendation(id: string): Promise<{ recommendation: Recommendation }> {
    const res = await authFetch(`/api/recommendations/${id}/dismiss`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to dismiss recommendation');
    return res.json();
  },

  // Gemini AI Engine Deep Diagnosis
  async runAiAnalysis(recentEntries?: DailyEntry[]): Promise<{ aiReport: any; source: string }> {
    const res = await authFetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recentEntries }),
    });
    if (!res.ok) throw new Error('Failed to generate AI analysis');
    return res.json();
  },

  // Tips
  async getTips(): Promise<{ tips: EducationalTip[] }> {
    const res = await authFetch('/api/tips');
    if (!res.ok) throw new Error('Failed to fetch tips');
    return res.json();
  },

  async likeTip(id: string): Promise<{ tip: EducationalTip }> {
    const res = await authFetch(`/api/tips/${id}/like`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to like tip');
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const res = await authFetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<{ notification: NotificationItem }> {
    const res = await authFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to mark notification read');
    return res.json();
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    const res = await authFetch('/api/notifications/read-all', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to mark all notifications read');
    return res.json();
  },

  // Admin APIs
  async getAdminOverview(): Promise<any> {
    const res = await authFetch('/api/admin/overview');
    if (!res.ok) throw new Error('Failed to fetch admin overview');
    return res.json();
  },

  async getAdminMetrics(): Promise<{ metrics: SystemMetrics }> {
    const res = await authFetch('/api/admin/metrics');
    if (!res.ok) throw new Error('Failed to fetch admin metrics');
    return res.json();
  },

  async getAdminUsers(): Promise<{ users: any[] }> {
    const res = await authFetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to fetch admin users');
    return res.json();
  },

  async updateUserStatus(id: string, status: string): Promise<{ success: boolean; user?: any }> {
    const res = await authFetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
  },

  async updateUserRole(id: string, role: string): Promise<{ success: boolean; user?: any }> {
    const res = await authFetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  async updateAdminUser(id: string, updates: Partial<User>): Promise<{ user: User }> {
    const res = await authFetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  async deleteAdminUser(id: string): Promise<{ success: boolean }> {
    const res = await authFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await authFetch('/api/admin/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async broadcastNotification(title: string, message: string, type: string): Promise<{ success: boolean }> {
    const res = await authFetch('/api/admin/broadcast-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message, type }),
    });
    if (!res.ok) throw new Error('Failed to broadcast notification');
    return res.json();
  },

  async addAdminRecommendation(rec: Partial<Recommendation>): Promise<{ recommendation: Recommendation }> {
    const res = await authFetch('/api/admin/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rec),
    });
    if (!res.ok) throw new Error('Failed to add recommendation');
    return res.json();
  },

  async addAdminTip(tip: Partial<EducationalTip>): Promise<{ tip: EducationalTip }> {
    const res = await authFetch('/api/admin/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tip),
    });
    if (!res.ok) throw new Error('Failed to add tip');
    return res.json();
  },
};
