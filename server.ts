import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily or safely
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// In-Memory Database State
interface DBUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar: string;
  streak: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    emailDigest: 'daily' | 'weekly' | 'none';
    soundEnabled: boolean;
    dailyGoalReminderTime: string;
  };
}

const users: DBUser[] = [
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    email: 'alex@cit.edu.in',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    streak: 30, // 30 continuous active days in verified longitudinal history
    isVerified: true,
    isActive: true,
    createdAt: '2026-08-15T09:00:00Z',
    lastLoginAt: new Date().toISOString(),
    settings: {
      theme: 'system',
      notificationsEnabled: true,
      emailDigest: 'weekly',
      soundEnabled: true,
      dailyGoalReminderTime: '20:30',
    },
  },
  {
    id: 'usr_admin',
    name: 'Dr. Elena Vance (Lead Neuroscientist)',
    email: 'admin@dopamineflow.io',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    streak: 14,
    isVerified: true,
    isActive: true,
    createdAt: '2026-07-01T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
    settings: {
      theme: 'dark',
      notificationsEnabled: true,
      emailDigest: 'daily',
      soundEnabled: false,
      dailyGoalReminderTime: '19:00',
    },
  },
  {
    id: 'usr_sophia',
    name: 'Sophia Chen',
    email: 'sophia.c@metaverse.org',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    streak: 9,
    isVerified: true,
    isActive: true,
    createdAt: '2026-08-20T10:15:00Z',
    lastLoginAt: '2026-09-21T18:40:00Z',
    settings: {
      theme: 'light',
      notificationsEnabled: true,
      emailDigest: 'weekly',
      soundEnabled: true,
      dailyGoalReminderTime: '21:00',
    },
  },
  {
    id: 'usr_marcus',
    name: 'Marcus Brody',
    email: 'marcus.b@techlab.io',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    streak: 3,
    isVerified: true,
    isActive: false,
    createdAt: '2026-08-10T14:20:00Z',
    lastLoginAt: '2026-09-10T11:00:00Z',
    settings: {
      theme: 'dark',
      notificationsEnabled: false,
      emailDigest: 'none',
      soundEnabled: false,
      dailyGoalReminderTime: '20:00',
    },
  },
];

// Seed 30 Days of Longitudinal Daily Habit Entries
function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

