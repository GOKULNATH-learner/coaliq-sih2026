import React, { useState, useEffect } from 'react';
import { FileSearch, AlertCircle, CheckCircle, ExternalLink, ShieldAlert, ArrowRight } from 'lucide-react';
import { getExtractedDocuments } from '../../services/api';

const ExtractedFieldsTable = () => {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExtractedDoc();
  }, []);

  const fetchExtractedDoc = async () => {
    try {
      const docs = await getExtractedDocuments();
      if (docs && docs.length > 0) {
        setDoc(docs[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 bg-coal-800 rounded-xl border border-coal-700">
        Loading AI Extraction View...
      </div>
    );
  }

  const fields = doc?.fields || [];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-amber-500" />
            <span>AI Extraction & Multimodal Field Parser</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Side-by-side source document scan & structured extracted fields with per-field confidence scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 bg-coal-900 px-3 py-1.5 rounded-lg border border-coal-700 font-mono">
            Source: <strong className="text-amber-400">{doc?.filename || 'sample_scan_log_1.pdf'}</strong>
          </span>
        </div>
      </div>

      {/* Side-by-Side View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Source Document Simulation */}
        <div className="lg:col-span-5 bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-coal-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Source Document Scan</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">OCR Highlighted</span>
            </div>

            {/* Document Bounding Box Simulation */}
            <div className="bg-coal-900 border border-coal-700 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-3 leading-relaxed relative">
              <div className="text-center font-bold text-slate-100 border-b border-coal-800 pb-2">
                CENTRAL MINE PLANNING & DESIGN INSTITUTE
                <br />
                <span className="text-amber-500 font-normal">GEOLOGICAL BOREHOLE FIELD LOG</span>
              </div>

              <div className="p-2 border border-emerald-500/40 bg-emerald-500/5 rounded">
                <strong>Borehole ID:</strong> BH-TAL-04 &nbsp;|&nbsp; <strong>Block:</strong> Talcher Central
              </div>

              <div className="p-2 border border-emerald-500/40 bg-emerald-500/5 rounded">
                <strong>Latitude:</strong> 20.9575 N &nbsp;|&nbsp; <strong>Longitude:</strong> 85.1445 E
              </div>

              <div className="p-2 border border-red-500/60 bg-red-500/10 rounded">
                <strong>Seam I (Bottom Main):</strong> Top: 132.0m | Bottom: 152.5m | <span className="text-red-400 font-bold">Thick: 20.50m (Outlier Flagged)</span>
              </div>

              <div className="p-2 border border-amber-500/40 bg-amber-500/10 rounded">
                <strong>Logged By:</strong> Er. R. K. Sharma <span className="text-amber-400 text-[10px]">(Confidence: 64%)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-coal-900/60 border border-coal-700 text-xs text-slate-400 flex items-center justify-between">
            <span>OCR Engine: pytesseract / pdfplumber fallback</span>
            <span className="text-emerald-400 font-semibold">100% Parsed</span>
          </div>
        </div>

        {/* Right Side: Extracted Structured Fields Table */}
        <div className="lg:col-span-7 bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-coal-700 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Extracted Structured Fields</h3>
            <span className="text-xs text-slate-400">{fields.length} Fields Extracted</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-coal-700 text-slate-400 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Field Name</th>
                  <th className="py-2.5 px-3">Extracted Value</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coal-700/60">
                {fields.map((f, idx) => {
                  const isLowConf = f.confidence_score < 80.0;
                  const isFlagged = f.is_flagged || isLowConf;

                  return (
                    <tr key={idx} className={`hover:bg-coal-700/40 transition-colors ${isFlagged ? 'bg-red-500/5' : ''}`}>
                      <td className="py-3 px-3 font-semibold text-slate-200">{f.field_name}</td>
                      <td className="py-3 px-3 font-mono text-slate-100">{f.field_value}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-coal-900 rounded-full overflow-hidden border border-coal-700">
                            <div 
                              className={`h-full ${isLowConf ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${f.confidence_score}%` }} 
                            />
                          </div>
                          <span className={`font-mono text-[11px] ${isLowConf ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                            {f.confidence_score}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {isFlagged ? (
                          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            <ShieldAlert className="w-3 h-3" />
                            <span>{f.flag_reason || 'Low Conf (<80%)'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center justify-between">
            <span>Low-confidence (&lt;80%) and flagged anomaly fields are automatically routed to the Engineer Review Queue.</span>
            <button className="text-amber-400 font-bold underline hover:text-amber-300 text-xs flex items-center gap-1">
              <span>Go to Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractedFieldsTable;
