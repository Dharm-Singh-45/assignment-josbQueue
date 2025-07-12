import jobQueue from './jobQueue.js';
import { fetchAndStoreJobs } from '../utils/jobFetcher.js';

// Process different types of jobs
jobQueue.process('fetch-jobs', async (job) => {
  console.log('🔄 Processing fetch-jobs:', job.data);
  
  try {
    const { category } = job.data;
    const result = await fetchAndStoreJobs(category);
    
    console.log('✅ Job fetch completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Job fetch failed:', error.message);
    throw error;
  }
});

jobQueue.process('fetch-all-jobs', async (job) => {
  console.log('🔄 Processing fetch-all-jobs:', job.data);
  
  try {
    const result = await fetchAndStoreJobs();
    
    console.log('✅ All jobs fetch completed:', result);
    return result;
  } catch (error) {
    console.error('❌ All jobs fetch failed:', error.message);
    throw error;
  }
});

// Generic job processor for other tasks
jobQueue.process('generic', async (job) => {
  console.log('🔄 Processing generic job:', job.data);
  
  // Example: simulate work
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  console.log('✅ Generic job completed!');
  return { status: 'completed', data: job.data };
});

// Error handling for failed jobs
jobQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

jobQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed successfully:`, result);
});

console.log('🚀 Job processor started and listening for jobs...'); 