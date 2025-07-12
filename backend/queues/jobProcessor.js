import jobQueue from './jobQueue.js';
import { fetchAndStoreJobs } from '../utils/jobFetcher.js';
import { fetchAllFeeds } from '../utils/fetchAllFeeds.js';

// Process individual job fetch
jobQueue.process('fetch-jobs', async (job) => {
  try {
    const { category } = job.data;
    const result = await fetchAndStoreJobs(category);
    return result;
  } catch (error) {
    throw error;
  }
});

// Process all job feeds
jobQueue.process('fetch-all-jobs', async (job) => {
  try {
    const result = await fetchAllFeeds();
    return result;
  } catch (error) {
    throw error;
  }
});

// Generic job handler
jobQueue.process('generic', async (job) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { status: 'completed', data: job.data };
});

// Error handling for failed jobs
jobQueue.on('failed', (job, err) => {
  console.error(` Job ${job.id} failed:`, err.message);
});

jobQueue.on('completed', (job, result) => {
  console.log(` Job ${job.id} completed successfully:`, result);
});

console.log('🚀 Job processor started and listening for jobs...'); 