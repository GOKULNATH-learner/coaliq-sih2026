import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Cpu } from 'lucide-react';
import { uploadDataFile } from '../../services/api';

const FileUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('engineer_name', 'Er. R. K. Sharma');
    formData.append('user_role', 'Engineer');

    try {
      // Simulate pipeline delay for visual demo polish
      setTimeout(async () => {
        const res = await uploadDataFile(formData);
        setPipelineResult(res);
        setIsProcessing(false);
        if (onUploadSuccess) onUploadSuccess(res);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const loadSampleFile = (fileName, sampleType) => {
    const mockFile = new File(["sample content"], fileName, { type: sampleType });
    setFile(mockFile);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-amber-500" />
          <span>Multimodal Geological Data Ingestion Pipeline</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload raw field data formats (scanned PDF logs, CSV survey sheets, LAS geophysical logs). Automatic range validation & AI OCR extraction will be performed.
        </p>
      </div>

      {/* Upload Zone & Prebaked Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-coal-800 border border-coal-700 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
              file ? 'border-amber-500 bg-amber-500/5' : 'border-coal-600 hover:border-amber-500/60 bg-coal-900/50'
            }`}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input 
              id="file-input" 
              type="file" 
              className="hidden" 
              accept=".pdf,.csv,.las,.png,.jpg" 
              onChange={handleFileChange} 
            />

            <UploadCloud className={`w-12 h-12 mb-3 ${file ? 'text-amber-500' : 'text-slate-500'}`} />
            
            {file ? (
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB — Ready to process</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">Drag & drop borehole logs, LAS files, CSV sheets, or PDF scans</p>
                <p className="text-xs text-slate-500">Supports PDF, CSV, LAS, TIFF, PNG, JPG</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {file ? `Selected file: ${file.name}` : 'No file selected yet'}
            </span>
            <button
              disabled={!file || isProcessing}
              onClick={handleUpload}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                file && !isProcessing 
                  ? 'bg-amber-500 hover:bg-amber-600 text-coal-900 shadow-md' 
                  : 'bg-coal-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-coal-900" />
                  <span>Processing Pipeline...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Run Ingest & Validate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Load Synthetic Sample Files</h3>
          <p className="text-xs text-slate-400">Select pre-seeded field files from <code className="text-amber-400">/sample_data</code> to test extraction pipeline:</p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => loadSampleFile('sample_scan_log_1.pdf', 'application/pdf')}
              className="w-full text-left p-3 rounded-lg border border-coal-700 bg-coal-900/80 hover:border-amber-500/50 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-400" />
                <div>
                  <p className="font-semibold text-slate-200">sample_scan_log_1.pdf</p>
                  <p className="text-[10px] text-slate-400">CMPDI Field Log (PDF Scan)</p>
                </div>
              </div>
              <span className="text-[10px] bg-coal-800 text-amber-400 px-2 py-0.5 rounded border border-coal-700">Load</span>
            </button>

            <button
              onClick={() => loadSampleFile('sample_las_log_BH14.las', 'text/plain')}
              className="w-full text-left p-3 rounded-lg border border-coal-700 bg-coal-900/80 hover:border-amber-500/50 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-semibold text-slate-200">sample_las_log_BH14.las</p>
                  <p className="text-[10px] text-slate-400">LAS 2.0 Geophysical Log</p>
                </div>
              </div>
              <span className="text-[10px] bg-coal-800 text-amber-400 px-2 py-0.5 rounded border border-coal-700">Load</span>
            </button>

            <button
              onClick={() => loadSampleFile('sample_survey_sheet.csv', 'text/csv')}
              className="w-full text-left p-3 rounded-lg border border-coal-700 bg-coal-900/80 hover:border-amber-500/50 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-slate-200">sample_survey_sheet.csv</p>
                  <p className="text-[10px] text-slate-400">Survey Coordinates & Quality</p>
                </div>
              </div>
              <span className="text-[10px] bg-coal-800 text-amber-400 px-2 py-0.5 rounded border border-coal-700">Load</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Pipeline Status & Validation Warnings */}
      {pipelineResult && (
        <div className="bg-coal-800 border border-coal-700 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-coal-700 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Ingestion Pipeline Summary — {pipelineResult.filename}</span>
            </h3>
            <span className="text-xs bg-coal-900 text-slate-300 px-3 py-1 rounded-full border border-coal-700">
              Format: {pipelineResult.file_type}
            </span>
          </div>

          {/* Pipeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pipelineResult.pipeline_stages.map((stg, i) => (
              <div key={i} className="bg-coal-900 border border-coal-700 p-3.5 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Stage {i+1}</p>
                  <p className="text-sm font-bold text-slate-200">{stg.stage}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stg.status.includes('Completed') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {stg.status}
                </span>
              </div>
            ))}
          </div>

          {/* Validation Warnings */}
          {pipelineResult.validation_warnings && pipelineResult.validation_warnings.length > 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Geological Validation Warnings ({pipelineResult.validation_warnings.length} Flagged)</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {pipelineResult.validation_warnings.map((w, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-coal-900/60 p-2 rounded border border-amber-500/20">
                    <span className="font-semibold text-amber-400 shrink-0">[{w.type}]</span>
                    <span>{w.message} (Field: <code className="text-slate-200">{w.field}</code>)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>All unit checks and range validation rules passed with zero warnings.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
