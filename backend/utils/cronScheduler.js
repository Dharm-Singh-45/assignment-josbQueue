import jobQueue from "../queues/jobQueue.js";


const scheduleFetchJobs = async () => {
  await jobQueue.add(
    'fetch-all-jobs', 
    {},               
    {
        repeat: { cron: '*/15 * * * *' }, 
      removeOnComplete: true,           
      removeOnFail: true
    }
  );

  console.log('⏰ Cron job scheduled to fetch jobs every 15 minutes');
};

export default scheduleFetchJobs;
