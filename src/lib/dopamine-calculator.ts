import { HabitScores, RiskLevel, BurnoutLevel, SleepQuality } from '../types';

export interface HabitInput {
  screenTimeHours: number;
  socialMediaHours: number;
  gamingHours: number;
  studyHours: number;
  workHours: number;
  sleepHours: number;
  exerciseMinutes: number;
  meditationMinutes: number;
  waterIntakeLiters: number;
  mood: number;
}

export function calculateHabitScores(input: HabitInput): HabitScores {
  const {
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
  } = input;

  // 1. Stimulation & Dopamine Hijack Index (0-100)
  // High dopamine spikes from hyper-palatable digital stimuli:
  const instantGratificationHours = socialMediaHours * 1.5 + gamingHours * 1.2;
  const passiveScreenHours = Math.max(0, screenTimeHours - (workHours + studyHours));
  
  const rawStimulation = (instantGratificationHours * 15) + (passiveScreenHours * 8);
  const stimulationIndex = Math.min(100, Math.max(5, Math.round(rawStimulation)));

  // 2. Dopamine Baseline Score (Higher is more stable & healthy, lower is overstimulated/depleted)
  // Baseline resilience is restored by deliberate physical effort, sunlight, sleep, meditation
  const dopamineDrains = (socialMediaHours * 11) + (gamingHours * 9) + (Math.max(0, screenTimeHours - 5) * 4);
  const dopamineRestorers = 
    Math.min(25, (exerciseMinutes / 30) * 15) +
    Math.min(20, (meditationMinutes / 10) * 14) +
    (sleepHours >= 7 && sleepHours <= 9 ? 20 : sleepHours >= 6 ? 10 : 0) +
    Math.min(10, waterIntakeLiters * 4) +
    (mood >= 4 ? 10 : mood === 3 ? 5 : 0);

  const rawDopamine = 65 - dopamineDrains + dopamineRestorers;
  const dopamineScore = Math.min(98, Math.max(12, Math.round(rawDopamine)));

  // Dopamine Trend
  let dopamineTrend: 'rising' | 'balanced' | 'depleted' = 'balanced';
  if (dopamineScore > 75) dopamineTrend = 'rising';
  else if (dopamineScore < 50) dopamineTrend = 'depleted';

  // 3. Sleep Quality
  let sleepQuality: SleepQuality = 'Fair';
  if (sleepHours >= 7.5 && sleepHours <= 9 && screenTimeHours <= 6) {
    sleepQuality = 'Optimal';
  } else if (sleepHours >= 7) {
    sleepQuality = 'Good';
  } else if (sleepHours >= 5.5) {
    sleepQuality = 'Fair';
  } else {
    sleepQuality = 'Poor';
  }

  // 4. Focus & Attentional Efficiency Score (0 - 100)
  const productiveHours = studyHours + workHours;
  const distractionRatio = instantGratificationHours / (productiveHours + 1);
  let focusRaw = 60 + (productiveHours * 5) - (distractionRatio * 25) + (meditationMinutes >= 10 ? 12 : 0);
  if (sleepQuality === 'Poor') focusRaw -= 15;
  if (exerciseMinutes >= 20) focusRaw += 8;
  const focusScore = Math.min(99, Math.max(15, Math.round(focusRaw)));

  // 5. Digital Well-Being Score (0 - 100 composite)
  const screenBalanceFactor = Math.max(10, 100 - (screenTimeHours * 8.5));
  const physicalVitalityFactor = Math.min(100, (exerciseMinutes / 40 * 45) + (waterIntakeLiters / 2.5 * 30) + (meditationMinutes / 15 * 25));
  const sleepFactor = sleepQuality === 'Optimal' ? 95 : sleepQuality === 'Good' ? 80 : sleepQuality === 'Fair' ? 60 : 35;
  const moodFactor = mood * 20;

  const rawWellBeing = (screenBalanceFactor * 0.3) + (dopamineScore * 0.25) + (physicalVitalityFactor * 0.15) + (sleepFactor * 0.15) + (moodFactor * 0.15);
  const wellBeingScore = Math.min(99, Math.max(15, Math.round(rawWellBeing)));

  // 6. Burnout Level
  const burnoutStrain = (workHours * 1.2 + studyHours) + (screenTimeHours * 0.7) - (sleepHours * 1.5) - (exerciseMinutes / 20) - (meditationMinutes / 10);
  let burnoutLevel: BurnoutLevel = 'Optimal';
  if (burnoutStrain > 10 || (sleepHours < 5.5 && screenTimeHours > 8)) {
    burnoutLevel = 'Critical Burnout';
  } else if (burnoutStrain > 6 || screenTimeHours > 9) {
    burnoutLevel = 'Elevated Risk';
  } else if (burnoutStrain > 2.5) {
    burnoutLevel = 'Mild Fatigue';
  } else {
    burnoutLevel = 'Optimal';
  }

  // 7. Overall Risk Level
  let riskLevel: RiskLevel = 'Low';
  if (dopamineScore < 40 || wellBeingScore < 40 || burnoutLevel === 'Critical Burnout') {
    riskLevel = 'Severe';
  } else if (dopamineScore < 55 || wellBeingScore < 58 || burnoutLevel === 'Elevated Risk') {
    riskLevel = 'High';
  } else if (dopamineScore < 70 || screenTimeHours > 7) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'Low';
  }

  return {
    wellBeingScore,
    dopamineScore,
    riskLevel,
    burnoutLevel,
    sleepQuality,
    focusScore,
    dopamineTrend,
    stimulationIndex,
  };
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'Low': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    case 'Moderate': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    case 'High': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800';
    case 'Severe': return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  }
}

export function getBurnoutBadge(level: BurnoutLevel): { label: string; color: string } {
  switch (level) {
    case 'Optimal': return { label: 'Optimal Reserve', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
    case 'Mild Fatigue': return { label: 'Mild Fatigue', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
    case 'Elevated Risk': return { label: 'Elevated Strain', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
    case 'Critical Burnout': return { label: 'Critical Burnout', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
  }
}
