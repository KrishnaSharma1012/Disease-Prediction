import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, RotateCcw,
  Heart, Stethoscope, Apple, Dumbbell, FileText, AlertCircle,
  CheckCircle2, TrendingUp, Printer, ChevronRight, Pill, Leaf,
  Activity, Sparkles
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { cn, getRiskColor, getRiskLabel, formatPercent } from '../lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── ANIMATED CONFIDENCE GAUGE ───────────────── */
function ConfidenceGauge({ score, risk }) {
  const pct = score * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score * circumference);

  const colors = {
    HIGH: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.3)', bg: 'from-red-500/10 to-red-500/5' },
    MEDIUM: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.3)', bg: 'from-amber-500/10 to-amber-500/5' },
    LOW: { stroke: '#10b981', glow: 'rgba(16,185,129,0.3)', bg: 'from-emerald-500/10 to-emerald-500/5' },
  };
  const c = colors[risk] || colors.LOW;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ boxShadow: [`0 0 20px ${c.glow}`, `0 0 40px ${c.glow}`, `0 0 20px ${c.glow}`] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 160, height: 160 }}
      />

      <svg width="160" height="160" viewBox="0 0 120 120" className="-rotate-90">
        {/* Track */}
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6"
          className="stroke-surface-100 dark:stroke-surface-700/50" />
        {/* Subtle inner track */}
        <circle cx="60" cy="60" r="46" fill="none" strokeWidth="1"
          className="stroke-surface-100/50 dark:stroke-surface-700/30" />
        {/* Progress arc */}
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={c.stroke} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
        {/* Animated dot at end of arc */}
        <motion.circle
          cx="60" cy="6" r="4" fill={c.stroke}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ transformOrigin: '60px 60px', rotate: `${score * 360}deg` }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-extrabold text-surface-900 dark:text-white tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {pct.toFixed(0)}%
        </motion.span>
        <span className="text-xs text-surface-400 font-medium mt-0.5">Confidence</span>
      </div>
    </div>
  );
}

/* ─── RISK BADGE ───────────────────────────────── */
function RiskBadge({ risk }) {
  const c = getRiskColor(risk);
  const Icon = risk === 'HIGH' ? ShieldAlert : risk === 'MEDIUM' ? AlertTriangle : ShieldCheck;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className={cn('inline-flex items-center gap-2 rounded-full border px-5 py-2.5', c.bg, c.text, c.border)}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-bold">{getRiskLabel(risk)}</span>
    </motion.div>
  );
}

