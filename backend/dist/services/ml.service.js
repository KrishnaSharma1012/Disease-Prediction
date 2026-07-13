"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const errorHandler_1 = require("../utils/errorHandler");
const apiClient = axios_1.default.create({
    baseURL: env_1.env.ML_SERVICE_URL,
    timeout: 5000,
});
exports.mlService = {
    async getHealth() {
        try {
            const response = await apiClient.get('/health');
            return response.data;
        }
        catch (error) {
            throw new errorHandler_1.AppError('ML Service is unavailable', 503);
        }
    },
    async predict(features) {
        try {
            const response = await apiClient.post('/predict', features);
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new errorHandler_1.AppError(error.response.data.detail || 'Error from ML Service', error.response.status);
            }
            throw new errorHandler_1.AppError('Failed to communicate with ML Service', 503);
        }
    }
};
