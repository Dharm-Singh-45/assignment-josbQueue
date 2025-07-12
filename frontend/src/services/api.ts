import axios from 'axios';
import type { ImportLog } from '../types/ImportLog';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const importLogsApi = {
  getPaginated: async (page: number = 1, limit: number = 10): Promise<{
    logs: ImportLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    const response = await api.get(`/fetch-logs?page=${page}&limit=${limit}`);
    return {
      logs: response.data.result,
      pagination: response.data.pagination
    };
  }
};

export default api;
