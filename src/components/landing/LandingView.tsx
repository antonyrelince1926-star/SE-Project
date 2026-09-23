import React from 'react';
import {
  Brain,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  BarChart3,
  Moon,
  Users,
  Flame,
} from 'lucide-react';

interface LandingViewProps {
  onEnterApp: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">DopamineFlow</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onEnterApp}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In / Workspace
          </button>
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Neuroscience-Backed Digital Well-Being Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Reclaim Your Attention in an Era of{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Weaponized Algorithms
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Monitor screen velocity, calculate clinical dopamine health indices, predict burnout, and receive Gemini 3.8 Flash AI neuro-interventions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Brain className="w-4 h-4" />
            <span>Open Interactive Dashboard</span>
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <span>Explore Scientific Architecture</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> D2 Receptor Sensitivity Modeling
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gemini 3.8 Flash AI Engine
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Circadian Rhythm Tracking
          </span>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Engineering Biological Homeostasis
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Most blockers rely on brute willpower. DopamineFlow works at the biochemical level by addressing receptor downregulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Dopamine Index Computation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mathematical scoring calculating baseline stability, stimulation velocity, and post-stimulus troughs based on multi-variate daily inputs.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Gemini 3.8 Flash Diagnostics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep AI behavioral analysis synthesizing sleep duration, task friction, and digital triggers into high-impact clinical 3-phase protocols.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Habit Streaks & Neuro-Protocols
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain unbroken consistency streaks, unlock neurological milestone badges, and receive automated circadian and digital stimulus recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Commercial SaaS Licensing</h2>
          <p className="text-xs text-slate-400 mt-2">Deploy for individual excellence or company-wide mental fitness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pro Neuro</span>
              <div className="text-3xl font-extrabold text-white mt-2">$19 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
              <p className="text-xs text-slate-400 mt-2">For high-performing founders, developers, and researchers.</p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Full Dopamine Index Telemetry</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Unlimited Gemini AI Neuro-Diagnoses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Weekly Biometric PDF Audits</li>
              </ul>
            </div>

            <button
              onClick={onEnterApp}
              className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
            >
              Start 14-Day Trial
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/40 relative flex flex-col justify-between">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">
              Enterprise Clinical
            </span>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Organization</span>
              <div className="text-3xl font-extrabold text-white mt-2">$89 <span className="text-xs text-slate-400 font-normal">/ seat / mo</span></div>
              <p className="text-xs text-slate-400 mt-2">For university labs, hospitals, and high-intensity tech orgs.</p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Central Admin Management Portal</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Population-level Burnout Flags</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Immutable Audit Trail</li>
              </ul>
            </div>

            <button
              onClick={onEnterApp}
              className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
            >
              Access Admin Console
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>© 2026 DopamineFlow Inc. Clinical Digital Well-Being & Cognitive Health System. All rights reserved.</p>
      </footer>
    </div>
  );
};
