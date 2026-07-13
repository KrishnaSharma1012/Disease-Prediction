import { Link } from 'react-router-dom';
import { Activity, Globe, ExternalLink, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-900/50">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-surface-900 dark:text-white">MediPredict</span>
            </Link>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              AI-powered disease prediction system built to assist healthcare screening with machine learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[{ to: '/predict', label: 'Disease Prediction' }, { to: '/dashboard', label: 'Dashboard' }, { to: '/about', label: 'About Model' }].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-500 hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Documentation', 'API Reference', 'Research Paper', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <span className="text-sm text-surface-500 dark:text-surface-400 cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Globe,          label: 'GitHub' },
                { icon: ExternalLink,   label: 'LinkedIn' },
                { icon: Mail,     label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-surface-500 transition-all hover:bg-brand-50 hover:text-brand-600 dark:bg-surface-800 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 cursor-pointer"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-200 pt-8 dark:border-surface-800 sm:flex-row">
          <p className="text-xs text-surface-400 dark:text-surface-500">
            © {new Date().getFullYear()} MediPredict AI. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-surface-400 dark:text-surface-500">
            Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
