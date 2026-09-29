import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { report_type: 'Geological Report', Manual: 10, CoalIQ: 2 },
  { report_type: 'Production Plan', Manual: 5, CoalIQ: 1 },
  { report_type: 'Compliance Report', Manual: 4, CoalIQ: 1 }
];

const EffortChart = () => {
  return (
    <div className="bg-coal-800 border border-coal-700 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100">Effort per Report (Days)</h3>
          <p className="text-xs text-slate-400">Manual vs CoalIQ Automated & Human-Verified Pipeline</p>
        </div>
        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          80% Avg Efficiency Gain
        </div>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <XAxis dataKey="report_type" stroke="#94A3B8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} unit=" d" tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }}
              itemStyle={{ color: '#F8FAFC' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Manual" fill="#64748B" radius={[4, 4, 0, 0]} name="Manual Engineering Effort (Days)" />
            <Bar dataKey="CoalIQ" fill="#F59E0B" radius={[4, 4, 0, 0]} name="CoalIQ AI + Review Effort (Days)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EffortChart;