const SEED_30_DAYS_DATA = [
  {
    daysAgo: 29,
    screenTimeHours: 8.8,
    socialMediaHours: 4.5,
    gamingHours: 2.2,
    studyHours: 1.2,
    workHours: 4.5,
    sleepHours: 5.2,
    exerciseMinutes: 10,
    meditationMinutes: 0,
    waterIntakeLiters: 1.2,
    mood: 2,
    notes: 'Starting out feeling overwhelmed by constant phone notifications and late night screen fatigue.',
    wellBeingScore: 35,
    dopamineScore: 30,
    riskLevel: 'Severe' as const,
    burnoutLevel: 'Elevated Risk' as const,
    sleepQuality: 'Poor' as const,
    focusScore: 32,
    dopamineTrend: 'depleted' as const,
    stimulationIndex: 90,
  },
  {
    daysAgo: 28,
    screenTimeHours: 8.5,
    socialMediaHours: 4.2,
    gamingHours: 1.8,
    studyHours: 1.5,
    workHours: 5.0,
    sleepHours: 5.5,
    exerciseMinutes: 10,
    meditationMinutes: 0,
    waterIntakeLiters: 1.3,
    mood: 2,
    notes: 'Compulsively checking feeds every 10 mins. Attention span felt shattered throughout the workday.',
    wellBeingScore: 37,
    dopamineScore: 32,
    riskLevel: 'Severe' as const,
    burnoutLevel: 'Elevated Risk' as const,
    sleepQuality: 'Poor' as const,
    focusScore: 34,
    dopamineTrend: 'depleted' as const,
    stimulationIndex: 88,
  },
  {
    daysAgo: 27,
    screenTimeHours: 8.2,
    socialMediaHours: 4.0,
    gamingHours: 1.5,
    studyHours: 1.8,
    workHours: 5.2,
    sleepHours: 5.6,
    exerciseMinutes: 15,
    meditationMinutes: 0,
    waterIntakeLiters: 1.4,
    mood: 2,
    notes: 'Tried working without phone but kept picking it up automatically. Craving high-dopamine novelty.',
    wellBeingScore: 40,
    dopamineScore: 35,
    riskLevel: 'Severe' as const,
    burnoutLevel: 'Elevated Risk' as const,
    sleepQuality: 'Poor' as const,
    focusScore: 38,
    dopamineTrend: 'depleted' as const,
    stimulationIndex: 85,
  },
  {
    daysAgo: 26,
    screenTimeHours: 7.9,
    socialMediaHours: 3.8,
    gamingHours: 1.5,
    studyHours: 2.0,
    workHours: 5.5,
    sleepHours: 5.8,
    exerciseMinutes: 15,
    meditationMinutes: 5,
    waterIntakeLiters: 1.5,
    mood: 3,
    notes: 'Decided to commit to daily habit tracking. Realized I spend over 4 hours just in short-form video loops.',
    wellBeingScore: 44,
    dopamineScore: 39,
    riskLevel: 'High' as const,
    burnoutLevel: 'Elevated Risk' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 42,
    dopamineTrend: 'depleted' as const,
    stimulationIndex: 82,
  },
  {
    daysAgo: 25,
    screenTimeHours: 7.8,
    socialMediaHours: 3.6,
    gamingHours: 1.2,
    studyHours: 2.0,
    workHours: 5.8,
    sleepHours: 6.0,
    exerciseMinutes: 20,
    meditationMinutes: 5,
    waterIntakeLiters: 1.6,
    mood: 3,
    notes: 'Placed phone in another room during dinner. First small step in building physical friction.',
    wellBeingScore: 47,
    dopamineScore: 42,
    riskLevel: 'High' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 46,
    dopamineTrend: 'depleted' as const,
    stimulationIndex: 78,
  },
  {
    daysAgo: 24,
    screenTimeHours: 7.5,
    socialMediaHours: 3.4,
    gamingHours: 1.2,
    studyHours: 2.2,
    workHours: 5.5,
    sleepHours: 6.0,
    exerciseMinutes: 20,
    meditationMinutes: 5,
    waterIntakeLiters: 1.7,
    mood: 3,
    notes: 'Turned off non-essential social notifications. Phantom vibrations still felt throughout afternoon.',
    wellBeingScore: 49,
    dopamineScore: 44,
    riskLevel: 'High' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 49,
    dopamineTrend: 'depleted' as const,
    stimulationIndex: 75,
  },
  {
    daysAgo: 23,
    screenTimeHours: 7.2,
    socialMediaHours: 3.2,
    gamingHours: 1.0,
    studyHours: 2.5,
    workHours: 5.8,
    sleepHours: 6.2,
    exerciseMinutes: 20,
    meditationMinutes: 5,
    waterIntakeLiters: 1.8,
    mood: 3,
    notes: 'Morning walk before checking email. Mind felt slightly clearer than previous days.',
    wellBeingScore: 52,
    dopamineScore: 47,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 53,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 71,
  },
  {
    daysAgo: 22,
    screenTimeHours: 7.0,
    socialMediaHours: 3.0,
    gamingHours: 1.0,
    studyHours: 2.5,
    workHours: 6.0,
    sleepHours: 6.3,
    exerciseMinutes: 25,
    meditationMinutes: 8,
    waterIntakeLiters: 1.8,
    mood: 3,
    notes: 'Weekend temptation hit hard but stopped gaming after 1 hour. Small win for impulse control.',
    wellBeingScore: 54,
    dopamineScore: 50,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 56,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 68,
  },
  {
    daysAgo: 21,
    screenTimeHours: 6.8,
    socialMediaHours: 2.8,
    gamingHours: 0.8,
    studyHours: 2.8,
    workHours: 5.5,
    sleepHours: 6.5,
    exerciseMinutes: 25,
    meditationMinutes: 8,
    waterIntakeLiters: 1.9,
    mood: 3,
    notes: 'Read 20 pages of physical book instead of scrolling in bed. Fell asleep 30 minutes faster.',
    wellBeingScore: 57,
    dopamineScore: 53,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 59,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 64,
  },
  {
    daysAgo: 20,
    screenTimeHours: 6.5,
    socialMediaHours: 2.6,
    gamingHours: 0.5,
    studyHours: 3.0,
    workHours: 5.8,
    sleepHours: 6.6,
    exerciseMinutes: 25,
    meditationMinutes: 10,
    waterIntakeLiters: 2.0,
    mood: 3,
    notes: 'Installed grayscale mode on smartphone. Surprising how unappealing social feeds look in monochrome.',
    wellBeingScore: 60,
    dopamineScore: 56,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Fair' as const,
    focusScore: 62,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 61,
  },
  {
    daysAgo: 19,
    screenTimeHours: 6.3,
    socialMediaHours: 2.4,
    gamingHours: 0.5,
    studyHours: 3.0,
    workHours: 6.0,
    sleepHours: 6.8,
    exerciseMinutes: 30,
    meditationMinutes: 10,
    waterIntakeLiters: 2.0,
    mood: 4,
    notes: 'Completed 60-minute continuous study block without checking browser tabs. Focus is returning.',
    wellBeingScore: 63,
    dopamineScore: 59,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Mild Fatigue' as const,
    sleepQuality: 'Good' as const,
    focusScore: 66,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 58,
  },
  {
    daysAgo: 18,
    screenTimeHours: 6.1,
    socialMediaHours: 2.2,
    gamingHours: 0.5,
    studyHours: 3.2,
    workHours: 6.0,
    sleepHours: 6.9,
    exerciseMinutes: 30,
    meditationMinutes: 10,
    waterIntakeLiters: 2.1,
    mood: 4,
    notes: 'Early morning sunlight exposure protocol initiated. Energy dip at 2pm was noticeably milder.',
    wellBeingScore: 66,
    dopamineScore: 62,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 69,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 55,
  },
  {
    daysAgo: 17,
    screenTimeHours: 5.9,
    socialMediaHours: 2.0,
    gamingHours: 0.0,
    studyHours: 3.2,
    workHours: 6.2,
    sleepHours: 7.0,
    exerciseMinutes: 30,
    meditationMinutes: 10,
    waterIntakeLiters: 2.2,
    mood: 4,
    notes: 'Zero gaming hours today. Replaced with gym strength session. Natural endorphin response felt clean.',
    wellBeingScore: 69,
    dopamineScore: 66,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 72,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 52,
  },
  {
    daysAgo: 16,
    screenTimeHours: 5.8,
    socialMediaHours: 1.9,
    gamingHours: 0.0,
    studyHours: 3.4,
    workHours: 6.0,
    sleepHours: 7.1,
    exerciseMinutes: 35,
    meditationMinutes: 12,
    waterIntakeLiters: 2.3,
    mood: 4,
    notes: 'Hydration goal achieved (2.3L). Mental alertness sustained through late afternoon tasks.',
    wellBeingScore: 71,
    dopamineScore: 68,
    riskLevel: 'Moderate' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 74,
    dopamineTrend: 'balanced' as const,
    stimulationIndex: 49,
  },
  {
    daysAgo: 15,
    screenTimeHours: 5.6,
    socialMediaHours: 1.8,
    gamingHours: 0.0,
    studyHours: 3.5,
    workHours: 6.0,
    sleepHours: 7.2,
    exerciseMinutes: 35,
    meditationMinutes: 12,
    waterIntakeLiters: 2.4,
    mood: 4,
    notes: 'Hit 15-day halfway milestone! Brain fog is almost entirely gone. Urge to check notifications is much lower.',
    wellBeingScore: 74,
    dopamineScore: 71,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 77,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 45,
  },
  {
    daysAgo: 14,
    screenTimeHours: 5.5,
    socialMediaHours: 1.7,
    gamingHours: 0.0,
    studyHours: 3.5,
    workHours: 6.2,
    sleepHours: 7.2,
    exerciseMinutes: 30,
    meditationMinutes: 12,
    waterIntakeLiters: 2.4,
    mood: 4,
    notes: 'Started work sprint in clean flow state. Phone kept in hallway during 90-minute morning deep block.',
    wellBeingScore: 76,
    dopamineScore: 73,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 79,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 42,
  },
  {
    daysAgo: 13,
    screenTimeHours: 5.3,
    socialMediaHours: 1.6,
    gamingHours: 0.0,
    studyHours: 3.5,
    workHours: 6.0,
    sleepHours: 7.3,
    exerciseMinutes: 35,
    meditationMinutes: 15,
    waterIntakeLiters: 2.5,
    mood: 4,
    notes: 'Morning outdoor run for 25 mins in bright sunlight. Dopamine baseline feels stable and calm.',
    wellBeingScore: 78,
    dopamineScore: 75,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 81,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 39,
  },
  {
    daysAgo: 12,
    screenTimeHours: 5.2,
    socialMediaHours: 1.5,
    gamingHours: 0.0,
    studyHours: 3.6,
    workHours: 6.2,
    sleepHours: 7.4,
    exerciseMinutes: 35,
    meditationMinutes: 15,
    waterIntakeLiters: 2.5,
    mood: 4,
    notes: 'Attended meetings without multitasking or glancing at phone. High conversational presence.',
    wellBeingScore: 80,
    dopamineScore: 77,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Good' as const,
    focusScore: 83,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 36,
  },
  {
    daysAgo: 11,
    screenTimeHours: 5.0,
    socialMediaHours: 1.4,
    gamingHours: 0.0,
    studyHours: 3.6,
    workHours: 6.2,
    sleepHours: 7.5,
    exerciseMinutes: 35,
    meditationMinutes: 15,
    waterIntakeLiters: 2.5,
    mood: 4,
    notes: 'Screen time capped right at 5.0 hours! Night wind-down routine with chamomile tea and reading.',
    wellBeingScore: 81,
    dopamineScore: 79,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 85,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 34,
  },
  {
    daysAgo: 10,
    screenTimeHours: 4.9,
    socialMediaHours: 1.3,
    gamingHours: 0.0,
    studyHours: 3.8,
    workHours: 6.0,
    sleepHours: 7.5,
    exerciseMinutes: 40,
    meditationMinutes: 15,
    waterIntakeLiters: 2.6,
    mood: 5,
    notes: '20-day mark passed! Neuroplastic adaptation is noticeable. Impulse to open apps is effectively silenced.',
    wellBeingScore: 83,
    dopamineScore: 81,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 87,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 31,
  },
  {
    daysAgo: 9,
    screenTimeHours: 4.8,
    socialMediaHours: 1.2,
    gamingHours: 0.0,
    studyHours: 3.5,
    workHours: 6.0,
    sleepHours: 7.6,
    exerciseMinutes: 40,
    meditationMinutes: 15,
    waterIntakeLiters: 2.6,
    mood: 5,
    notes: 'No phone during lunch break. Walked outside in park. Restorative sensory rest.',
    wellBeingScore: 84,
    dopamineScore: 82,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 88,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 29,
  },
  {
    daysAgo: 8,
    screenTimeHours: 4.7,
    socialMediaHours: 1.1,
    gamingHours: 0.0,
    studyHours: 3.8,
    workHours: 6.0,
    sleepHours: 7.6,
    exerciseMinutes: 35,
    meditationMinutes: 15,
    waterIntakeLiters: 2.6,
    mood: 5,
    notes: 'Ultradian 90-minute work session executed with zero tab switching. Prefrontal stamina is at peak.',
    wellBeingScore: 85,
    dopamineScore: 83,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 89,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 27,
  },
  {
    daysAgo: 7,
    screenTimeHours: 4.6,
    socialMediaHours: 1.0,
    gamingHours: 0.0,
    studyHours: 3.8,
    workHours: 6.2,
    sleepHours: 7.7,
    exerciseMinutes: 40,
    meditationMinutes: 15,
    waterIntakeLiters: 2.7,
    mood: 5,
    notes: 'Digital detox Sunday! Spent afternoon outdoors. Calm emotional baseline, zero anxiety.',
    wellBeingScore: 87,
    dopamineScore: 85,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 90,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 25,
  },
  {
    daysAgo: 6,
    screenTimeHours: 4.5,
    socialMediaHours: 1.0,
    gamingHours: 0.0,
    studyHours: 3.8,
    workHours: 6.2,
    sleepHours: 7.7,
    exerciseMinutes: 40,
    meditationMinutes: 15,
    waterIntakeLiters: 2.7,
    mood: 5,
    notes: 'Work sprint executed in complete flow state. Motivation feels intrinsic rather than caffeine-dependent.',
    wellBeingScore: 88,
    dopamineScore: 86,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 91,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 24,
  },
  {
    daysAgo: 5,
    screenTimeHours: 4.4,
    socialMediaHours: 0.9,
    gamingHours: 0.0,
    studyHours: 4.0,
    workHours: 6.0,
    sleepHours: 7.8,
    exerciseMinutes: 40,
    meditationMinutes: 15,
    waterIntakeLiters: 2.7,
    mood: 5,
    notes: 'Evening wind-down routine without screens for 60 minutes before bed. Deep sleep quality was superb.',
    wellBeingScore: 89,
    dopamineScore: 87,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 92,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 22,
  },
  {
    daysAgo: 4,
    screenTimeHours: 4.3,
    socialMediaHours: 0.8,
    gamingHours: 0.0,
    studyHours: 3.8,
    workHours: 6.2,
    sleepHours: 7.8,
    exerciseMinutes: 45,
    meditationMinutes: 18,
    waterIntakeLiters: 2.8,
    mood: 5,
    notes: 'Cold shower and morning sunlight window completed. Physical energy steady all 8 working hours.',
    wellBeingScore: 90,
    dopamineScore: 88,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 93,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 21,
  },
  {
    daysAgo: 3,
    screenTimeHours: 4.3,
    socialMediaHours: 0.8,
    gamingHours: 0.0,
    studyHours: 4.0,
    workHours: 6.0,
    sleepHours: 7.8,
    exerciseMinutes: 40,
    meditationMinutes: 18,
    waterIntakeLiters: 2.8,
    mood: 5,
    notes: 'Novelty-seeking urge is under conscious command. Work tasks that used to feel boring feel engaging.',
    wellBeingScore: 91,
    dopamineScore: 89,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 93,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 20,
  },
  {
    daysAgo: 2,
    screenTimeHours: 4.2,
    socialMediaHours: 0.7,
    gamingHours: 0.0,
    studyHours: 4.0,
    workHours: 6.2,
    sleepHours: 7.9,
    exerciseMinutes: 40,
    meditationMinutes: 20,
    waterIntakeLiters: 2.8,
    mood: 5,
    notes: 'Deep cognitive output achieved without burnout or cognitive fatigue. Dopamine receptors feel fully reset.',
    wellBeingScore: 92,
    dopamineScore: 90,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 94,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 19,
  },
  {
    daysAgo: 1,
    screenTimeHours: 4.2,
    socialMediaHours: 0.7,
    gamingHours: 0.0,
    studyHours: 4.0,
    workHours: 6.5,
    sleepHours: 8.0,
    exerciseMinutes: 45,
    meditationMinutes: 20,
    waterIntakeLiters: 3.0,
    mood: 5,
    notes: 'Personal best for uninterrupted deep focus. Energy levels balanced, mental clarity exceptional.',
    wellBeingScore: 92,
    dopamineScore: 90,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 95,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 18,
  },
  {
    daysAgo: 0,
    screenTimeHours: 4.1,
    socialMediaHours: 0.6,
    gamingHours: 0.0,
    studyHours: 3.8,
    workHours: 6.0,
    sleepHours: 7.8,
    exerciseMinutes: 35,
    meditationMinutes: 15,
    waterIntakeLiters: 2.6,
    mood: 5,
    notes: 'Today has been exceptionally productive. Morning sunlight within 15 min of waking, steady dopamine reserve.',
    wellBeingScore: 91,
    dopamineScore: 89,
    riskLevel: 'Low' as const,
    burnoutLevel: 'Optimal' as const,
    sleepQuality: 'Optimal' as const,
    focusScore: 94,
    dopamineTrend: 'rising' as const,
    stimulationIndex: 19,
  },
];

