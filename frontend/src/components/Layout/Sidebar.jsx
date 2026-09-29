import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileSearch, 
  Layers, 
  CheckSquare, 
  FileText, 
  History 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingestion', label: 'Data Ingestion', icon: UploadCloud },
    { id: 'extraction', label: 'AI Extraction', icon: FileSearch },
    { id: 'insights', label: 'Seam & Reserves', icon: Layers },
    { id: 'review', label: 'Review Queue', icon: CheckSquare, badge: '3 Pending' },
    { id: 'report', label: 'Report Builder', icon: FileText },
    { id: 'audit', label: 'Audit Trail', icon: History }
  ];

  return (
    <aside className="w-64 bg-coal-800 border-r border-coal-700 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-amber-500/15 text-amber-400 border-l-4 border-amber-500 font-semibold' 
                  : 'text-slate-300 hover:bg-coal-700/60 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Coal Field Information */}
      <div className="bg-coal-900/90 border border-coal-700 rounded-xl p-3.5 space-y-2">
        <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
          <span>Target Field</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Odisha</span>
        </div>
        <p className="text-xs text-slate-300 font-medium">Talcher Coalfield</p>
        <p className="text-[11px] text-slate-400">Mahanadi Coalfields Limited (MCL) / CMPDI RI-VII</p>
      </div>
    </aside>
  );
};

export default Sidebar;
