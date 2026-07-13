import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Database, Target, BarChart3, Activity, TrendingUp,
  CheckCircle2, Award, Layers, GitBranch
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import Card from '../components/Card';
import { getModelInfo } from '../api/predictionService';
import { cn } from '../lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function MetricCard({ label, value, icon: Icon, color, description }) {
  return (
    <Card className="relative overflow-hidden text-center">
      <div className={cn('absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-br opacity-10', color)} />
      <div className={cn('mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md', color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="text-3xl font-extrabold text-surface-900 dark:text-white">{typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : value}</p>
      <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mt-1">{label}</p>
      {description && <p className="text-xs text-surface-400 mt-1">{description}</p>}
    </Card>
  );
}

export default function AboutPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelInfo().then(data => { setInfo(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="gradient-bg min-h-screen py-12">
        <div className="section-padding max-w-5xl mx-auto space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-surface-100 dark:bg-surface-800 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const { dataset, algorithms, metrics, features } = info;

  const metricsCards = [
    { label: 'Accuracy',  value: metrics.accuracy,  icon: Target,      color: 'from-brand-500 to-brand-700',   description: 'Overall correct predictions' },
    { label: 'Precision', value: metrics.precision,  icon: CheckCircle2,color: 'from-violet-500 to-violet-700', description: 'True positives / predicted positives' },
    { label: 'Recall',    value: metrics.recall,     icon: TrendingUp,  color: 'from-emerald-500 to-emerald-700', description: 'Sick patients correctly identified' },
    { label: 'F1 Score',  value: metrics.f1,         icon: Activity,    color: 'from-amber-500 to-orange-600',  description: 'Harmonic mean of precision & recall' },
    { label: 'ROC-AUC',   value: metrics.roc_auc,    icon: Award,       color: 'from-pink-500 to-rose-600',     description: 'Area under the ROC curve' },
  ];

  const featureData = features.map(f => ({
    name: f.name.length > 10 ? f.name.substring(0, 10) + '…' : f.name,
    importance: +(f.importance * 100).toFixed(1),
    fullName: f.name,
  }));

  const radarData = [
    { metric: 'Accuracy',  value: +(metrics.accuracy * 100).toFixed(0) },
    { metric: 'Precision', value: +(metrics.precision * 100).toFixed(0) },
    { metric: 'Recall',    value: +(metrics.recall * 100).toFixed(0) },
    { metric: 'F1',        value: +(metrics.f1 * 100).toFixed(0) },
    { metric: 'ROC-AUC',   value: +(metrics.roc_auc * 100).toFixed(0) },
  ];

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="section-padding max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 shadow-glow">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white">About the Model</h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Explore the machine learning architecture, training metrics, and dataset powering MediPredict AI.
            </p>
          </motion.div>

          {/* Dataset Info */}
          <motion.div variants={fadeUp} className="mb-8">
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-900 dark:text-white">Training Dataset</h2>
                  <p className="text-xs text-surface-400">{dataset.source}</p>
                </div>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-4">{dataset.description}</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Rows', value: dataset.rows },
                  { label: 'Features', value: dataset.features },
                  { label: 'Target', value: dataset.target.split(' ')[0] },
                ].map(item => (
                  <div key={item.label} className="rounded-xl bg-surface-50 p-4 text-center dark:bg-surface-700/50">
                    <p className="text-xl font-extrabold text-surface-900 dark:text-white">{item.value}</p>
                    <p className="text-xs text-surface-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Metrics Cards */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Model Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {metricsCards.map(m => <MetricCard key={m.label} {...m} />)}
            </div>
          </motion.div>

          {/* Charts */}
          <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Feature Importance */}
            <Card hover={false}>
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Feature Importance</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={featureData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" unit="%" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }}
                    formatter={(val, _, props) => [`${val}%`, props.payload.fullName]}
                  />
                  <Bar dataKey="importance" fill="#3b8bff" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Radar */}
            <Card hover={false}>
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Performance Radar</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.2)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Radar dataKey="value" stroke="#3b8bff" fill="#3b8bff" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Algorithms Table */}
          <motion.div variants={fadeUp}>
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-md">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white">Algorithms Evaluated</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 dark:border-surface-700">
                      <th className="pb-3 text-left font-semibold text-surface-500 text-xs uppercase tracking-wider">Algorithm</th>
                      <th className="pb-3 text-left font-semibold text-surface-500 text-xs uppercase tracking-wider">Type</th>
                      <th className="pb-3 text-right font-semibold text-surface-500 text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {algorithms.map(a => (
                      <tr key={a.name} className="border-b border-surface-50 dark:border-surface-800 last:border-0">
                        <td className="py-3.5 font-medium text-surface-900 dark:text-white flex items-center gap-2">
                          <GitBranch className="h-3.5 w-3.5 text-surface-400" />
                          {a.name}
                        </td>
                        <td className="py-3.5 text-surface-500 dark:text-surface-400">{a.type}</td>
                        <td className="py-3.5 text-right">
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                            a.status.includes('✓')
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : a.status === 'Runner-up'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                          )}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
