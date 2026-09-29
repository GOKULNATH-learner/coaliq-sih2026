import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBoreholes = async (block, status) => {
  const res = await api.get('/boreholes', { params: { block, status } });
  return res.data;
};

export const getDashboardKpis = async () => {
  const res = await api.get('/boreholes/summary/kpis');
  return res.data;
};

export const getBoreholeById = async (boreholeId) => {
  const res = await api.get(`/boreholes/${boreholeId}`);
  return res.data;
};

export const uploadDataFile = async (formData) => {
  const res = await api.post('/ingestion/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getExtractedDocuments = async () => {
  const res = await api.get('/extraction/documents');
  return res.data;
};

export const getReserveEstimation = async (blockName) => {
  const res = await api.get('/insights/reserve-estimation', { params: { block_name: blockName } });
  return res.data;
};

export const getSeamCorrelation = async (boreholeIds) => {
  const res = await api.get('/insights/seam-correlation', { params: { borehole_ids: boreholeIds } });
  return res.data;
};

export const getReviewQueue = async (status = 'Pending') => {
  const res = await api.get('/review/queue', { params: { status } });
  return res.data;
};

export const submitReviewAction = async (itemId, actionData) => {
  const res = await api.post(`/review/queue/${itemId}/action`, actionData);
  return res.data;
};

export const generateReport = async (reportData) => {
  const res = await api.post('/reports/generate', reportData);
  return res.data;
};

export const getAuditLogs = async () => {
  const res = await api.get('/audit/logs');
  return res.data;
};

export const getRoles = async () => {
  const res = await api.get('/auth/roles');
  return res.data;
};

export default api;
