import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Card({ className, children, hover = true, glass = false, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 20px 50px rgba(59,139,255,0.06)' },
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300',
        glass
          ? 'border-white/20 bg-white/60 backdrop-blur-2xl shadow-card dark:border-surface-700/30 dark:bg-surface-800/50'
          : 'border-surface-200/60 bg-white/90 backdrop-blur-sm shadow-card dark:border-surface-700/50 dark:bg-surface-800/70',
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
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
