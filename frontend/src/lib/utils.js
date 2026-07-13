export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getRiskColor(risk) {
  const colors = {
    LOW:    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    MEDIUM: { bg: 'bg-amber-100 dark:bg-amber-900/30',    text: 'text-amber-700 dark:text-amber-400',    border: 'border-amber-200 dark:border-amber-800' },
    HIGH:   { bg: 'bg-red-100 dark:bg-red-900/30',        text: 'text-red-700 dark:text-red-400',        border: 'border-red-200 dark:border-red-800' },
  };
  return colors[risk] || colors.LOW;
}

export function getRiskLabel(risk) {
  const labels = { LOW: 'Low Risk', MEDIUM: 'Medium Risk', HIGH: 'High Risk' };
  return labels[risk] || 'Unknown';
}