/* ─── INFO SECTION WITH STAGGER ───────────────── */
function InfoSection({ icon: Icon, title, items, color = 'brand' }) {
  if (!items || items.length === 0) return null;
  const colors = {
    brand:   'from-brand-500 to-brand-700',
    teal:    'from-teal-500 to-teal-700',
    emerald: 'from-emerald-500 to-emerald-700',
    amber:   'from-amber-500 to-orange-600',
    violet:  'from-violet-500 to-violet-700',
    rose:    'from-pink-500 to-rose-600',
  };
  return (
    <Card hover={false}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-md', colors[color])}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-base font-bold text-surface-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-start gap-2.5 text-sm text-surface-600 dark:text-surface-300 leading-relaxed"
          >
            <ChevronRight className="h-4 w-4 text-brand-400 mt-0.5 shrink-0" />
            {item}
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Activity className="mx-auto h-12 w-12 text-surface-300 mb-4" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No Results Found</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Please run a prediction first.</p>
          <Link to="/predict"><Button>Go to Prediction</Button></Link>
        </motion.div>
      </div>
    );
  }

  const { prediction, confidence_score, risk_level, disease_info } = result;
  const isHealthy = prediction === 'Healthy';

  return (
    <div className="gradient-bg gradient-mesh min-h-screen py-12">
      <div className="section-padding">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">

          {/* ── Header Card (Holographic Glass) ───── */}
          <motion.div variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/60 p-8 shadow-glass backdrop-blur-2xl dark:border-surface-700/30 dark:bg-surface-800/50 mb-8"
          >
            {/* Animated gradient mesh background */}
            <div className="pointer-events-none absolute inset-0 -z-0">
              <motion.div
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className={cn('absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl',
                  isHealthy ? 'bg-emerald-400/15' : 'bg-red-400/10'
                )}
              />
              <motion.div
                animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl"
              />
            </div>

            <div className="relative flex flex-col sm:flex-row items-center gap-8">
              <ConfidenceGauge score={confidence_score} risk={risk_level} />

              <div className="flex-1 text-center sm:text-left">
                <RiskBadge risk={risk_level} />
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white"
                >
                  {isHealthy ? 'No Diabetes Detected' : 'Diabetes Risk Detected'}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2 text-surface-500 dark:text-surface-400 leading-relaxed max-w-lg"
                >
                  {disease_info?.description?.substring(0, 200)}...
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-surface-600 dark:bg-surface-700/50 dark:text-surface-300">
                    <TrendingUp className="h-3.5 w-3.5" /> Confidence: {formatPercent(confidence_score)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-surface-600 dark:bg-surface-700/50 dark:text-surface-300">
                    <Activity className="h-3.5 w-3.5" /> Threshold: {result.threshold_used}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Probability bar */}
            <div className="relative mt-8">
              <div className="flex justify-between text-xs text-surface-400 mb-2">
                <span>Healthy (0%)</span>
                <span>Diabetic (100%)</span>
              </div>
              <div className="h-3 rounded-full bg-surface-100/80 dark:bg-surface-700/50 overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence_score * 100}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  className={cn('h-full rounded-full', risk_level === 'HIGH' ? 'bg-gradient-to-r from-red-400 to-red-500' : risk_level === 'MEDIUM' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500')}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-surface-300">|  0.35 threshold</span>
                <span className="text-[10px] text-surface-300">0.65  |</span>
              </div>
            </div>
          </motion.div>

          {/* ── Disease Description ──────────────── */}
          {disease_info && (
            <motion.div variants={fadeUp}>
              <Card hover={false} className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30">
                    <Sparkles className="h-4 w-4 text-brand-500" />
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white">{disease_info.name}</h3>
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{disease_info.description}</p>
              </Card>
            </motion.div>
          )}

          {/* ── Info Sections Grid ──────────────── */}
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-6 mb-8">
            <InfoSection icon={Stethoscope} title="Symptoms" items={disease_info?.symptoms} color="rose" />
            <InfoSection icon={AlertCircle} title="Possible Causes" items={disease_info?.causes} color="amber" />
            <InfoSection icon={ShieldCheck} title="Preventive Measures" items={disease_info?.prevention} color="emerald" />
            <InfoSection icon={Dumbbell} title="Lifestyle Recommendations" items={disease_info?.lifestyle} color="violet" />
          </motion.div>

          {/* ── Diet ────────────────────────────── */}
          <motion.div variants={fadeUp} className="mb-8">
            <InfoSection icon={Apple} title="Diet Recommendations" items={disease_info?.diet} color="teal" />
          </motion.div>

          {/* ── Disclaimer ──────────────────────── */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/80 px-6 py-5 backdrop-blur-sm dark:border-amber-800/30 dark:bg-amber-900/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Important Medical Disclaimer</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    This prediction is based on a statistical model trained on the Pima Indians Diabetes Dataset and is intended for educational and screening purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Action Buttons ──────────────────── */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Button variant="teal" size="lg" className="flex-1 gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Download PDF Report
            </Button>
            <a href="https://www.google.com/search?q=doctor+near+me" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Stethoscope className="h-4 w-4" /> Consult a Doctor
              </Button>
            </a>
            <Link to="/predict" className="flex-1">
              <Button variant="secondary" size="lg" className="w-full gap-2">
                <RotateCcw className="h-4 w-4" /> Try Again
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