function generateLongitudinalHabitEntries(userId: string): any[] {
  return SEED_30_DAYS_DATA.map((item, idx) => ({
    id: `ent_${userId}_${30 - idx}`,
    userId,
    date: getPastDate(item.daysAgo),
    screenTimeHours: item.screenTimeHours,
    socialMediaHours: item.socialMediaHours,
    gamingHours: item.gamingHours,
    studyHours: item.studyHours,
    workHours: item.workHours,
    sleepHours: item.sleepHours,
    exerciseMinutes: item.exerciseMinutes,
    meditationMinutes: item.meditationMinutes,
    waterIntakeLiters: item.waterIntakeLiters,
    mood: item.mood,
    notes: item.notes,
    scores: {
      wellBeingScore: item.wellBeingScore,
      dopamineScore: item.dopamineScore,
      riskLevel: item.riskLevel,
      burnoutLevel: item.burnoutLevel,
      sleepQuality: item.sleepQuality,
      focusScore: item.focusScore,
      dopamineTrend: item.dopamineTrend,
      stimulationIndex: item.stimulationIndex,
    },
    createdAt: new Date(Date.now() - item.daysAgo * 86400000).toISOString(),
  }));
}

let dailyEntries: any[] = [...generateLongitudinalHabitEntries('usr_alex')];

// Goals Data
let goals = [
  {
    id: 'goal_1',
    userId: 'usr_alex',
    title: 'Cap Total Daily Screen Time below 5 Hours',
    category: 'screen_time' as const,
    targetValue: 5.0,
    currentValue: 4.1,
    unit: 'hours',
    period: 'daily' as const,
    isCompleted: true,
    streak: 30,
    deadline: '2026-10-01',
  },
  {
    id: 'goal_2',
    userId: 'usr_alex',
    title: 'Limit Social Media to max 45 Minutes',
    category: 'social_media' as const,
    targetValue: 0.75,
    currentValue: 0.6,
    unit: 'hours',
    period: 'daily' as const,
    isCompleted: true,
    streak: 30,
    deadline: '2026-10-01',
  },
  {
    id: 'goal_3',
    userId: 'usr_alex',
    title: 'Daily Mindfulness & Attentional Reset',
    category: 'meditation' as const,
    targetValue: 15,
    currentValue: 15,
    unit: 'mins',
    period: 'daily' as const,
    isCompleted: true,
    streak: 25,
    deadline: '2026-10-15',
  },
  {
    id: 'goal_4',
    userId: 'usr_alex',
    title: 'Maintain Minimum 7.5 Hours Restorative Sleep',
    category: 'sleep' as const,
    targetValue: 7.5,
    currentValue: 7.8,
    unit: 'hours',
    period: 'daily' as const,
    isCompleted: true,
    streak: 30,
    deadline: '2026-10-30',
  },
  {
    id: 'goal_5',
    userId: 'usr_alex',
    title: 'Hydration Target: 2.5 Liters Pure Water',
    category: 'water' as const,
    targetValue: 2.5,
    currentValue: 2.5,
    unit: 'liters',
    period: 'daily' as const,
    isCompleted: true,
    streak: 30,
    deadline: '2026-10-10',
  },
];

