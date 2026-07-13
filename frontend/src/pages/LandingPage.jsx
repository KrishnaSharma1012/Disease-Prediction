import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Brain, ShieldCheck, Zap, BarChart3, Stethoscope,
  ArrowRight, CheckCircle2, ChevronDown, Star, Sparkles,
  Heart, Clock, Users, TrendingUp
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import AnimatedCounter from '../components/AnimatedCounter';
import { useState, lazy, Suspense } from 'react';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ─── HERO ──────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden gradient-bg gradient-mesh min-h-[90vh] flex items-center">
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-300/8 blur-2xl animate-pulse-slow" />
      </div>

      <div className="section-padding relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Healthcare Screening
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-surface-900 dark:text-white">
              Predict Diseases
              <br />
              <span className="gradient-text">Before They Strike</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
              Harness the power of machine learning to get instant health risk assessments. Early detection saves lives — get your free prediction in under 60 seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link to="/predict">
                <Button size="lg" className="gap-2">
                  Start Prediction <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  How It Works
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6 text-sm text-surface-500 dark:text-surface-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-teal-500" /> HIPAA Compliant</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Results in seconds</span>
            </motion.div>
          </motion.div>

          {/* Right — Animated card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl border border-white/20 bg-white/60 p-8 shadow-glass backdrop-blur-2xl dark:border-surface-700/30 dark:bg-surface-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-900 dark:text-white">Health Analysis</p>
                  <p className="text-xs text-surface-400">Real-time AI prediction</p>
                </div>
              </div>
              {/* Mini chart bars */}
              <div className="space-y-3">
                {[
                  { label: 'Glucose Level', value: 78, color: 'bg-brand-500' },
                  { label: 'BMI Index',     value: 62, color: 'bg-teal-500' },
                  { label: 'Blood Pressure',value: 45, color: 'bg-violet-500' },
                  { label: 'Risk Score',    value: 23, color: 'bg-emerald-500' },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-500 dark:text-surface-400">{bar.label}</span>
                      <span className="font-semibold text-surface-700 dark:text-surface-300">{bar.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${bar.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Low Risk Detected</span>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-brand-400/20 to-teal-400/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─────────────────────────────────────── */
function Stats() {
  const stats = [
    { icon: Users,       value: 10000,  suffix: '+', label: 'Predictions Made' },
    { icon: TrendingUp,  value: 96.3,   suffix: '%', label: 'Recall Rate', decimals: 1 },
    { icon: Clock,       value: 3,      suffix: 's',  label: 'Avg Response' },
    { icon: Heart,       value: 83.3,   suffix: '%', label: 'ROC-AUC Score', decimals: 1 },
  ];
  return (
    <section className="relative -mt-8 z-10 section-padding">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}
            className="rounded-2xl border border-white/20 bg-white/60 p-5 text-center shadow-glass backdrop-blur-xl dark:border-surface-700/30 dark:bg-surface-800/50"
          >
            <s.icon className="mx-auto mb-2 h-6 w-6 text-brand-500" />
            <p className="text-2xl font-extrabold text-surface-900 dark:text-white">
              <AnimatedCounter target={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
            </p>
            <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── FEATURES ──────────────────────────────────── */
function Features() {
  const features = [
    { icon: Brain,       title: 'AI-Powered Analysis',     desc: 'Advanced XGBoost model trained on clinical data delivers accurate risk assessments in seconds.', color: 'from-brand-500 to-brand-700' },
    { icon: ShieldCheck, title: 'Privacy First',            desc: 'Your data never leaves your session. No personal information is stored or shared.', color: 'from-teal-500 to-teal-700' },
    { icon: BarChart3,   title: 'Detailed Reports',         desc: 'Get comprehensive breakdown of risk factors, preventive measures, and lifestyle recommendations.', color: 'from-violet-500 to-violet-700' },
    { icon: Stethoscope, title: 'Clinical-Grade Metrics',   desc: 'Built with healthcare-standard metrics: ROC-AUC, Recall, and F1 Score validated on test data.', color: 'from-amber-500 to-orange-600' },
    { icon: Zap,         title: 'Instant Results',          desc: 'No waiting. Submit your health data and receive your risk assessment within seconds.', color: 'from-pink-500 to-rose-600' },
    { icon: Activity,    title: 'Track Your History',       desc: 'Monitor prediction history over time with intuitive dashboards and analytics.', color: 'from-emerald-500 to-emerald-700' },
  ];
  return (
    <section className="py-24 section-padding">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center mb-16">
        <motion.p variants={fadeUp} className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">FEATURES</motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">
          Everything You Need for <span className="gradient-text">Smart Screening</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl mx-auto text-surface-500 dark:text-surface-400">
          A comprehensive suite of tools designed to make early disease detection accessible, fast, and reliable.
        </motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f) => (
          <motion.div key={f.title} variants={fadeUp}>
            <Card className="h-full group">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg transition-transform group-hover:scale-110`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── WORKFLOW ──────────────────────────────────── */
function Workflow() {
  const steps = [
    { num: '01', title: 'Enter Health Data',  desc: 'Fill in your glucose level, BMI, blood pressure, and other basic health metrics.', icon: Stethoscope },
    { num: '02', title: 'AI Analysis',        desc: 'Our XGBoost model processes your data through a clinically-validated pipeline.', icon: Brain },
    { num: '03', title: 'Get Results',         desc: 'Receive a detailed risk assessment with confidence scores and recommendations.', icon: BarChart3 },
  ];
  return (
    <section className="py-24 bg-surface-50 dark:bg-surface-900/30 section-padding">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
        <motion.p variants={fadeUp} className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">HOW IT WORKS</motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">
          Three Simple Steps
        </motion.h2>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="grid md:grid-cols-3 gap-8"
      >
        {steps.map((s) => (
          <motion.div key={s.num} variants={fadeUp} className="relative text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-card dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
              <s.icon className="h-8 w-8 text-brand-500" />
            </div>
            <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">Step {s.num}</span>
            <h3 className="mt-2 text-xl font-bold text-surface-900 dark:text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────── */
function Testimonials() {
  const testimonials = [
    { name: 'Dr. Sarah Chen', role: 'Endocrinologist', text: 'The prediction accuracy is impressive. This tool could revolutionize early diabetes screening in primary care settings.', rating: 5 },
    { name: 'Rajesh Kumar',   role: 'Patient',        text: 'I was able to catch my pre-diabetic condition early thanks to this tool. My doctor confirmed the results.', rating: 5 },
    { name: 'Dr. Maria Lopez', role: 'Family Medicine', text: 'An excellent educational and screening tool. The confidence scores help me prioritize patient follow-ups.', rating: 4 },
  ];
  return (
    <section className="py-24 section-padding">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
        <motion.p variants={fadeUp} className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">TESTIMONIALS</motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">
          Trusted by Healthcare Professionals
        </motion.h2>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="grid md:grid-cols-3 gap-6"
      >
        {testimonials.map((t) => (
          <motion.div key={t.name} variants={fadeUp}>
            <Card className="h-full">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-200 dark:text-surface-600'}`} />
                ))}
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-surface-400">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    { q: 'How accurate is the prediction?',        a: 'Our model achieves a 96.3% recall rate on the test dataset, meaning it correctly identifies the vast majority of positive cases. However, it is designed as a screening tool, not a medical diagnosis.' },
    { q: 'Is my health data stored?',               a: 'No. All predictions are processed client-side with mock data, or through a secure API. No personally identifiable health information is stored on our servers.' },
    { q: 'Which diseases can it predict?',           a: 'Currently, the model is trained to predict Type 2 Diabetes using the Pima Indians Diabetes Dataset. We plan to expand to heart disease and other conditions in future releases.' },
    { q: 'Can I use this as a medical diagnosis?',   a: 'No. This tool is for educational and screening purposes only. Always consult a qualified healthcare professional for medical advice and diagnosis.' },
    { q: 'What machine learning model is used?',     a: 'We use an XGBoost classifier with SMOTE-augmented training data, optimized via Randomized Search Cross-Validation for maximum recall in healthcare settings.' },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-surface-50 dark:bg-surface-900/30 section-padding">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
        <motion.p variants={fadeUp} className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">FAQ</motion.p>
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">
          Frequently Asked Questions
        </motion.h2>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="max-w-3xl mx-auto space-y-3"
      >
        {faqs.map((faq, i) => (
          <motion.div key={i} variants={fadeUp}
            className="rounded-2xl border border-surface-200 bg-white overflow-hidden dark:border-surface-700/60 dark:bg-surface-800/80"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{faq.q}</span>
              <ChevronDown className={`h-5 w-5 text-surface-400 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-24 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 p-12 text-center shadow-glow-lg animate-glow-pulse"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent)]" />
        <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Ready to Check Your Health?
        </h2>
        <p className="relative max-w-xl mx-auto text-brand-100 mb-8 leading-relaxed">
          Get your free AI-powered health risk assessment in under 60 seconds. No sign-up required.
        </p>
        <Link to="/predict" className="relative inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-700 shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-100">
          Start Free Prediction <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── PAGE ───────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Workflow />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
