import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, Activity, ShieldCheck, Dna } from 'lucide-react';

const STAGES = [
  { icon: Dna,         label: 'Preparing patient data...', duration: 800 },
  { icon: Brain,       label: 'Running AI analysis...',    duration: 1200 },
  { icon: Activity,    label: 'Calculating risk factors...', duration: 1000 },
  { icon: ShieldCheck, label: 'Generating assessment...',  duration: 800 },
];

export default function PredictionLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length) return;
    const timeout = setTimeout(() => {
      setStage(s => s + 1);
    }, STAGES[stage]?.duration || 1000);
    return () => clearTimeout(timeout);
  }, [stage]);

  const currentStage = STAGES[Math.min(stage, STAGES.length - 1)];
  const progress = ((stage) / STAGES.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center gap-8 p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl max-w-sm w-full mx-4"
      >
        {/* DNA-style pulse rings */}
        <div className="relative w-28 h-28">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border-2 border-brand-400/30"
          />
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 rounded-full border-2 border-teal-400/20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-2 border-transparent border-t-brand-400 border-r-teal-400"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={stage}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <currentStage.icon className="h-8 w-8 text-brand-400" />
            </motion.div>
          </div>
        </div>

        {/* ECG heartbeat line */}
        <svg viewBox="0 0 200 40" className="w-48 h-8" aria-hidden="true">
          <motion.path
            d="M0,20 L40,20 L50,5 L60,35 L70,10 L80,30 L90,20 L200,20"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b8bff" />
              <stop offset="100%" stopColor="#06c4af" />
            </linearGradient>
          </defs>
        </svg>

        {/* Status text */}
        <div className="text-center">
          <motion.p
            key={currentStage.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-white/90"
          >
            {currentStage.label}
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 95)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Stage dots */}
        <div className="flex gap-3">
          {STAGES.map((s, i) => (
            <motion.div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < stage ? 'bg-teal-400' : i === stage ? 'bg-brand-400' : 'bg-white/20'
              }`}
              animate={i === stage ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
