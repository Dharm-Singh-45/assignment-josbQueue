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
  // Get paginated import logs
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
  },

  // Get all import logs (for statistics)
  getAll: async (): Promise<ImportLog[]> => {
    const response = await api.get('/fetch-logs?limit=1000'); // Get all for stats
    return response.data.result;
  },

  // Get import statistics
  getStats: async (): Promise<{
    totalImports: number;
    totalJobsImported: number;
    averageSuccessRate: number;
    lastImportDate: string | null;
  }> => {
    const response = await api.get('/fetch-logs?limit=1000'); // Get all for stats
    const logs = response.data.result;
    
    const totalImports = response.data.pagination.total;
    const totalJobsImported = logs.reduce((sum: number, log: ImportLog) => sum + log.totalImported, 0);
    const averageSuccessRate = logs.length > 0 
      ? logs.reduce((sum: number, log: ImportLog) => sum + (log.totalImported / Math.max(log.totalFetched, 1) * 100), 0) / logs.length
      : 0;
    const lastImportDate = logs.length > 0 ? logs[0].timestamp : null; // logs[0] is now the newest due to backend sorting
    
    return {
      totalImports,
      totalJobsImported,
      averageSuccessRate,
      lastImportDate
    };
  },
};

export default api; 