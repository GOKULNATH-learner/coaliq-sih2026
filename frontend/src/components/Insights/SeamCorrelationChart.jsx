import React, { useState, useEffect } from 'react';
import { Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { getSeamCorrelation } from '../../services/api';

const SeamCorrelationChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchCorrelation();
  }, []);

  const fetchCorrelation = async () => {
    try {
      const res = await getSeamCorrelation('BH-TAL-01,BH-TAL-02,BH-TAL-03,BH-TAL-04');
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const matrix = data?.correlation_matrix || [];

  return (
    <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-coal-700 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Multi-Borehole Seam Stratigraphic Correlation</span>
          </h3>
          <p className="text-xs text-slate-400">Cross-sectional coal seam continuity across BH-TAL-01 to BH-TAL-04 (Talcher Basin).</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="bg-coal-900 border border-coal-700 text-amber-400 px-3 py-1 rounded font-mono">
            Dip Direction: {data?.dip_direction || 'S 15° W'} ({data?.dip_angle_deg || 3.5}°)
          </span>
        </div>
      </div>

      {/* Cross-section visual */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {matrix.map((bh, idx) => (
          <div key={idx} className="bg-coal-900 border border-coal-700 rounded-lg p-4 space-y-3 relative">
            <div className="flex items-center justify-between border-b border-coal-800 pb-2">
              <span className="font-bold text-amber-400 text-sm">{bh.borehole_id}</span>
              <span className="text-[11px] text-slate-400 font-mono">RL: {bh.elevation_m}m</span>
            </div>

            <div className="space-y-2 text-xs">
              {bh.seams.map((s, sIdx) => (
                <div key={sIdx} className="bg-coal-800 border border-amber-500/40 p-2.5 rounded-lg space-y-1 hover:border-amber-500 transition-colors">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>{s.seam_name}</span>
                    <span className="text-amber-400 font-mono">{s.thickness_m}m</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Depth: {s.top_m} - {s.bottom_m}m</span>
                    <span>Ash: {s.ash_percent}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    GCV: {s.gcv_kcal_kg} kcal/kg
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-coal-900/80 p-3 rounded-lg border border-coal-700 text-xs text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Structural continuity: <strong>High (Unfaulted Barakar Member stratigraphy)</strong></span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">Citations grounded in CMPDI Field Registry</span>
      </div>
    </div>
  );
};

export default SeamCorrelationChart;