// Curated AI & Knowledge Base Recommendations
let recommendations = [
  {
    id: 'rec_1',
    userId: 'usr_alex',
    title: 'The 30-Minute Morning Dopamine Delay Protocol',
    description: 'Avoid checking high-stimulation smartphone apps, feeds, and group chats for the first 30 minutes after waking. Let cortisol naturally clear and allow adenylate cyclase baseline to establish.',
    actionableStep: 'Place phone charger in hallway before sleep tonight. Replace morning phone check with 12 oz water and 5 deep diaphragmatic breaths.',
    category: 'dopamine_reset' as const,
    impact: 'High' as const,
    difficulty: 'Moderate' as const,
    estimatedMinutes: 30,
    isCompleted: false,
    isDismissed: false,
    source: 'ai_engine' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_2',
    userId: 'usr_alex',
    title: 'Circadian Photobiology: 10k Lux Natural Sunlight',
    description: 'Early retinal exposure to blue and ultraviolet photons triggers supra-chiasmatic dopamine synthesis, setting your internal 14-hour melatonin timer for deep NREM restorative sleep.',
    actionableStep: 'Step outside within 30 minutes of waking for 10-15 minutes without sunglasses.',
    category: 'sleep_hygiene' as const,
    impact: 'High' as const,
    difficulty: 'Easy' as const,
    estimatedMinutes: 15,
    isCompleted: true,
    isDismissed: false,
    source: 'knowledge_base' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_3',
    userId: 'usr_alex',
    title: 'Deploy Grayscale Screen Filter to Kill Visual Novelty',
    description: 'App interfaces utilize high-saturation red and orange notification badges engineered to activate your evolutionary foraging and predator-detection reflex. Grayscale removes 70% of instant dopamine craving.',
    actionableStep: 'Turn on iOS/Android triple-click Accessibility shortcut for Grayscale Color Filters.',
    category: 'screen_reduction' as const,
    impact: 'Medium' as const,
    difficulty: 'Easy' as const,
    estimatedMinutes: 5,
    isCompleted: true,
    isDismissed: false,
    source: 'knowledge_base' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_4',
    userId: 'usr_alex',
    title: 'The 90-Minute Ultradian Focus & Attentional Recovery',
    description: 'Human cognitive architecture operates in ~90 minute ultradian cycles. Switching tasks mid-block creates Attentional Residue, draining your prefrontal cortex dopamine stores.',
    actionableStep: 'Set a mechanical timer for 90 minutes. Close all browser tabs except the primary task.',
    category: 'focus_boost' as const,
    impact: 'High' as const,
    difficulty: 'Moderate' as const,
    estimatedMinutes: 90,
    isCompleted: false,
    isDismissed: false,
    source: 'ai_engine' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_5',
    userId: 'usr_alex',
    title: 'Non-Sleep Deep Rest (NSDR) Midday Reset',
    description: 'A 15-minute NSDR / Yoga Nidra session has been clinically demonstrated to restore striatal dopamine levels by up to 65% following high cognitive load.',
    actionableStep: 'Lie down in a quiet room, close eyes, and complete a 15-minute guided body scan protocol.',
    category: 'mindfulness' as const,
    impact: 'High' as const,
    difficulty: 'Easy' as const,
    estimatedMinutes: 15,
    isCompleted: false,
    isDismissed: false,
    source: 'knowledge_base' as const,
    createdAt: new Date().toISOString(),
  },
];

// Educational Tips Library
let educationalTips = [
  {
    id: 'tip_1',
    title: 'Understanding the Dopamine Baseline: Spikes vs Baselines',
    category: 'Dopamine' as const,
    readTime: '4 min read',
    summary: 'Why acute pleasure spikes from video reels inevitably lower your baseline dopamine, leading to anhedonia and brain fog.',
    content: 'Dopamine is not the molecule of reward—it is the molecule of anticipation, craving, and drive. When you receive an unpredictable, high-speed reward (such as infinite algorithm-curated short videos or notifications), dopamine peaks abruptly. Crucially, the neurobiology of the mammalian brain dictates that following every peak, dopamine drops to a trough below the pre-existing baseline. Repeated spikes downregulate D2 receptor density, producing feelings of lethargy, apathy, and difficulty focusing on low-stimulation tasks like reading or coding.',
    scientificReference: 'Lembke, A. (2021). Dopamine Nation: Finding Balance in the Age of Indulgence. Dutton.',
    tags: ['Dopamine Waveform', 'D2 Receptors', 'Downregulation'],
    likes: 248,
  },
  {
    id: 'tip_2',
    title: 'Attentional Residue: The Hidden Cost of Micro-Checking',
    category: 'Focus & Flow' as const,
    readTime: '3 min read',
    summary: 'What actually happens in your prefrontal cortex when you glance at your phone for just 10 seconds during deep work.',
    content: 'Dr. Sophie Leroy coined the term "Attentional Residue" to describe the neuro-computational drag that occurs when you switch from Task A to Task B. Even a brief 5-second check of a notification leaves a portion of your executive working memory stuck processing the secondary stimulus. Research indicates it requires an average of 23 minutes and 15 seconds to return to the original depth of cognitive flow.',
    scientificReference: 'Leroy, S. (2009). Why is it so hard to do my work? Attentional residue and executive function. Organization Science.',
    tags: ['Deep Work', 'Cognitive Switching', 'Prefrontal Cortex'],
    likes: 195,
  },
  {
    id: 'tip_3',
    title: 'Blue Light at Night: Retinal Ganglion Cells and Melatonin',
    category: 'Circadian Biology' as const,
    readTime: '5 min read',
    summary: 'The precise molecular pathway through which 480nm photon wavelength suppresses sleep architecture.',
    content: 'Intrinsically photosensitive Retinal Ganglion Cells (ipRGCs) contain the photopigment melanopsin, which is maximally sensitive to 460-490 nm wavelength light emitted by smartphone and OLED displays. When stimulated in the evening, ipRGCs signal the suprachiasmatic nucleus (SCN) to inhibit the pineal gland from secreting melatonin. This shifts sleep architecture, severely diminishing Stage 3/4 Slow-Wave Delta sleep where neuro-toxins and beta-amyloid are cleared via the glymphatic system.',
    scientificReference: 'Bailes, H. J., & Lucas, R. J. (2013). Melanopsin phototransduction and circadian entrainment. Nature Reviews Neuroscience.',
    tags: ['Melanopsin', 'Glymphatic System', 'Slow-Wave Sleep'],
    likes: 312,
  },
  {
    id: 'tip_4',
    title: 'The Neuroscience of Friction: Why Environment Trumps Willpower',
    category: 'Digital Detox' as const,
    readTime: '4 min read',
    summary: 'How introducing 20 seconds of physical friction dismantles compulsive habit loops.',
    content: 'The basal ganglia automates habit loops (Cue -> Routine -> Reward). Willpower is an energetically expensive resource managed by the prefrontal cortex, which fatigues as glucose and neuromodulators deplete throughout the day. By placing physical friction (e.g. charging phones in another room, deleting apps, using lockboxes, removing biometric autofill), you force the executive brain back online before the autonomic habit loop can execute.',
    scientificReference: 'Wood, W., & Neal, D. T. (2009). The habitual consumer. Journal of Consumer Psychology.',
    tags: ['Basal Ganglia', 'Habit Loops', 'Friction Architecture'],
    likes: 164,
  },
];

// System Audit Logs
interface DBAuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

let auditLogs: DBAuditLog[] = [
  {
    id: 'aud_1',
    action: 'USER_LOGIN',
    details: 'User authenticated via email credential flow',
    performedBy: 'Alex Rivera',
    userEmail: 'alex@cit.edu.in',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    ipAddress: '192.168.1.104',
    status: 'SUCCESS',
  },
  {
    id: 'aud_2',
    action: 'HABIT_ENTRY_RECORDED',
    details: 'Daily health tracker metrics logged for 2026-09-22',
    performedBy: 'Alex Rivera',
    userEmail: 'alex@cit.edu.in',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    ipAddress: '192.168.1.104',
    status: 'SUCCESS' as const,
  },
  {
    id: 'aud_3',
    action: 'AI_INSIGHT_GENERATION',
    details: 'Synthesized neuro-cognitive diagnosis via Gemini 3.8 Flash',
    performedBy: 'SYSTEM_DAEMON',
    userEmail: 'alex@cit.edu.in',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    ipAddress: '127.0.0.1',
    status: 'SUCCESS' as const,
  },
  {
    id: 'aud_4',
    action: 'SECURITY_SCAN',
    details: 'OWASP header compliance and rate-limiting audit passed',
    performedBy: 'SEC_GUARD_BOT',
    userEmail: 'admin@dopamineflow.io',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    ipAddress: '10.0.0.1',
    status: 'SUCCESS' as const,
  },
];

