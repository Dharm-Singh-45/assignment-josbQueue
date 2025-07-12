// scripts/clearRepeatJobs.js
import jobQueue from '../queues/jobQueue.js';

const clearRepeatableJobs = async () => {
  const jobs = await jobQueue.getRepeatableJobs();
  for (const job of jobs) {
    await jobQueue.removeRepeatableByKey(job.key);
    console.log(`❌ Removed old repeatable job: ${job.key}`);
  }
  process.exit(0);
};

clearRepeatableJobs();
