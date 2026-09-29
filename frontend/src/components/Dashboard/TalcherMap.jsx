import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Marker Icons
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const iconValidated = createIcon('#10B981'); // Emerald
const iconPending = createIcon('#F59E0B');   // Amber
const iconAnomaly = createIcon('#EF4444');   // Red

const TalcherMap = ({ boreholes, onSelectBorehole }) => {
  const center = [20.955, 85.145]; // Talcher Coalfield Center

  return (
    <div className="bg-coal-800 border border-coal-700 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Talcher Coalfield Borehole Map</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-normal px-2 py-0.5 rounded border border-amber-500/30">
              Odisha, India (~20.95°N, 85.15°E)
            </span>
          </h3>
          <p className="text-xs text-slate-400">Click markers to view lithology stratification & coal seam parameters.</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow"></span>
            <span className="text-slate-300">Validated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow"></span>
            <span className="text-slate-300">Pending Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow"></span>
            <span className="text-slate-300">Flagged Anomaly</span>
          </div>
        </div>
      </div>

      <div className="h-[360px] w-full rounded-lg overflow-hidden border border-coal-700">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {boreholes.map((bh) => {
            let icon = iconValidated;
            if (bh.status === 'Pending Review') icon = iconPending;
            if (bh.status === 'Flagged Anomaly') icon = iconAnomaly;

            return (
              <Marker key={bh.borehole_id} position={[bh.latitude, bh.longitude]} icon={icon}>
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between font-bold text-sm text-slate-900 border-b pb-1 mb-2">
                      <span>{bh.borehole_id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${
                        bh.status === 'Validated' ? 'bg-emerald-600' : (bh.status === 'Pending Review' ? 'bg-amber-600' : 'bg-red-600')
                      }`}>
                        {bh.status}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-slate-700">
                      <p><strong>Block:</strong> {bh.block_name}</p>
                      <p><strong>Total Depth:</strong> {bh.total_depth_m} m</p>
                      <p><strong>Elevation:</strong> {bh.elevation_m} m RL</p>
                      <p><strong>Seams Identified:</strong> {bh.seams?.length || 3}</p>
                    </div>
                    <button 
                      onClick={() => onSelectBorehole && onSelectBorehole(bh.borehole_id)}
                      className="mt-3 w-full bg-coal-800 text-amber-400 hover:bg-coal-900 text-xs font-semibold py-1 rounded shadow"
                    >
                      View Strip Log & Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default TalcherMap;
