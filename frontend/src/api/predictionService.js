import api from './client';
import { mockPredictionResult, mockHealthyResult, mockHistory, mockModelInfo } from './mockData';

const USE_MOCK = false; // flip to false when backend is available

export async function predictDisease(formData) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 3000));
    const glucose = formData.Glucose || 0;
    return glucose > 120 ? mockPredictionResult : mockHealthyResult;
  }
  const { data } = await api.post('/predict', formData);
  return data;
}

export async function getHistory() {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 800));
    return mockHistory;
  }
  const { data } = await api.get('/history');
  return data;
}

export async function getModelInfo() {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return mockModelInfo;
  }
  const { data } = await api.get('/model-info');
  return data;
}

export async function getReports() {
  const { data } = await api.get('/reports');
  return data;
}
