import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Pickaxe, Flame } from 'lucide-react';

const Navbar = () => {
  const { currentUser, switchRole } = useAuth();

  return (
    <header className="bg-coal-800 border-b border-coal-700 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      {/* Brand Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-coal-900 px-3 py-1.5 rounded-lg font-bold shadow-md">
          <Pickaxe className="w-5 h-5" />
          <span className="tracking-wider text-lg">CoalIQ</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-coal-900/80 text-slate-300 px-3 py-1.5 rounded-md border border-coal-700">
          <span className="text-amber-500 font-bold">SIH26023</span>
          <span className="text-slate-500">|</span>
          <span>CMPDI / CIL Solution</span>
        </div>
      </div>

      {/* Human-in-the-loop Badge & Role Switcher */}
      <div className="flex items-center gap-5">
        {/* Human-in-the-loop Persistent Badge */}
        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Human-in-the-loop: Engineer approval required</span>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-coal-900 px-3 py-1.5 rounded-lg border border-coal-700">
          <User className="w-4 h-4 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200">{currentUser.name}</span>
            <span className="text-[10px] text-slate-400">{currentUser.role}</span>
          </div>
          <select 
            value={currentUser.role.includes('Engineer') ? 'Engineer' : (currentUser.role.includes('Planner') ? 'Planner' : 'Management')}
            onChange={(e) => switchRole(e.target.value)}
            className="ml-2 bg-coal-800 text-xs text-amber-400 border border-coal-700 rounded px-2 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="Engineer">Engineer View</option>
            <option value="Planner">Planner View</option>
            <option value="Management">Management View</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
