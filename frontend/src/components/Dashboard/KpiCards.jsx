import React from 'react';
import { FileCheck, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

const KpiCards = ({ kpis }) => {
  const cards = [
    {
      title: 'Reports Generated',
      value: kpis?.reports_generated || 14,
      sub: 'Geological & Mining GRs',
      icon: FileCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: 'Avg. Time Saved',
      value: `${kpis?.avg_time_saved_days || 8.5} Days`,
      sub: 'From 10 days down to 2 days',
      icon: Clock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Pending Reviews',
      value: kpis?.pending_reviews || 3,
      sub: 'Engineer approval queue',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: 'Anomalies Flagged',
      value: kpis?.anomalies_flagged || 2,
      sub: 'Outlier thickness & ash %',
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div key={idx} className={`p-4 rounded-xl border ${c.bg} bg-coal-800/90 shadow-md flex items-center justify-between`}>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{c.title}</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{c.value}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{c.sub}</p>
            </div>
            <div className={`p-3 rounded-xl bg-coal-900/80 ${c.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
