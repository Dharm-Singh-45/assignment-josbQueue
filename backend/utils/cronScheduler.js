import jobQueue from "../queues/jobQueue.js";

const scheduleFetchJobs = async () => {
  const repeatableJobs = await jobQueue.getRepeatableJobs();
  const alreadyScheduled = repeatableJobs.find(job => job.id === 'fetch-jobs-cron');

  if (alreadyScheduled) {
    console.log('⏰ Cron job already scheduled. Skipping duplicate setup.');
    return;
  }

  await jobQueue.add(
    'fetch-all-jobs',
    {},
    {
      jobId: 'fetch-jobs-cron',
      repeat: { cron: '*/5 * * * *' },
      removeOnComplete: true,
      removeOnFail: true
    }
  );

  console.log('⏰ Cron job scheduled to fetch jobs every 15 minutes');
};

export default scheduleFetchJobs;
