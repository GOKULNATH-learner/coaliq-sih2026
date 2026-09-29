import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, User, Search, FileText } from 'lucide-react';
import { getAuditLogs } from '../../services/api';

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => 
    l.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.target_entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 bg-coal-800 rounded-xl border border-coal-700">
        Loading System Audit Trail...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-amber-500" />
            <span>CoalIQ Cryptographic Audit & Governance Trail</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Immutable log of all human engineer approvals, document uploads, field edits, and report generations.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-coal-900 border border-coal-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-coal-700 pb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">System Event Log ({filteredLogs.length} Records)</h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governance Compliant</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-coal-700 text-slate-400 uppercase text-[11px]">
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">User Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Action Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-700/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-coal-700/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{log.user_name}</td>
                  <td className="py-3 px-3">
                    <span className="bg-coal-900 text-amber-400 border border-coal-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.user_role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('EDIT') || log.action.includes('APPROVE') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{log.target_entity}</td>
                  <td className="py-3 px-3 text-slate-400 italic max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;
