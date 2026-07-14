import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/predict',   label: 'Predict' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reports',   label: 'AI Reports' },
  { to: '/about',     label: 'About Model' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-white/60 backdrop-blur-2xl backdrop-saturate-[1.8] dark:border-surface-800/40 dark:bg-surface-950/60">
      <div className="section-padding flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="MediPredict AI Home">
          <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl shadow-glow transition-transform group-hover:scale-110">
            <img src="/logo.png" alt="MediPredict Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-bold text-surface-900 dark:text-white">
            Medi<span className="gradient-text">Predict</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white'
                )}
              >
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-brand-50 dark:bg-brand-950/40 -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:hover:bg-surface-800 dark:hover:text-white cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <Link
            to="/predict"
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-glow active:scale-[0.98]"
          >
            Get Prediction
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === to
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800'
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/predict"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Get Prediction
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
