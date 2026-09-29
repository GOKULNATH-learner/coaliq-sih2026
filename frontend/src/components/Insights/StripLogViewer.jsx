import React from 'react';

const StripLogViewer = ({ borehole }) => {
  if (!borehole) return null;

  const totalDepth = borehole.total_depth_m || 180;
  const lithology = borehole.lithology_intervals || [];

  return (
    <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-coal-700 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Borehole Lithology Strip Log — {borehole.borehole_id}</span>
            <span className="text-xs text-amber-400 bg-coal-900 border border-coal-700 px-2 py-0.5 rounded font-mono">
              Elevation: {borehole.elevation_m}m RL
            </span>
          </h3>
          <p className="text-xs text-slate-400">Vertical geological column down to total depth {totalDepth} m.</p>
        </div>

        <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
          {borehole.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Visual Vertical Depth Strip */}
        <div className="md:col-span-4 bg-coal-900 border border-coal-700 rounded-lg p-4 flex flex-col items-center">
          <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider">Lithology Depth Strip</p>
          
          <div className="w-24 border-2 border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-inner relative" style={{ height: '360px' }}>
            {lithology.map((interval, idx) => {
              const heightPercent = ((interval.to_m - interval.from_m) / totalDepth) * 100;
              const isCoal = interval.lithology_type.includes('Coal');

              return (
                <div
                  key={idx}
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: interval.color || '#555'
                  }}
                  className="w-full relative group cursor-pointer transition-opacity hover:opacity-90 flex items-center justify-center border-b border-black/20"
                >
                  <span className={`text-[9px] font-bold px-1 text-center truncate ${isCoal ? 'text-amber-400 font-mono' : 'text-slate-900'}`}>
                    {interval.lithology_type.split(' ')[0]}
                  </span>

                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute left-28 top-0 bg-coal-900 text-slate-100 text-xs rounded-lg p-2.5 shadow-xl border border-coal-700 z-50 whitespace-nowrap">
                    <p className="font-bold text-amber-400">{interval.lithology_type}</p>
                    <p>Depth: {interval.from_m} m — {interval.to_m} m</p>
                    <p className="text-[11px] text-slate-400 italic mt-0.5">{interval.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>0.0m</span>
            <span>{totalDepth}m</span>
          </div>
        </div>

        {/* Stratigraphic Details Table */}
        <div className="md:col-span-8 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Lithological Intervals & Descriptions</h4>

          <div className="overflow-x-auto border border-coal-700 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-coal-900 border-b border-coal-700 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">From - To (m)</th>
                  <th className="py-2.5 px-3">Lithology Type</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coal-700/60">
                {lithology.map((l, i) => (
                  <tr key={i} className="hover:bg-coal-700/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-amber-400">{l.from_m} - {l.to_m} m</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: l.color }}></span>
                      {l.lithology_type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 italic">{l.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripLogViewer;
