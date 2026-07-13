import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, RotateCcw,
  Heart, Stethoscope, Apple, Dumbbell, FileText, AlertCircle,
  CheckCircle2, TrendingUp, Printer, ChevronRight, Pill, Leaf,
  Activity
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { cn, getRiskColor, getRiskLabel, formatPercent } from '../lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── CONFIDENCE RING ──────────────────────────── */
function ConfidenceRing({ score, risk }) {
  const pct = score * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score * circumference);
  const strokeColor = risk === 'HIGH' ? '#ef4444' : risk === 'MEDIUM' ? '#f59e0b' : '#10b981';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8"
          className="text-surface-100 dark:text-surface-700" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={strokeColor} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-surface-900 dark:text-white">{pct.toFixed(0)}%</span>
        <span className="text-xs text-surface-400 font-medium">Confidence</span>
      </div>
    </div>
  );
}

/* ─── RISK BADGE ───────────────────────────────── */
function RiskBadge({ risk }) {
  const c = getRiskColor(risk);
  const Icon = risk === 'HIGH' ? ShieldAlert : risk === 'MEDIUM' ? AlertTriangle : ShieldCheck;
  return (
    <div className={cn('inline-flex items-center gap-2 rounded-full border px-5 py-2.5', c.bg, c.text, c.border)}>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-bold">{getRiskLabel(risk)}</span>
    </div>
  );
}

/* ─── INFO SECTION ─────────────────────────────── */
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
          <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
            <ChevronRight className="h-4 w-4 text-brand-400 mt-0.5 shrink-0" />
            {item}
          </li>
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
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-surface-300 mb-4" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No Results Found</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Please run a prediction first.</p>
          <Link to="/predict"><Button>Go to Prediction</Button></Link>
        </div>
      </div>
    );
  }

  const { prediction, confidence_score, risk_level, disease_info } = result;
  const isHealthy = prediction === 'Healthy';

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="section-padding">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">

          {/* ── Header Card ──────────────────────── */}
          <motion.div variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white p-8 shadow-card dark:border-surface-700/60 dark:bg-surface-800/80 mb-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-brand-100/30 to-teal-100/30 blur-3xl -z-0 dark:from-brand-900/10 dark:to-teal-900/10" />

            <div className="relative flex flex-col sm:flex-row items-center gap-8">
              <ConfidenceRing score={confidence_score} risk={risk_level} />

              <div className="flex-1 text-center sm:text-left">
                <RiskBadge risk={risk_level} />
                <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white">
                  {isHealthy ? 'No Diabetes Detected' : 'Diabetes Risk Detected'}
                </h1>
                <p className="mt-2 text-surface-500 dark:text-surface-400 leading-relaxed max-w-lg">
                  {disease_info?.description?.substring(0, 200)}...
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                    <TrendingUp className="h-3.5 w-3.5" /> Confidence: {formatPercent(confidence_score)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                    <Activity className="h-3.5 w-3.5" /> Threshold: {result.threshold_used}
                  </span>
                </div>
              </div>
            </div>

            {/* Probability bar */}
            <div className="relative mt-8">
              <div className="flex justify-between text-xs text-surface-400 mb-2">
                <span>Healthy (0%)</span>
                <span>Diabetic (100%)</span>
              </div>
              <div className="h-3 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence_score * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                  className={cn('h-full rounded-full', risk_level === 'HIGH' ? 'bg-red-500' : risk_level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500')}
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
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-3">{disease_info.name}</h3>
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
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 dark:border-amber-800/40 dark:bg-amber-900/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Important Medical Disclaimer</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    This prediction is generated by an AI model trained on the Pima Indians Diabetes Dataset and is intended for educational and screening purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
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
