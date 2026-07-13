import axios from 'axios';
import { env } from '../config/env';
import { AppError } from '../utils/errorHandler';

const apiClient = axios.create({
  baseURL: env.ML_SERVICE_URL,
  timeout: 5000,
});

export const mlService = {
  async getHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new AppError('ML Service is unavailable', 503);
    }
  },

  async predict(features: Record<string, number>) {
    try {
      const response = await apiClient.post('/predict', features);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new AppError(error.response.data.detail || 'Error from ML Service', error.response.status);
      }
      throw new AppError('Failed to communicate with ML Service', 503);
    }
  }
};
