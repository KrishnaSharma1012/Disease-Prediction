import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, User, Droplets, Heart, Ruler, Pill,
  Scale, Dna, Calendar, Info, ArrowRight, AlertCircle
} from 'lucide-react';
import Button from '../components/Button';
import { predictDisease } from '../api/predictionService';
import { useState } from 'react';

const schema = z.object({
  Pregnancies:              z.coerce.number().min(0, 'Min 0').max(20, 'Max 20'),
  Glucose:                  z.coerce.number().min(0, 'Min 0').max(400, 'Max 400'),
  BloodPressure:            z.coerce.number().min(0, 'Min 0').max(200, 'Max 200'),
  SkinThickness:            z.coerce.number().min(0, 'Min 0').max(120, 'Max 120'),
  Insulin:                  z.coerce.number().min(0, 'Min 0').max(900, 'Max 900'),
  BMI:                      z.coerce.number().min(0, 'Min 0').max(80, 'Max 80'),
  DiabetesPedigreeFunction: z.coerce.number().min(0, 'Min 0').max(2.5, 'Max 2.5'),
  Age:                      z.coerce.number().min(1, 'Min 1').max(120, 'Max 120'),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const FIELD_GROUPS = [
  {
    title: 'Demographics',
    icon: User,
    fields: [
      { name: 'Pregnancies', label: 'Pregnancies', icon: User, placeholder: '0', tooltip: 'Number of times pregnant', step: '1' },
      { name: 'Age', label: 'Age (years)', icon: Calendar, placeholder: '25', tooltip: 'Patient age in years', step: '1' },
    ],
  },
  {
    title: 'Vital Signs',
    icon: Heart,
    fields: [
      { name: 'Glucose', label: 'Glucose (mg/dL)', icon: Droplets, placeholder: '120', tooltip: 'Plasma glucose concentration (2hr oral glucose tolerance test)' },
      { name: 'BloodPressure', label: 'Blood Pressure (mm Hg)', icon: Heart, placeholder: '80', tooltip: 'Diastolic blood pressure' },
    ],
  },
  {
    title: 'Lab Results',
    icon: Pill,
    fields: [
      { name: 'SkinThickness', label: 'Skin Thickness (mm)', icon: Ruler, placeholder: '20', tooltip: 'Triceps skinfold thickness' },
      { name: 'Insulin', label: 'Insulin (μU/mL)', icon: Pill, placeholder: '80', tooltip: '2-hour serum insulin level' },
    ],
  },
  {
    title: 'Physical & Genetic',
    icon: Dna,
    fields: [
      { name: 'BMI', label: 'BMI (kg/m²)', icon: Scale, placeholder: '25.0', tooltip: 'Body Mass Index = weight(kg) / height(m)²', step: '0.1' },
      { name: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree', icon: Dna, placeholder: '0.5', tooltip: 'Genetic risk score based on family history', step: '0.001' },
    ],
  },
];

function FieldInput({ field, register, error }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className="relative">
      <label htmlFor={field.name} className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
        <field.icon className="h-4 w-4 text-brand-500" />
        {field.label}
        <button
          type="button"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onFocus={() => setShowTip(true)}
          onBlur={() => setShowTip(false)}
          className="relative cursor-help"
          aria-label={`Info about ${field.label}`}
        >
          <Info className="h-3.5 w-3.5 text-surface-400" />
          {showTip && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-surface-900 px-3 py-2 text-xs text-white shadow-lg z-50 dark:bg-surface-700">
              {field.tooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-900 dark:border-t-surface-700" />
            </span>
          )}
        </button>
      </label>
      <input
        id={field.name}
        type="number"
        step={field.step || 'any'}
        placeholder={field.placeholder}
        {...register(field.name)}
        className={`w-full rounded-xl border px-4 py-3 text-sm bg-white transition-all duration-200 placeholder:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-600 ${
          error ? 'border-red-400 ring-2 ring-red-400/20' : 'border-surface-200 dark:border-surface-700'
        }`}
        aria-invalid={!!error}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" /> {error.message}
        </p>
      )}
    </div>
  );
}

export default function PredictPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      Pregnancies: '', Glucose: '', BloodPressure: '', SkinThickness: '',
      Insulin: '', BMI: '', DiabetesPedigreeFunction: '', Age: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await predictDisease(data);
      navigate('/predict/results', { state: { result, formData: data } });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="section-padding">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 shadow-glow">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white">Disease Prediction</h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">Enter your health metrics below for an AI-powered risk assessment</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {FIELD_GROUPS.map((group) => (
              <motion.div key={group.title} variants={fadeUp}
                className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card dark:border-surface-700/60 dark:bg-surface-800/80"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/40">
                    <group.icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h2 className="text-base font-bold text-surface-900 dark:text-white">{group.title}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {group.fields.map((field) => (
                    <FieldInput key={field.name} field={field} register={register} error={errors[field.name]} />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Disclaimer + Submit */}
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800/40 dark:bg-amber-900/10">
                <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span><strong>Medical Disclaimer:</strong> This tool is for educational and screening purposes only. Results should not be considered a medical diagnosis. Always consult a healthcare professional.</span>
                </p>
              </div>

              <Button type="submit" size="xl" className="w-full" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Get Prediction <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
