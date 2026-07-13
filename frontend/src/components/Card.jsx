import { cn } from '../lib/utils';

export default function Card({ className, children, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-200 bg-white p-6 shadow-card transition-all duration-300 dark:border-surface-700/60 dark:bg-surface-800/80',
        hover && 'hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-bold text-surface-900 dark:text-white', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-surface-500 dark:text-surface-400 mt-1', className)}>{children}</p>;
}
