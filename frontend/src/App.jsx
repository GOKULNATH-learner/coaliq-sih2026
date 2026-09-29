import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import KpiCards from './components/Dashboard/KpiCards';
import TalcherMap from './components/Dashboard/TalcherMap';
import EffortChart from './components/Dashboard/EffortChart';
import FileUploader from './components/Ingestion/FileUploader';
import ExtractedFieldsTable from './components/Extraction/ExtractedFieldsTable';
import StripLogViewer from './components/Insights/StripLogViewer';
import SeamCorrelationChart from './components/Insights/SeamCorrelationChart';
import ReserveEstimationCard from './components/Insights/ReserveEstimationCard';
import ReviewQueueTable from './components/Review/ReviewQueueTable';
import ReportForm from './components/Report/ReportForm';
import AuditLogTable from './components/Audit/AuditLogTable';

import { getBoreholes, getDashboardKpis, getBoreholeById } from './services/api';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [boreholes, setBoreholes] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [selectedBorehole, setSelectedBorehole] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const bhList = await getBoreholes();
      setBoreholes(bhList);

      const kpiData = await getDashboardKpis();
      setKpis(kpiData);

      if (bhList && bhList.length > 0) {
        const fullBh = await getBoreholeById(bhList[0].borehole_id);
        setSelectedBorehole(fullBh);
      }
    } catch (err) {
      console.error('API connection error:', err);
    }
  };

  const handleSelectBorehole = async (bhId) => {
    try {
      const bh = await getBoreholeById(bhId);
      setSelectedBorehole(bh);
      setActiveTab('insights');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-coal-900 text-slate-100 flex flex-col font-['Outfit',sans-serif]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <KpiCards kpis={kpis} />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <TalcherMap boreholes={boreholes} onSelectBorehole={handleSelectBorehole} />
                </div>
                <div className="lg:col-span-5">
                  <EffortChart />
                </div>
              </div>
            </div>
          )}

          {/* Data Ingestion Tab */}
          {activeTab === 'ingestion' && (
            <FileUploader onUploadSuccess={() => fetchInitialData()} />
          )}

          {/* AI Extraction View Tab */}
          {activeTab === 'extraction' && (
            <ExtractedFieldsTable />
          )}

          {/* Seam & Grade Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <ReserveEstimationCard />
              <SeamCorrelationChart />
              {selectedBorehole && <StripLogViewer borehole={selectedBorehole} />}
            </div>
          )}

          {/* Human Review Queue Tab */}
          {activeTab === 'review' && (
            <ReviewQueueTable />
          )}

          {/* Report Builder Tab */}
          {activeTab === 'report' && (
            <ReportForm />
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <AuditLogTable />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
