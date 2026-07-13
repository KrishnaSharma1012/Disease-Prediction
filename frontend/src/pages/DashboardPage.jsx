import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Clock, TrendingUp, Activity, ShieldCheck,
  ShieldAlert, AlertTriangle, Calendar, ArrowRight, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import { getHistory } from '../api/predictionService';
import { cn, getRiskColor, getRiskLabel, formatDate, formatPercent } from '../lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

/* ─── STAT CARD ────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
    >
      <Card hover={false} className="relative overflow-hidden group">
        {/* Gradient corner accent */}
        <div className={cn('absolute top-0 right-0 h-24 w-24 rounded-bl-[2rem] bg-gradient-to-br opacity-[0.07] transition-opacity group-hover:opacity-[0.12]', color)} />

        <div className={cn('inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-md mb-3', color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <motion.p
          className="text-2xl font-extrabold text-surface-900 dark:text-white tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring' }}
        >
          {value}
        </motion.p>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</p>
      </Card>
    </motion.div>
  );
}

/* ─── CUSTOM TOOLTIP ────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-surface-200/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-xl dark:border-surface-700/40 dark:bg-surface-800/90">
      <p className="text-xs text-surface-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-surface-900 dark:text-white">{payload[0].value}%</p>
    </div>
  );
}

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then(data => { setHistory(data); setLoading(false); });
  }, []);

  // Stats
  const total = history.length;
  const highRisk = history.filter(h => h.risk_level === 'HIGH').length;
  const lowRisk  = history.filter(h => h.risk_level === 'LOW').length;
  const medRisk  = history.filter(h => h.risk_level === 'MEDIUM').length;
  const avgConf  = total > 0 ? history.reduce((a, h) => a + h.confidence_score, 0) / total : 0;

  const riskDistribution = [
    { name: 'Low',    value: lowRisk },
    { name: 'Medium', value: medRisk },
    { name: 'High',   value: highRisk },
  ];

  const timelineData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: +(h.confidence_score * 100).toFixed(0),
  })).reverse();

  if (loading) {
    return (
      <div className="gradient-bg gradient-mesh min-h-screen py-12">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-surface-100/60 dark:bg-surface-800/40 backdrop-blur-sm animate-pulse" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-2xl bg-surface-100/60 dark:bg-surface-800/40 backdrop-blur-sm animate-pulse" />
            <div className="h-72 rounded-2xl bg-surface-100/60 dark:bg-surface-800/40 backdrop-blur-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg gradient-mesh min-h-screen py-12">
      <div className="section-padding max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 shadow-glow">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white">Dashboard</h1>
                <p className="text-surface-500 dark:text-surface-400 text-sm">Your prediction history and analytics at a glance</p>
              </div>
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={BarChart3}   label="Total Predictions" value={total}               color="from-brand-500 to-brand-700" delay={0} />
            <StatCard icon={TrendingUp}  label="Avg Confidence"    value={formatPercent(avgConf)} color="from-violet-500 to-violet-700" delay={0.05} />
            <StatCard icon={ShieldAlert} label="High Risk Cases"   value={highRisk}            color="from-red-500 to-red-700" delay={0.1} />
            <StatCard icon={ShieldCheck} label="Low Risk Cases"    value={lowRisk}             color="from-emerald-500 to-emerald-700" delay={0.15} />
          </div>

          {/* Charts row */}
          <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Risk Distribution Pie */}
            <Card hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <h3 className="text-base font-bold text-surface-900 dark:text-white">Risk Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {riskDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {riskDistribution.map((r, i) => (
                  <span key={r.name} className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {r.name} ({r.value})
                  </span>
                ))}
              </div>
            </Card>

            {/* Confidence Timeline */}
            <Card hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-brand-500" />
                <h3 className="text-base font-bold text-surface-900 dark:text-white">Confidence Timeline</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b8bff" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3b8bff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="#3b8bff" strokeWidth={2.5} fill="url(#confGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Recent Predictions Table */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-surface-900 dark:text-white">Recent Predictions</h3>
                <Link to="/predict">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    New Prediction <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 dark:border-surface-700/50">
                      <th className="pb-3 text-left font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Date</th>
                      <th className="pb-3 text-left font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Prediction</th>
                      <th className="pb-3 text-left font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Risk</th>
                      <th className="pb-3 text-right font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, idx) => {
                      const rc = getRiskColor(h.risk_level);
                      return (
                        <motion.tr
                          key={h.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-surface-50 dark:border-surface-800/50 last:border-0 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors"
                        >
                          <td className="py-3.5 flex items-center gap-2 text-surface-600 dark:text-surface-300">
                            <Calendar className="h-3.5 w-3.5 text-surface-400" />
                            {formatDate(h.date)}
                          </td>
                          <td className="py-3.5 font-medium text-surface-900 dark:text-white">{h.prediction}</td>
                          <td className="py-3.5">
                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', rc.bg, rc.text)}>
                              {getRiskLabel(h.risk_level)}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-semibold text-surface-700 dark:text-surface-300 tabular-nums">
                            {formatPercent(h.confidence_score)}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {history.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="mx-auto h-10 w-10 text-surface-300 dark:text-surface-600 mb-3" />
                  <p className="text-sm text-surface-400">No predictions yet. Run your first prediction!</p>
                  <Link to="/predict"><Button size="sm" className="mt-4">Start Prediction</Button></Link>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
