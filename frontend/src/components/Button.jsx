import { forwardRef } from 'react';
import { cn } from '../lib/utils';

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-glow active:scale-[0.98]',
  secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-900 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-100',
  outline:   'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 dark:text-brand-400',
  ghost:     'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  teal:      'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-glow-teal active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3.5 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
  xl: 'px-9 py-4 text-lg rounded-2xl',
};

const Button = forwardRef(({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
