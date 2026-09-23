# DopamineFlow — Digital Well-Being & Dopamine Habit Analyzer

> **Evidence-based digital well-being, neuro-dopamine health intelligence, and authentic longitudinal habit analytics SaaS platform.**

---

## 🌟 Overview

**DopamineFlow** is an enterprise-grade digital wellness and dopamine detoxification SaaS application designed to help individuals counteract chronic hyper-stimulation, reclaim cognitive attentional control, optimize circadian sleep architecture, and cultivate lasting behavioral discipline.

Unlike conventional productivity tools that rely on artificial metrics or arbitrary streak counts, DopamineFlow operates on a **True Streak & Longitudinal Habit Engine**. Streaks, level progression, correlation graphs, and clinical reports reflect actual, unbroken consecutive check-ins from the day an account is activated.

---

## 🧠 Core Architecture & True Streak System

### 1. Genuine Consecutive Streak Computation
* **True Active Days**: When a new user registers an account, they start with a genuine **1-Day Active Streak** and an initial Day 1 baseline entry.
* **Algorithm**: The streak calculation algorithm (`calculateUserStreak` in `server.ts` and `calculateStreakFromEntries` in `src/services/api.ts`) sorts unique calendar dates in descending order and iteratively validates unbroken consecutive days from today/yesterday.
* **Zero Artificial Padding**: There are no hardcoded arbitrary fallback streaks across the codebase. Every badge, metric card, and report reads directly from live telemetry.

### 2. Full Ecosystem Integration
The authentic streak dynamically cascades across all subsystems:
* **Dashboard & Health Hero**:
  - Displays the live streak with precise singular/plural formatting (`1 Day Active Streak` vs `N Days Active Streak`).
  - Adapts contextual milestones (e.g., Day 1 baseline encouragement, 3-day kickstart, 7-day week warrior, 21-day neuroplasticity threshold, 30-day circadian mastery).
* **Biometric Correlation Snapshot**:
  - Highlights the **Day 1 Baseline Record** when first logging in.
  - Automatically transitions to multi-day dopamine vs. screen exposure trends as check-ins accumulate.
* **Gamified Achievements & XP Engine**:
  - **Genesis Ignition (Day 1 Active)**: Unlocks immediately upon completing the first active baseline log (+150 XP).
  - **3-Day Discipline Kickstart**: Unlocks after 3 consecutive days (+200 XP).
  - **Pioneer Streak (7-Day Consistency)**: Unlocks at 7 days (+250 XP).
  - **Habit Transformation Titan (14-Day Streak)**: Unlocks at 14 days (+350 XP).
  - **Neuro-Plasticity Reset (21-Day Habit Formator)**: Unlocks at 21 days (+500 XP).
  - **Circadian & Dopamine Mastery (30-Day Pillar)**: Unlocks at 30 days (+750 XP).
  - **Century Streak Legend (100-Day Master)**: Unlocks at 100 days (+1,500 XP).
  - Dynamic level progression engine recalculates total XP: `baseAchievementXp + (currentStreak * 50)`.
* **Longitudinal Analytics**:
  - Interactive Recharts visualizers for Dopamine Index, Digital Exposure Velocity, Attentional Flow, and Circadian Sleep.
  - When analyzing Day 1 data, displays single-day baseline calibration without misleading delta percentages.
  - Multi-day timeframe selectors (`7-Day`, `14-Day`, `30-Day`, and `All History`).
* **Habit History Archive**:
  - Chronological records of all verified logs with Dopamine Index, well-being percentage, digital exposure, and risk level.
  - Search by date (`YYYY-MM-DD`) or notes, filter by clinical risk tier, and inspect complete biometric payloads.
  - Full CSV dataset export via `/api/reports/export-csv`.
* **Clinical Executive Well-Being Reports**:
  - Formal biometric assessment suitable for personal review or medical/therapeutic consultation.
  - Dynamically computes sample period and verified continuous active days.
  - One-click print-ready clinical formatting (`window.print()`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS v4, Lucide React icons, Canvas Confetti |
| **Data Visualization** | Recharts (Responsive Area, Line, and Bar charts) |
| **Backend & Routing** | Node.js, Express, TypeScript (`tsx`) |
| **Artificial Intelligence** | Google Gemini API (`@google/genai`) for personalized neuro-habit recommendations |
| **Persistence** | Server-side in-memory state with synchronous local storage mirroring and fallback |

---

## 🚀 Getting Started & Installation

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm or pnpm

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /path/to/project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The full-stack application will be available at `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

---

## 🔑 Demo & Testing Accounts

The application includes pre-configured profiles for evaluation:

1. **Alex Rivera (Longitudinal 30-Day Veteran User)**
   - **Email**: `alex@cit.edu.in`
   - **Password**: `password123`
   - **Profile**: 30 verified consecutive days of habit telemetry, multi-week correlation trends, and unlocked advanced milestones.
   - **Quick Access**: Available via the 1-click demo button in the sign-in modal.

2. **New User Registration (Day 1 True Streak Verification)**
   - Click **"Register"** or **"Start Free Protocol"**.
   - Create an account with any valid name, email, and password.
   - The account will initialize with a genuine **1-Day Active Streak**, Day 1 baseline entry, unlocked **Genesis Ignition** achievement, and cleanly calibrated 1-day telemetry.

3. **Admin User Profile**
   - **Email**: `admin@cit.edu.in`
   - **Password**: `admin123`
   - **Access**: Full platform administrative controls, user role management, system metrics, and audit logs.

---

## 📊 Key Biometric Scores & Mathematical Formulas

DopamineFlow evaluates habit inputs through an algorithmic scoring model (`src/lib/dopamine-calculator.ts`):

* **Dopamine Health Index (0 - 100)**:
  - Penalizes excess recreational screen time and hyper-stimulating social feeds.
  - Rewards restorative 7-9h sleep, physical exercise, mindfulness/NSDR, and deep work intervals.
* **Digital Stimulation Index**:
  - Quantifies high-velocity dopaminergic triggers (short-form videos, gaming, algorithmic scrolling).
* **Burnout & Risk Assessment**:
  - Classifies cognitive fatigue into `Low`, `Moderate`, `High`, or `Severe` risk states with actionable intervention recommendations.

---

## 📄 License

Private & Confidential — Built for DopamineFlow Platform.
