import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getReports } from '../api/predictionService';
import { FileText, Loader, AlertCircle } from 'lucide-react';
import Card from '../components/Card';

const API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await getReports();
        setReports(data);
        if (data.length > 0) {
          setActiveReportId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
        setError("Could not load AI reports from the server. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const activeReport = reports.find(r => r.id === activeReportId);

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="section-padding max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-400 dark:from-blue-400 dark:to-cyan-300">Reports</span>
          </h1>
          <p className="text-lg text-surface-600 dark:text-blue-200/60 max-w-2xl">
            Deep dive into the data analysis and machine learning metrics generated during the model training phase.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader className="w-10 h-10 text-brand-500 dark:text-blue-400 animate-spin" />
            <p className="text-surface-600 dark:text-blue-200/60 font-medium">Loading reports...</p>
          </div>
        ) : error ? (
          <Card className="border-red-500/30 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-200 mb-1">Error Loading Reports</h3>
              <p className="text-red-600 dark:text-red-300/70">{error}</p>
            </div>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="text-center py-20">
            <FileText className="w-12 h-12 text-surface-400 dark:text-blue-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">No Reports Found</h3>
            <p className="text-surface-600 dark:text-blue-200/60">There are no ML reports available in the backend currently.</p>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
              <h3 className="text-sm font-semibold text-surface-500 dark:text-blue-300 uppercase tracking-wider mb-4 px-2">Available Reports</h3>
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReportId(report.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeReportId === report.id
                      ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-blue-500/20 dark:text-white dark:border-blue-400/30 dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 dark:text-blue-200/60 dark:hover:bg-white/5 dark:hover:text-blue-100 border border-transparent'
                  }`}
                >
                  <FileText className={`w-5 h-5 ${activeReportId === report.id ? 'text-brand-600 dark:text-blue-400' : 'text-surface-400 dark:text-blue-400/50'}`} />
                  <span className="font-medium truncate">{report.title}</span>
                </button>
              ))}
            </div>

            {/* Markdown Content Area */}
            <Card className="flex-1 p-6 md:p-10 min-w-0 overflow-hidden">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, ...props }) => {
                      let src = props.src;
                      if (src && src.includes('figures/')) {
                        const filename = src.split('figures/').pop();
                        src = `${API_URL}/api/reports/figures/${filename}`;
                      }
                      return <img {...props} src={src} className="rounded-xl border border-surface-200 dark:border-blue-900/30 my-8 shadow-xl max-w-full bg-surface-50 dark:bg-slate-900/50" />;
                    },
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-surface-900 dark:text-white mt-1 mb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-surface-800 dark:text-blue-100 mt-10 mb-4 border-b border-surface-200 dark:border-blue-900/50 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-surface-800 dark:text-blue-200 mt-8 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-surface-700 dark:text-blue-100/80 leading-relaxed mb-5" {...props} />,
                    li: ({node, ...props}) => <li className="text-surface-700 dark:text-blue-100/80 mb-2 ml-6 list-disc" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto my-8 border border-surface-200 dark:border-blue-900/30 rounded-xl"><table className="w-full text-left border-collapse" {...props} /></div>,
                    th: ({node, ...props}) => <th className="bg-surface-50 dark:bg-blue-950/50 text-surface-900 dark:text-blue-100 p-4 font-semibold border-b border-surface-200 dark:border-blue-900/50" {...props} />,
                    td: ({node, ...props}) => <td className="p-4 border-b border-surface-200 dark:border-blue-900/20 text-surface-700 dark:text-blue-100/80" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-surface-50 dark:hover:bg-blue-900/10 transition-colors" {...props} />,
                    code: ({node, inline, className, ...props}) => {
                      return inline ? 
                        <code className="bg-surface-100 dark:bg-blue-900/40 text-surface-800 dark:text-blue-200 px-1.5 py-0.5 rounded text-sm font-mono border border-surface-200 dark:border-blue-800/30" {...props} /> : 
                        <pre className="bg-surface-50 dark:bg-slate-950/80 p-5 rounded-xl overflow-x-auto border border-surface-200 dark:border-blue-900/30 my-6 shadow-inner"><code className="text-surface-800 dark:text-cyan-300 font-mono text-sm" {...props} /></pre>
                    },
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-500 dark:border-blue-500/50 pl-4 py-1 my-6 bg-brand-50 dark:bg-blue-950/20 italic text-surface-700 dark:text-blue-200/90 rounded-r-lg" {...props} />
                  }}
                >
                  {activeReport?.content || ''}
                </ReactMarkdown>
              </div>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}
