import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle, Edit3, XCircle, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { getReviewQueue, submitReviewAction } from '../../services/api';

const ReviewQueueTable = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editedVal, setEditedVal] = useState('');
  const [engineerNotes, setEngineerNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const items = await getReviewQueue('Pending');
      setQueue(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId, actionType, customValue = null) => {
    try {
      const payload = {
        action: actionType,
        edited_value: customValue || (editingItem ? editedVal : null),
        engineer_notes: engineerNotes || 'Verified against CMPDI geological standards.',
        engineer_name: 'Er. R. K. Sharma',
        user_role: 'Engineer'
      };

      const res = await submitReviewAction(itemId, payload);
      setFeedbackMsg(res.feedback_loop);
      setEditingItem(null);
      setEditedVal('');
      setEngineerNotes('');
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 bg-coal-800 rounded-xl border border-coal-700">
        Loading Human Review Queue...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-500" />
            <span>Human-in-the-Loop Engineer Review Queue</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Engineers approve, edit, or reject flagged fields (&lt;80% confidence or statistical outliers) prior to final report synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <UserCheck className="w-4 h-4" />
          <span>Engineer Mandate Active</span>
        </div>
      </div>

      {/* Learning from Engineer Edits Feedback Toast */}
      {feedbackMsg && (
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
            <div>
              <p className="text-sm font-bold text-amber-300">Learning from Engineer Edits</p>
              <p className="text-xs text-slate-300">{feedbackMsg.delta}</p>
            </div>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs text-slate-400 hover:text-slate-200">Dismiss</button>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-coal-700 pb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Flagged Items Awaiting Engineer Decision</h3>
          <span className="text-xs font-mono text-amber-400 bg-coal-900 px-2.5 py-1 rounded border border-coal-700">
            {queue.length} Pending Review
          </span>
        </div>

        {queue.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="font-semibold text-slate-200">Review Queue Empty!</p>
            <p className="text-xs">All extracted fields and geological anomalies have been approved by engineers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-coal-700 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-3">Borehole ID</th>
                  <th className="py-3 px-3">Field Name</th>
                  <th className="py-3 px-3">Extracted Value</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Flag Reason</th>
                  <th className="py-3 px-3 text-right">Engineer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coal-700/60">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-coal-700/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold font-mono text-amber-400">{item.borehole_id}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-200">{item.field_name}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-100 bg-coal-900/60 rounded px-2">{item.extracted_value}</td>
                    <td className="py-3.5 px-3">
                      <span className={`font-mono text-xs font-bold ${item.confidence_score < 75 ? 'text-red-400' : 'text-amber-400'}`}>
                        {item.confidence_score}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {item.anomaly_type || 'Outlier Flagged'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(item.id, 'Approve')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => { setEditingItem(item); setEditedVal(item.extracted_value); }}
                          className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleAction(item.id, 'Reject')}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-coal-800 border border-coal-700 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              <span>Engineer Edit — {editingItem.borehole_id}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Field Name</label>
                <input type="text" disabled value={editingItem.field_name} className="mt-1 w-full bg-coal-900 text-slate-300 border border-coal-700 rounded p-2 font-mono" />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Original Extracted Value</label>
                <input type="text" disabled value={editingItem.extracted_value} className="mt-1 w-full bg-coal-900 text-slate-400 border border-coal-700 rounded p-2 font-mono" />
              </div>

              <div>
                <label className="text-amber-400 font-semibold">Corrected Engineer Value</label>
                <input 
                  type="text" 
                  value={editedVal} 
                  onChange={(e) => setEditedVal(e.target.value)} 
                  className="mt-1 w-full bg-coal-900 text-slate-100 border border-amber-500 rounded p-2 font-mono focus:outline-none" 
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Engineer Justification / Notes</label>
                <textarea 
                  value={engineerNotes} 
                  onChange={(e) => setEngineerNotes(e.target.value)} 
                  placeholder="e.g. Corrected seam thickness from physical laboratory core box measurement."
                  className="mt-1 w-full bg-coal-900 text-slate-200 border border-coal-700 rounded p-2 h-20 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-coal-700 text-slate-300 rounded text-xs">Cancel</button>
              <button 
                onClick={() => handleAction(editingItem.id, 'Edit', editedVal)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-coal-900 font-semibold rounded text-xs shadow"
              >
                Save & Train Feedback Loop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQueueTable;
