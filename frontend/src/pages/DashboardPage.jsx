import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Clock, TrendingUp, Activity, ShieldCheck,
  ShieldAlert, AlertTriangle, Calendar, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
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

  const statCards = [
    { icon: BarChart3,  label: 'Total Predictions', value: total,               color: 'from-brand-500 to-brand-700' },
    { icon: TrendingUp, label: 'Avg Confidence',     value: formatPercent(avgConf), color: 'from-violet-500 to-violet-700' },
    { icon: ShieldAlert,label: 'High Risk Cases',    value: highRisk,            color: 'from-red-500 to-red-700' },
    { icon: ShieldCheck,label: 'Low Risk Cases',     value: lowRisk,             color: 'from-emerald-500 to-emerald-700' },
  ];

  if (loading) {
    return (
      <div className="gradient-bg min-h-screen py-12">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-surface-100 dark:bg-surface-800 animate-pulse" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-2xl bg-surface-100 dark:bg-surface-800 animate-pulse" />
            <div className="h-72 rounded-2xl bg-surface-100 dark:bg-surface-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="section-padding max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-surface-500 dark:text-surface-400">Your prediction history and analytics at a glance</p>
          </motion.div>

          {/* Stat cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(s => (
              <Card key={s.label} hover={false} className="relative overflow-hidden">
                <div className={cn('absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-br opacity-10', s.color)} />
                <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-md mb-3', s.color)}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-extrabold text-surface-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{s.label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Charts row */}
          <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Risk Distribution Pie */}
            <Card hover={false}>
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {riskDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
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
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Confidence Timeline</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b8bff" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b8bff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="score" stroke="#3b8bff" strokeWidth={2} fill="url(#confGrad)" />
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
                    <tr className="border-b border-surface-100 dark:border-surface-700">
                      <th className="pb-3 text-left font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Date</th>
                      <th className="pb-3 text-left font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Prediction</th>
                      <th className="pb-3 text-left font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Risk</th>
                      <th className="pb-3 text-right font-semibold text-surface-500 dark:text-surface-400 text-xs uppercase tracking-wider">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => {
                      const rc = getRiskColor(h.risk_level);
                      return (
                        <tr key={h.id} className="border-b border-surface-50 dark:border-surface-800 last:border-0">
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
                          <td className="py-3.5 text-right font-semibold text-surface-700 dark:text-surface-300">
                            {formatPercent(h.confidence_score)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
