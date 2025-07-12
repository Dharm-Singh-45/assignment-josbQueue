export interface FailedJob {
  jobId: string;
  reason: string;
}

export interface ImportLog {
  _id: string;
  timestamp: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: FailedJob[];
  createdAt: string;
  updatedAt: string;
  successRate?: string;
  failureRate?: string;
  formattedTimestamp?: string;
} 