import React, { useState } from 'react';
import { FileText, Languages, Download, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { generateReport } from '../../services/api';

const ReportForm = ({ onReportGenerated }) => {
  const [reportTitle, setReportTitle] = useState('Geological Report on Exploration of Talcher Central Block');
  const [blockName, setBlockName] = useState('Talcher Central Block');
  const [language, setLanguage] = useState('EN'); // EN or HI
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const payload = {
        report_title: reportTitle,
        report_type: 'Geological Report',
        block_name: blockName,
        language: language,
        author_name: 'Dr. S. N. Pattanaik (Chief Geologist)',
        user_role: 'Management'
      };

      setTimeout(async () => {
        const res = await generateReport(payload);
        setReportData(res);
        setIsGenerating(false);
        if (onReportGenerated) onReportGenerated(res);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>CMPDI Automated Geological Report Builder</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Synthesizes validated borehole logs, seam correlations, and ML reserve estimations into a standard CMPDI/CIL report with grounded inline citations.
          </p>
        </div>

        {/* Language Toggle Button */}
        <div className="flex items-center gap-2 bg-coal-900 border border-coal-700 p-1.5 rounded-lg">
          <Languages className="w-4 h-4 text-amber-500 ml-2" />
          <span className="text-xs text-slate-300 font-semibold">Language Output:</span>
          <button
            type="button"
            onClick={() => setLanguage('EN')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              language === 'EN' ? 'bg-amber-500 text-coal-900 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('HI')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              language === 'HI' ? 'bg-amber-500 text-coal-900 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Form Controls */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-6 shadow-lg space-y-4">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-300">Report Document Title</label>
            <input 
              type="text" 
              value={reportTitle} 
              onChange={(e) => setReportTitle(e.target.value)} 
              className="mt-1 w-full bg-coal-900 text-slate-100 border border-coal-700 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">Target Mining Block</label>
            <select 
              value={blockName} 
              onChange={(e) => setBlockName(e.target.value)}
              className="mt-1 w-full bg-coal-900 text-slate-100 border border-coal-700 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="Talcher Central Block">Talcher Central Block</option>
              <option value="Talcher West Block-A">Talcher West Block-A</option>
              <option value="Talcher East Block-B">Talcher East Block-B</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">Report Format Template</label>
            <input 
              type="text" 
              disabled 
              value="CMPDI Geological Report (GR Standard 2026)" 
              className="mt-1 w-full bg-coal-900 text-amber-400 border border-coal-700 rounded-lg p-2.5 text-sm font-mono" 
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="bg-amber-500 hover:bg-amber-600 text-coal-900 font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Grounded LLM Narrative...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-Fill & Build Geological Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Report Preview Section */}
      {reportData && (
        <div className="bg-coal-800 border border-coal-700 rounded-xl p-6 shadow-xl space-y-6">
          {/* Download Action Toolbar */}
          <div className="flex items-center justify-between border-b border-coal-700 pb-4">
            <div>
              <span className="text-xs text-amber-400 font-mono uppercase tracking-wider font-bold">Report Status: Approved & Grounded</span>
              <h3 className="text-lg font-bold text-slate-100">{reportData.report_title}</h3>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/api/reports/${reportData.id}/export/pdf`}
                download
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>

              <a
                href={`/api/reports/${reportData.id}/export/docx`}
                download
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download DOCX</span>
              </a>
            </div>
          </div>

          {/* Document Content View */}
          <div className="bg-coal-900 border border-coal-700 rounded-xl p-8 space-y-6 max-h-[500px] overflow-y-auto font-sans leading-relaxed">
            <div className="text-center border-b border-coal-800 pb-4">
              <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">
                {language === 'HI' ? 'सेंट्रल माइन प्लानिंग एंड डिजाइन इंस्टीट्यूट (CMPDI)' : 'CENTRAL MINE PLANNING & DESIGN INSTITUTE (CMPDI)'}
              </h2>
              <p className="text-sm font-bold text-amber-500 mt-1">{reportData.report_title}</p>
              <p className="text-xs text-slate-400 mt-0.5">BLOCK: {reportData.block_name.toUpperCase()} | REGION: TALCHER COALFIELD</p>
            </div>

            {reportData.sections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-sm font-bold text-amber-400 border-b border-coal-800 pb-1">{sec.section_title}</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{sec.content}</p>
                {sec.citations && sec.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sec.citations.map((cit, cIdx) => (
                      <span key={cIdx} className="text-[10px] font-mono bg-coal-800 text-amber-300 px-2 py-0.5 rounded border border-coal-700">
                        Citation: {cit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
