import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Wind, Brain, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

export const NeuroscienceTipsView: React.FC = () => {
  const [selectedTip, setSelectedTip] = useState<any | null>(null);
  const [isBreathToolOpen, setIsBreathToolOpen] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Inhale Top' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(0);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Physiological sigh breathing engine (2 quick inhales, 1 long slow exhale)
  useEffect(() => {
    let interval: any;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          const next = (prev + 1) % 9;
          if (next < 3) setBreathPhase('Inhale');
          else if (next < 4) setBreathPhase('Inhale Top');
          else setBreathPhase('Exhale');
          return next;
        });
      }, 1000);
    } else {
      setBreathTimer(0);
      setBreathPhase('Inhale');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const articles = [
    {
      id: 'dopamine-waveform',
      title: 'The Dopamine Waveform & Baseline Reset',
      author: 'Stanford School of Medicine & Dr. Anna Lembke',
      tag: 'Neurobiology',
      readTime: '4 min read',
      excerpt:
        'Every artificial high-dopamine spike (e.g., TikTok, Instagram, gambling) is followed by a proportional trough below baseline. Learn how to maintain homeostatic equilibrium.',
      content: `Dopamine is not the molecule of pleasure; it is the molecule of anticipation, craving, and drive. When you receive an unexpected reward—like a viral video or notification—dopamine surges high above your baseline.
      
However, the brain maintains homeostasis through the opponent-process mechanism. To protect neurons from neurotoxicity, the post-synaptic receptors (D2 and D3) downregulate, causing your dopamine level to plummet into a trough BELOW your original baseline.

During this trough, you experience irritability, restlessness, brain fog, and an intense craving to engage with the stimulus again. The only way to restore your baseline is through cognitive rest, sunlight, and enduring the craving without capitulating.`,
    },
    {
      id: 'nsdr-protocol',
      title: 'Non-Sleep Deep Rest (NSDR) for Neural Recovery',
      author: 'Huberman Laboratory',
      tag: 'Attentional Recovery',
      readTime: '3 min read',
      excerpt:
        'A 10-20 minute session of NSDR can restore striatal dopamine reserves and accelerate motor and cognitive learning by up to 300%.',
      content: `Non-Sleep Deep Rest (NSDR), based on the ancient practice of Yoga Nidra, shifts your brainwave state from high-frequency beta waves into alpha and theta rhythms.
      
Clinical imaging demonstrates that during NSDR, mental fatigue dissipates as acetylcholine and dopamine pools in the basal ganglia replenish. It serves as an on-demand reset button when you feel screen-exhausted but cannot take a full nap.`,
    },
    {
      id: 'circadian-lux',
      title: 'Morning Photons & Adenosine Clearance',
      author: 'Circadian Biology Research',
      tag: 'Sleep & Energy',
      readTime: '5 min read',
      excerpt:
        'Viewing 10,000+ lux of sunlight within 30 minutes of waking triggers a timed cortisol pulse and sets an automatic 16-hour melatonin countdown.',
      content: `Your eyes contain specialized intrinsically photosensitive retinal ganglion cells (ipRGCs) that measure light brightness and communicate directly with the Suprachiasmatic Nucleus (SCN)—the master circadian clock.
      
Viewing natural morning sunlight for 10-15 minutes suppresses remaining sleepiness by accelerating adenosine clearance and establishes the exact biological timer for melatonin release 16 hours later.`,
    },
    {
      id: 'friction-principle',
      title: 'The Digital Friction Principle: Breaking Algorithmic Loops',
      author: 'Cal Newport & Cognitive Engineering Lab',
      tag: 'Digital Habits',
      readTime: '4 min read',
      excerpt:
        'Why adding 20 seconds of physical friction is 10x more effective than willpower alone when combating compulsive phone pickups.',
      content: `Willpower is an exhaustible metabolic resource mediated by the prefrontal cortex. When you are tired or stressed, your prefrontal cortex suffers from cognitive depletion, leaving you vulnerable to the dopamine-driven striatum.
      
By introducing deliberate physical friction—such as moving social media apps into deep folders, utilizing grayscale color filters, or storing your phone outside the bedroom—you force the brain out of automatic habit loops and into conscious prefrontal evaluation.`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Breath Tool CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Neuroscience & Dopamine Knowledge Base
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Evidence-based protocols from leading clinical laboratories to optimize focus and digital health.
          </p>
        </div>

        <button
          onClick={() => {
            setIsBreathToolOpen(true);
            setIsBreathingActive(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm active:scale-98 transition-all"
        >
          <Wind className="w-4 h-4" />
          <span>Interactive Breath Reset (60s)</span>
        </button>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {art.tag}
                </span>
                <span className="text-[11px] text-slate-400">{art.readTime}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                {art.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">By {art.author}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedTip(art)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Read Full Neuroscience Brief</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedTip && (
        <Modal
          isOpen={!!selectedTip}
          onClose={() => setSelectedTip(null)}
          title={selectedTip.title}
          description={`Source: ${selectedTip.author} • ${selectedTip.readTime}`}
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {selectedTip.content}
          </div>
        </Modal>
      )}

      {/* Interactive Breath Work Tool Modal */}
      <Modal
        isOpen={isBreathToolOpen}
        onClose={() => {
          setIsBreathingActive(false);
          setIsBreathToolOpen(false);
        }}
        title="Physiological Sigh Quick Reset"
        description="The fastest clinically proven breathing pattern to downregulate autonomic arousal and restore cognitive composure."
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-6 text-center">
          {/* Animated breathing circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div
              className={`w-36 h-36 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'scale-125'
                  : breathPhase === 'Inhale Top'
                  ? 'scale-130 ring-4 ring-teal-400/40'
                  : 'scale-90 opacity-60'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                  {breathPhase}
                </span>
                <span className="text-[10px] text-slate-400">
                  {breathPhase === 'Inhale'
                    ? 'Deep nasal breath'
                    : breathPhase === 'Inhale Top'
                    ? 'Quick top-off puff'
                    : 'Slow sigh through mouth'}
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
            Repeat this 2-to-3 times anytime you feel acute urge or screen-induced tension.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700"
            >
              {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isBreathingActive ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => {
                setBreathTimer(0);
                setBreathPhase('Inhale');
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