// User Notifications
let notifications = [
  {
    id: 'notif_1',
    userId: 'usr_alex',
    title: 'Streak Milestone Unlocked!',
    message: 'You have maintained your low-stimulation screen goal for 6 consecutive days.',
    type: 'achievement' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'usr_alex',
    title: 'Dopamine Baseline Rising',
    message: 'Your 7-day average dopamine score improved by +18% compared to last week.',
    type: 'milestone' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'notif_3',
    userId: 'usr_alex',
    title: 'Circadian Reminder',
    message: 'Sunlight window is open! Step outdoors for 10 minutes to sync your biological clock.',
    type: 'recommendation' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

// Multi-User Session Store: Token -> UserId
const activeSessions = new Map<string, string>();
const DEFAULT_ALEX_TOKEN = 'tok_usr_alex_default_session';
activeSessions.set(DEFAULT_ALEX_TOKEN, 'usr_alex');

// Helper to authenticate request via Bearer token or x-auth-token header
function getAuthUser(req: express.Request): DBUser | null {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  if (token && activeSessions.has(token)) {
    const userId = activeSessions.get(token);
    const user = users.find((u) => u.id === userId);
    if (user && user.isActive) return user;
  }
  return null;
}

// Calculate user streak dynamically based on unbroken consecutive active daily habit entries
function calculateUserStreak(userId: string): number {
  const userEntries = dailyEntries
    .filter((e) => e.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (userEntries.length === 0) return 0;

  const uniqueDates = Array.from(new Set(userEntries.map((e) => e.date.split('T')[0]))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  let prevDate = new Date(uniqueDates[0] + 'T00:00:00Z');

  for (let i = 1; i < uniqueDates.length; i++) {
    const currDate = new Date(uniqueDates[i] + 'T00:00:00Z');
    const diffTime = prevDate.getTime() - currDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      prevDate = currDate;
    } else {
      break;
    }
  }

  return streak;
}

// Initial onboarding & habit seeding for new user accounts: starts with genuine 1-day active streak
function seedNewUserInitialData(userId: string, name?: string, email?: string) {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Seed 1 genuine initial Day 1 entry for today so the user starts with true Day 1 active streak
  const existingEntries = dailyEntries.filter((e) => e.userId === userId);
  if (existingEntries.length === 0) {
    const day1Scores = calculateHabitScores({
      screenTimeHours: 4.8,
      socialMediaHours: 1.0,
      gamingHours: 0.0,
      studyHours: 3.0,
      workHours: 5.5,
      sleepHours: 7.5,
      exerciseMinutes: 30,
      meditationMinutes: 10,
      waterIntakeLiters: 2.4,
      mood: 4,
    });

    const day1Entry = {
      id: `ent_${userId}_day1`,
      userId,
      date: todayStr,
      screenTimeHours: 4.8,
      socialMediaHours: 1.0,
      gamingHours: 0.0,
      studyHours: 3.0,
      workHours: 5.5,
      sleepHours: 7.5,
      exerciseMinutes: 30,
      meditationMinutes: 10,
      waterIntakeLiters: 2.4,
      mood: 4,
      notes: 'Day 1 of Dopamine Detox habit journey initialized.',
      scores: day1Scores,
      createdAt: new Date().toISOString(),
    };
    dailyEntries.unshift(day1Entry);
  }

  // 2. Seed starter goals with 1-day streak and matching current values
  const existingGoals = goals.filter((g) => g.userId === userId);
  if (existingGoals.length === 0) {
    const defaultGoals = [
      {
        id: `goal_${userId}_1`,
        userId,
        title: 'Cap Total Daily Screen Time below 5.0 Hours',
        category: 'screen_time' as const,
        targetValue: 5.0,
        currentValue: 4.8,
        unit: 'hours',
        period: 'daily' as const,
        isCompleted: true,
        streak: 1,
        deadline: '2026-10-30',
      },
      {
        id: `goal_${userId}_2`,
        userId,
        title: 'Limit Social Media Feeds to max 45 Minutes',
        category: 'social_media' as const,
        targetValue: 0.75,
        currentValue: 1.0,
        unit: 'hours',
        period: 'daily' as const,
        isCompleted: false,
        streak: 0,
        deadline: '2026-10-30',
      },
      {
        id: `goal_${userId}_3`,
        userId,
        title: 'Daily Mindfulness & Attentional Reset',
        category: 'meditation' as const,
        targetValue: 15,
        currentValue: 10,
        unit: 'mins',
        period: 'daily' as const,
        isCompleted: false,
        streak: 1,
        deadline: '2026-10-30',
      },
      {
        id: `goal_${userId}_4`,
        userId,
        title: 'Maintain Minimum 7.5 Hours Restorative Sleep',
        category: 'sleep' as const,
        targetValue: 7.5,
        currentValue: 7.5,
        unit: 'hours',
        period: 'daily' as const,
        isCompleted: true,
        streak: 1,
        deadline: '2026-10-30',
      },
      {
        id: `goal_${userId}_5`,
        userId,
        title: 'Hydration Target: 2.5 Liters Pure Water',
        category: 'water' as const,
        targetValue: 2.5,
        currentValue: 2.4,
        unit: 'liters',
        period: 'daily' as const,
        isCompleted: false,
        streak: 1,
        deadline: '2026-10-30',
      },
    ];
    goals.push(...defaultGoals);
  }

  // 3. Seed personalized AI recommendations if none exist
  const existingRecs = recommendations.filter((r) => r.userId === userId);
  if (existingRecs.length === 0) {
    const userRecs = [
      {
        id: `rec_${userId}_1`,
        userId,
        title: 'The 30-Minute Morning Dopamine Delay Protocol',
        description: 'Avoid checking high-stimulation smartphone apps, feeds, and group chats for the first 30 minutes after waking. Let cortisol naturally clear and allow adenylate cyclase baseline to establish.',
        actionableStep: 'Place phone charger in hallway before sleep tonight. Replace morning phone check with 12 oz water and 5 deep diaphragmatic breaths.',
        category: 'dopamine_reset' as const,
        impact: 'High' as const,
        difficulty: 'Moderate' as const,
        estimatedMinutes: 30,
        isCompleted: false,
        isDismissed: false,
        source: 'ai_engine' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: `rec_${userId}_2`,
        userId,
        title: 'Circadian Photobiology: 10k Lux Natural Sunlight',
        description: 'Early retinal exposure to blue and ultraviolet photons triggers supra-chiasmatic dopamine synthesis, setting your internal 14-hour melatonin timer for deep NREM restorative sleep.',
        actionableStep: 'Step outside within 30 minutes of waking for 10-15 minutes without sunglasses.',
        category: 'sleep_hygiene' as const,
        impact: 'High' as const,
        difficulty: 'Easy' as const,
        estimatedMinutes: 15,
        isCompleted: false,
        isDismissed: false,
        source: 'knowledge_base' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: `rec_${userId}_3`,
        userId,
        title: 'Deploy Grayscale Screen Filter to Kill Visual Novelty',
        description: 'App interfaces utilize high-saturation notification badges engineered to activate your evolutionary foraging reflex. Grayscale removes 70% of instant dopamine craving.',
        actionableStep: 'Turn on iOS/Android triple-click Accessibility shortcut for Grayscale Color Filters.',
        category: 'screen_reduction' as const,
        impact: 'Medium' as const,
        difficulty: 'Easy' as const,
        estimatedMinutes: 5,
        isCompleted: false,
        isDismissed: false,
        source: 'knowledge_base' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: `rec_${userId}_4`,
        userId,
        title: 'The 90-Minute Ultradian Focus & Attentional Recovery',
        description: 'Human cognitive architecture operates in ~90 minute ultradian cycles. Switching tasks mid-block creates Attentional Residue, draining your prefrontal cortex dopamine stores.',
        actionableStep: 'Set a mechanical timer for 90 minutes. Close all browser tabs except the primary task.',
        category: 'focus_boost' as const,
        impact: 'High' as const,
        difficulty: 'Moderate' as const,
        estimatedMinutes: 90,
        isCompleted: false,
        isDismissed: false,
        source: 'ai_engine' as const,
        createdAt: new Date().toISOString(),
      },
    ];
    recommendations.push(...userRecs);
  }

  // 4. Seed user milestone notifications for Day 1
  const existingNotifs = notifications.filter((n) => n.userId === userId);
  if (existingNotifs.length === 0) {
    const userNotifs = [
      {
        id: `notif_${userId}_1`,
        userId,
        title: 'Day 1 Habit Streak Activated! 🔥',
        message: 'Welcome to your dopamine detox protocol. You completed Day 1 baseline check-in. Continue logging daily to build consecutive momentum.',
        type: 'achievement' as const,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `notif_${userId}_2`,
        userId,
        title: 'Neural Baseline Initialized 📈',
        message: 'Your Day 1 biometric snapshot is calibrated. Continue logging tomorrow to build consecutive momentum.',
        type: 'milestone' as const,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];
    notifications.push(...userNotifs);
  }
}

// --- REST API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.4.0-production',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Authentication APIs
app.get('/api/auth/me', (req, res) => {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return res.json({ user: null });
  }
  authUser.streak = calculateUserStreak(authUser.id);
  res.json({ user: authUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    if (cleanEmail === 'alex@example.com' || cleanEmail === 'alex@cit.edu.in') {
      user = users.find((u) => u.id === 'usr_alex');
    } else if (cleanEmail === 'admin@example.com' || cleanEmail === 'admin@dopamineflow.io') {
      user = users.find((u) => u.id === 'usr_admin');
    } else if (cleanEmail === 'sophia@example.com' || cleanEmail === 'sophia.c@metaverse.org') {
      user = users.find((u) => u.id === 'usr_sophia');
    }
  }

  if (user) {
    if (!user.isActive) {
      return res.status(403).json({ error: 'This user account has been deactivated by an administrator.' });
    }
    user.lastLoginAt = new Date().toISOString();
    user.streak = calculateUserStreak(user.id);
    const token = `tok_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    activeSessions.set(token, user.id);

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      action: 'USER_LOGIN',
      details: `User ${user.email} authenticated successfully`,
      performedBy: user.name,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
      status: 'SUCCESS',
    });

    return res.json({ user, token });
  }

  // Automatic onboarding for new emails so any user can register and log in instantly
  const newId = `usr_${Date.now()}`;
  const newUser: DBUser = {
    id: newId,
    name: (email || '').split('@')[0],
    email: cleanEmail,
    role: cleanEmail.includes('admin') ? 'ADMIN' : 'USER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    streak: 1, // Genuine 1-day active streak for newly initialized account
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    settings: {
      theme: 'system',
      notificationsEnabled: true,
      emailDigest: 'weekly',
      soundEnabled: true,
      dailyGoalReminderTime: '20:00',
    },
  };
  users.push(newUser);
  seedNewUserInitialData(newId, newUser.name, newUser.email);
  newUser.streak = calculateUserStreak(newId);
  const token = `tok_${newId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  activeSessions.set(token, newId);

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    action: 'USER_REGISTER',
    details: `User registered: ${newUser.name} (${newUser.email}) with 1-day initial streak initialized`,
    performedBy: newUser.name,
    userEmail: newUser.email,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.json({ user: newUser, token });
});

app.post('/api/auth/switch-account', (req, res) => {
  const { role, email } = req.body;
  let target: DBUser | undefined;
  if (email) {
    target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  if (!target && role) {
    target = users.find((u) => u.role === role);
  }

  if (target) {
    target.streak = calculateUserStreak(target.id);
    const token = `tok_${target.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    activeSessions.set(token, target.id);

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      action: 'ACCOUNT_SWITCH',
      details: `Switched active profile to ${target.name} (${target.role})`,
      performedBy: target.name,
      userEmail: target.email,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
      status: 'SUCCESS',
    });

    return res.json({ user: target, token });
  }
  res.status(404).json({ error: 'User account not found' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists. Please sign in instead.' });
  }

  const newId = `usr_${Date.now()}`;
  const newUser: DBUser = {
    id: newId,
    name: name || cleanEmail.split('@')[0],
    email: cleanEmail,
    role: cleanEmail.includes('admin') ? 'ADMIN' : 'USER',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    streak: 1, // Genuine 1-day active streak for newly registered user
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    settings: {
      theme: 'system',
      notificationsEnabled: true,
      emailDigest: 'weekly',
      soundEnabled: true,
      dailyGoalReminderTime: '20:30',
    },
  };
  users.push(newUser);
  seedNewUserInitialData(newId, newUser.name, newUser.email);
  newUser.streak = calculateUserStreak(newId);
  const token = `tok_${newId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  activeSessions.set(token, newId);

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    action: 'USER_REGISTER',
    details: `User registered: ${newUser.name} (${newUser.email}) with 1-day active streak initialized`,
    performedBy: newUser.name,
    userEmail: newUser.email,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.status(201).json({ user: newUser, token });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  if (token) {
    const userId = activeSessions.get(token);
    const user = users.find((u) => u.id === userId);
    activeSessions.delete(token);

    if (user) {
      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        action: 'USER_LOGOUT',
        details: `User ${user.email} signed out`,
        performedBy: user.name,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1',
        status: 'SUCCESS',
      });
    }
  }

  res.json({ success: true });
});

app.post('/api/auth/google', (req, res) => {
  const googleUser = users[0]; // Alex Rivera
  googleUser.lastLoginAt = new Date().toISOString();
  googleUser.streak = calculateUserStreak(googleUser.id);
  const token = `tok_${googleUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  activeSessions.set(token, googleUser.id);
  res.json({ user: googleUser, token });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({ success: true, message: `Password reset instructions sent to ${email}` });
});

app.post('/api/auth/reset-password', (req, res) => {
  res.json({ success: true, message: 'Password has been updated successfully.' });
});

// User Profile & Settings
app.put('/api/user/profile', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const { name, avatar, settings } = req.body;
  if (name) authUser.name = name;
  if (avatar) authUser.avatar = avatar;
  if (settings) authUser.settings = { ...authUser.settings, ...settings };
  res.json({ user: authUser });
});

// Daily Entries APIs
app.get('/api/entries', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const targetUserId = (req.query.userId as string) || authUser.id;
  const userEntries = dailyEntries
    .filter((e) => e.userId === targetUserId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json({ entries: userEntries });
});

app.post('/api/entries', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const {
    date,
    screenTimeHours,
    socialMediaHours,
    gamingHours,
    studyHours,
    workHours,
    sleepHours,
    exerciseMinutes,
    meditationMinutes,
    waterIntakeLiters,
    mood,
    notes,
    scores,
  } = req.body;

  // Check if entry for date already exists, update or insert
  const existingIdx = dailyEntries.findIndex(
    (e) => e.userId === authUser.id && e.date === date
  );

  const entryRecord = {
    id: existingIdx >= 0 ? dailyEntries[existingIdx].id : `ent_${Date.now()}`,
    userId: authUser.id,
    date,
    screenTimeHours: Number(screenTimeHours) || 0,
    socialMediaHours: Number(socialMediaHours) || 0,
    gamingHours: Number(gamingHours) || 0,
    studyHours: Number(studyHours) || 0,
    workHours: Number(workHours) || 0,
    sleepHours: Number(sleepHours) || 0,
    exerciseMinutes: Number(exerciseMinutes) || 0,
    meditationMinutes: Number(meditationMinutes) || 0,
    waterIntakeLiters: Number(waterIntakeLiters) || 0,
    mood: Number(mood) || 3,
    notes: notes || '',
    scores,
    createdAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    dailyEntries[existingIdx] = entryRecord;
  } else {
    dailyEntries.unshift(entryRecord);
  }

  // Calculate new streak for user and goals
  const updatedStreak = calculateUserStreak(authUser.id);
  authUser.streak = updatedStreak;

  // Check goals progress
  goals.forEach((g) => {
    if (g.userId === authUser.id) {
      if (g.category === 'screen_time') {
        g.currentValue = entryRecord.screenTimeHours;
        g.isCompleted = g.currentValue <= g.targetValue;
      } else if (g.category === 'social_media') {
        g.currentValue = entryRecord.socialMediaHours;
        g.isCompleted = g.currentValue <= g.targetValue;
      } else if (g.category === 'meditation') {
        g.currentValue = entryRecord.meditationMinutes;
        g.isCompleted = g.currentValue >= g.targetValue;
      } else if (g.category === 'sleep') {
        g.currentValue = entryRecord.sleepHours;
        g.isCompleted = g.currentValue >= g.targetValue;
      } else if (g.category === 'water') {
        g.currentValue = entryRecord.waterIntakeLiters;
        g.isCompleted = g.currentValue >= g.targetValue;
      }
      if (g.isCompleted) {
        g.streak = Math.max(g.streak, updatedStreak);
      }
    }
  });

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    action: 'HABIT_ENTRY_RECORDED',
    details: `Entry recorded for ${date} with Well-Being Score ${scores.wellBeingScore} (Streak: ${updatedStreak}d)`,
    performedBy: authUser.name,
    userEmail: authUser.email,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
  });

  res.status(201).json({ entry: entryRecord, streak: updatedStreak });
});

app.delete('/api/entries/:id', (req, res) => {
  const { id } = req.params;
  dailyEntries = dailyEntries.filter((e) => e.id !== id);
  res.json({ success: true });
});

// Goals APIs
app.get('/api/goals', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  let userGoals = goals.filter((g) => g.userId === authUser.id);
  if (userGoals.length === 0) {
    seedNewUserInitialData(authUser.id, authUser.name, authUser.email);
    userGoals = goals.filter((g) => g.userId === authUser.id);
  }
  res.json({ goals: userGoals });
});

app.post('/api/goals', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const newGoal = {
    id: `goal_${Date.now()}`,
    userId: authUser.id,
    ...req.body,
    currentValue: 0,
    isCompleted: false,
    streak: 1,
  };
  goals.push(newGoal);
  res.status(201).json({ goal: newGoal });
});

app.patch('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  const goal = goals.find((g) => g.id === id);
  if (goal) {
    Object.assign(goal, req.body);
    return res.json({ goal });
  }
  res.status(404).json({ error: 'Goal not found' });
});

app.delete('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  goals = goals.filter((g) => g.id !== id);
  res.json({ success: true });
});

// Recommendations APIs
app.get('/api/recommendations', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const userRecs = recommendations.filter((r) => r.userId === authUser.id || !r.userId);
  res.json({ recommendations: userRecs.length > 0 ? userRecs : recommendations });
});

app.post('/api/recommendations/:id/complete', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const { id } = req.params;
  const rec = recommendations.find((r) => r.id === id);
  if (rec) {
    rec.isCompleted = true;
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: authUser.id,
      title: 'Protocol Completed!',
      message: `You marked "${rec.title}" as completed. Great job reclaiming your dopamine baseline!`,
      type: 'achievement',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    return res.json({ recommendation: rec });
  }
  res.status(404).json({ error: 'Recommendation not found' });
});

app.post('/api/recommendations/:id/dismiss', (req, res) => {
  const { id } = req.params;
  const rec = recommendations.find((r) => r.id === id);
  if (rec) {
    rec.isDismissed = true;
    return res.json({ recommendation: rec });
  }
  res.status(404).json({ error: 'Recommendation not found' });
});

// Educational Tips APIs
app.get('/api/tips', (req, res) => {
  res.json({ tips: educationalTips });
});

app.post('/api/tips/:id/like', (req, res) => {
  const { id } = req.params;
  const tip = educationalTips.find((t) => t.id === id);
  if (tip) {
    tip.likes += 1;
    return res.json({ tip });
  }
  res.status(404).json({ error: 'Tip not found' });
});

// Notifications APIs
app.get('/api/notifications', (req, res) => {
  const authUser = getAuthUser(req) || users[0];
  const userNotifs = notifications.filter(
    (n) => n.userId === authUser.id || authUser.role === 'ADMIN'
  );
  res.json({ notifications: userNotifs });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    return res.json({ notification: notif });
  }
  res.status(404).json({ error: 'Notification not found' });
});

app.post('/api/notifications/read-all', (req, res) => {
  notifications.forEach((n) => (n.isRead = true));
  res.json({ success: true });
});

// AI Engine Diagnosis API via @google/genai
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { recentEntries } = req.body;
    const entriesToAnalyze = recentEntries || dailyEntries.slice(0, 7);

    // Calculate averages
    const avgScreenTime = (
      entriesToAnalyze.reduce((acc: number, e: any) => acc + (e.screenTimeHours || 0), 0) /
      (entriesToAnalyze.length || 1)
    ).toFixed(1);
    const avgSocial = (
      entriesToAnalyze.reduce((acc: number, e: any) => acc + (e.socialMediaHours || 0), 0) /
      (entriesToAnalyze.length || 1)
    ).toFixed(1);
    const avgSleep = (
      entriesToAnalyze.reduce((acc: number, e: any) => acc + (e.sleepHours || 0), 0) /
      (entriesToAnalyze.length || 1)
    ).toFixed(1);
    const avgDopamine = Math.round(
      entriesToAnalyze.reduce((acc: number, e: any) => acc + (e.scores?.dopamineScore || 70), 0) /
        (entriesToAnalyze.length || 1)
    );

    const client = getGeminiClient();

    if (client) {
      try {
        const prompt = `
You are an expert neuroscientist, behavioral psychologist, and digital well-being clinician.
Analyze the user's recent habit data:
- Average Screen Time: ${avgScreenTime} hours/day
- Average Social Media: ${avgSocial} hours/day
- Average Sleep: ${avgSleep} hours/night
- Calculated Dopamine Baseline Score: ${avgDopamine}/100

Provide a structured JSON response (strictly valid JSON with no markdown tags or explanations) conforming to:
{
  "clinicalDiagnosis": "2-3 sentences summarizing their dopamine system state, receptor sensitivity, and cognitive fatigue",
  "dopamineWaveform": "Description of their dopamine peaks vs troughs (e.g. erratic spikes with severe evening deficit)",
  "burnoutPrognosis": "Short risk forecast over the next 14 days if current habits persist",
  "primaryTrigger": "The #1 high-stimulation trigger to eliminate or friction-gate",
  "threeStepProtocol": [
    {
      "step": "Phase 1: Morning Anchor",
      "action": "Specific biological action within 30 min of waking",
      "rationale": "Neuroscience justification"
    },
    {
      "step": "Phase 2: Attentional Work Fence",
      "action": "Specific habit during deep work or study",
      "rationale": "Neuroscience justification"
    },
    {
      "step": "Phase 3: Evening Melatonin Gateway",
      "action": "Specific habit 60 min before sleep",
      "rationale": "Neuroscience justification"
    }
  ],
  "recommendedMicroHabit": "A single 2-minute actionable daily micro-habit"
}
`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const rawText = response.text || '';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        return res.json({ aiReport: parsed, source: 'gemini-3.8-flash' });
      } catch (geminiError) {
        console.warn('Gemini API call encountered error, falling back to deterministic expert engine:', geminiError);
      }
    }

    // High quality clinical rule-based synthesis fallback
    const fallbackReport = {
      clinicalDiagnosis: `With an average of ${avgScreenTime}h daily screen time and ${avgSocial}h social consumption, your neural reward circuitry is currently in a state of moderate dopamine downregulation. The prefrontal cortex is experiencing frequent context switching, impacting sustained attentional stamina.`,
      dopamineWaveform: `High amplitude stimulation spikes from algorithmic feeds during afternoon hours, followed by steep evening energy crashes and sleep onset delays.`,
      burnoutPrognosis: avgDopamine < 60 ? 'Elevated burnout vulnerability. Cognitive stamina will drop by ~25% within 10 days unless stimulation velocity is modulated.' : 'Stable reserve with strong recovery potential. Circadian discipline will accelerate baseline reset within 5-7 days.',
      primaryTrigger: Number(avgSocial) > 1.5 ? 'Endless scroll short-form video consumption during downtime breaks' : 'Late night artificial blue light exposure after 9:30 PM',
      threeStepProtocol: [
        {
          step: 'Phase 1: Morning Anchor',
          action: 'Delay smartphone access for 30 minutes post-waking. View 10-15 minutes of natural sunlight directly without glass barriers.',
          rationale: 'Establishes proper cortisol awakening response (CAR) and initiates 14-hour melatonin synthesis timer.'
        },
        {
          step: 'Phase 2: Attentional Work Fence',
          action: 'Operate in 90-minute ultradian blocks with phones placed in physical airplane mode in another room.',
          rationale: 'Prevents attentional residue and eliminates continuous dopamine anticipation micro-spikes.'
        },
        {
          step: 'Phase 3: Evening Melatonin Gateway',
          action: 'Enable full grayscale mode and stop screen interaction 45 minutes prior to sleep onset.',
          rationale: 'Protects intrinsically photosensitive retinal ganglion cells from melanopsin stimulation.'
        }
      ],
      recommendedMicroHabit: 'Take 3 deep physiological sighs (two inhales through nose, one extended exhale through mouth) whenever you feel an impulsive urge to open a social app.'
    };

    return res.json({ aiReport: fallbackReport, source: 'expert_neuro_engine' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate AI habit analysis' });
  }
});

// Admin APIs
app.get('/api/admin/overview', (req, res) => {
  const activeCount = users.filter((u) => u.isActive).length;
  const avgScreenTime = (
    dailyEntries.reduce((sum, e) => sum + e.screenTimeHours, 0) / (dailyEntries.length || 1)
  ).toFixed(1);
  const avgDopamine = Math.round(
    dailyEntries.reduce((sum, e) => sum + e.scores.dopamineScore, 0) / (dailyEntries.length || 1)
  );
  const avgWellBeing = Math.round(
    dailyEntries.reduce((sum, e) => sum + e.scores.wellBeingScore, 0) / (dailyEntries.length || 1)
  );
  const highRiskCount = dailyEntries.filter(
    (e) => e.scores.riskLevel === 'High' || e.scores.riskLevel === 'Severe'
  ).length;

  res.json({
    totalUsers: users.length,
    activeUsers: activeCount,
    totalHabitEntries: dailyEntries.length,
    averagePlatformDopamineScore: avgDopamine,
    averagePlatformWellBeing: avgWellBeing,
    averageScreenTimeHours: Number(avgScreenTime),
    highRiskUsersCount: highRiskCount,
    systemHealth: 'OPTIMAL',
    aiEngineStatus: 'OPERATIONAL',
    activeAlertsCount: highRiskCount,
    recentActivityTimestamp: new Date().toISOString(),
  });
});

app.get('/api/admin/metrics', (req, res) => {
  const activeCount = users.filter((u) => u.isActive).length;
  const avgScreenTime = (
    dailyEntries.reduce((sum, e) => sum + e.screenTimeHours, 0) / (dailyEntries.length || 1)
  ).toFixed(1);
  const avgDopamine = Math.round(
    dailyEntries.reduce((sum, e) => sum + e.scores.dopamineScore, 0) / (dailyEntries.length || 1)
  );
  const avgWellBeing = Math.round(
    dailyEntries.reduce((sum, e) => sum + e.scores.wellBeingScore, 0) / (dailyEntries.length || 1)
  );
  const highRiskCount = dailyEntries.filter(
    (e) => e.scores.riskLevel === 'High' || e.scores.riskLevel === 'Severe'
  ).length;

  res.json({
    metrics: {
      totalUsers: users.length,
      activeUsers: activeCount,
      totalEntriesRecorded: dailyEntries.length,
      avgPlatformDopamine: avgDopamine,
      avgPlatformWellBeing: avgWellBeing,
      avgScreenTimeHours: Number(avgScreenTime),
      highRiskPercentage: Math.round((highRiskCount / (dailyEntries.length || 1)) * 100),
      apiRequestsToday: 1482,
    },
  });
});

app.get('/api/admin/users', (req, res) => {
  const enrichedUsers = users.map((u) => {
    const userEntries = dailyEntries.filter((e) => e.userId === u.id);
    return {
      ...u,
      status: u.isActive ? 'ACTIVE' : 'SUSPENDED',
      entriesCount: userEntries.length,
      createdAt: new Date(u.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  });
  res.json({ users: enrichedUsers });
});

app.patch('/api/admin/users/:id/status', (req, res) => {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access Denied: Only administrators have permission to suspend or activate accounts.',
    });
  }
  const { id } = req.params;
  const { status } = req.body;
  if (id === authUser.id && status === 'SUSPENDED') {
    return res.status(400).json({ error: 'Administrators cannot suspend their own active account.' });
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.isActive = status === 'ACTIVE';

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    action: status === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
    details: `Admin changed account operational status of ${user.email} to ${status}`,
    performedBy: authUser.name,
    userEmail: authUser.email,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
  });

  const enrichedUser = {
    ...user,
    status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
    entriesCount: dailyEntries.filter((e) => e.userId === user.id).length,
  };

  res.json({ success: true, user: enrichedUser });
});

app.patch('/api/admin/users/:id/role', (req, res) => {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access Denied: Only administrators have permission to alter user roles.',
    });
  }
  const { id } = req.params;
  const { role } = req.body;
  if (id === authUser.id && role === 'USER') {
    return res.status(400).json({ error: 'Administrators cannot demote their own account.' });
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.role = role === 'ADMIN' ? 'ADMIN' : 'USER';

  auditLogs.unshift({
    id: `aud_${Date.now()}`,
    action: user.role === 'ADMIN' ? 'USER_PROMOTED_ADMIN' : 'USER_DEMOTED_MEMBER',
    details: `Admin modified permission tier of ${user.email} to ${user.role}`,
    performedBy: authUser.name,
    userEmail: authUser.email,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
  });

  const enrichedUser = {
    ...user,
    status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
    entriesCount: dailyEntries.filter((e) => e.userId === user.id).length,
  };

  res.json({ success: true, user: enrichedUser });
});

app.patch('/api/admin/users/:id', (req, res) => {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access Denied: Only administrators have permission to edit user profiles.',
    });
  }
  const { id } = req.params;
  const user = users.find((u) => u.id === id);
  if (user) {
    Object.assign(user, req.body);
    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      action: 'ADMIN_USER_UPDATED',
      details: `Admin updated account properties for ${user.email}`,
      performedBy: authUser.name,
      userEmail: authUser.email,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
      status: 'SUCCESS',
    });
    const enrichedUser = {
      ...user,
      status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
      entriesCount: dailyEntries.filter((e) => e.userId === user.id).length,
    };
    return res.json({ user: enrichedUser });
  }
  res.status(404).json({ error: 'User not found' });
});

app.delete('/api/admin/users/:id', (req, res) => {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access Denied: Only administrators have permission to delete user accounts.',
    });
  }
  const { id } = req.params;
  if (id === authUser.id) {
    return res.status(400).json({ error: 'Administrators cannot delete their own active account.' });
  }
  const idx = users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    const deleted = users.splice(idx, 1)[0];
    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      action: 'ADMIN_USER_DELETED',
      details: `User ${deleted.email} deleted by administrator`,
      performedBy: authUser.name,
      userEmail: authUser.email,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
      status: 'WARNING',
    });
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'User not found' });
});

app.get('/api/admin/audit-logs', (req, res) => {
  res.json({ logs: auditLogs });
});

app.post('/api/admin/broadcast-notification', (req, res) => {
  const { title, message, type } = req.body;
  users.forEach((u) => {
    notifications.unshift({
      id: `notif_${Date.now()}_${u.id}`,
      userId: u.id,
      title,
      message,
      type: type || 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  });
  res.json({ success: true, count: users.length });
});

app.post('/api/admin/recommendations', (req, res) => {
  const newRec = {
    id: `rec_${Date.now()}`,
    ...req.body,
    source: 'knowledge_base' as const,
    createdAt: new Date().toISOString(),
  };
  recommendations.push(newRec);
  res.status(201).json({ recommendation: newRec });
});

app.post('/api/admin/tips', (req, res) => {
  const newTip = {
    id: `tip_${Date.now()}`,
    ...req.body,
    likes: 0,
  };
  educationalTips.unshift(newTip);
  res.status(201).json({ tip: newTip });
});

// Export CSV Endpoint
app.get('/api/reports/export-csv', (req, res) => {
  const headers = [
    'Date',
    'ScreenTimeHours',
    'SocialMediaHours',
    'GamingHours',
    'StudyHours',
    'WorkHours',
    'SleepHours',
    'ExerciseMinutes',
    'MeditationMinutes',
    'WaterIntakeLiters',
    'Mood',
    'WellBeingScore',
    'DopamineScore',
    'RiskLevel',
    'BurnoutLevel',
    'SleepQuality',
    'FocusScore',
    'Notes',
  ];

  const rows = dailyEntries.map((e) => [
    e.date,
    e.screenTimeHours,
    e.socialMediaHours,
    e.gamingHours,
    e.studyHours,
    e.workHours,
    e.sleepHours,
    e.exerciseMinutes,
    e.meditationMinutes,
    e.waterIntakeLiters,
    e.mood,
    e.scores.wellBeingScore,
    e.scores.dopamineScore,
    e.scores.riskLevel,
    e.scores.burnoutLevel,
    e.scores.sleepQuality,
    e.scores.focusScore,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="digital_wellbeing_data.csv"');
  res.send(csvContent);
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.VERCEL) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Well-Being SaaS Backend running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export { app };
export default app;
