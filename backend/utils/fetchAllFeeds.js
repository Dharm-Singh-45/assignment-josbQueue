import ImportLog from "../models/ImportLog.js";
import { fetchAndStoreJobs } from "./jobFetcher.js";


const jobFeedURLs = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
];

const fetchAllFeeds = async () => {
  let totalFetched = 0;
  let newJobs = 0;
  let updatedJobs = 0;
  let failedJobs = [];

  for (const url of jobFeedURLs) {
    const result = await fetchAndStoreJobs(url);

    if (result && !result.error) {
      totalFetched += result.processed || 0;
      newJobs += result.created || 0;
      updatedJobs += result.updated || 0;
      if (result.failedJobs?.length) {
        failedJobs.push(...result.failedJobs);
      }
    } else {
      console.error(`⚠️ Skipping stats for failed feed: ${url}`);
    }
  }

  // ✅ Save a single ImportLog entry
  await ImportLog.create({
    totalFetched,
    totalImported: newJobs + updatedJobs,
    newJobs,
    updatedJobs,
    failedJobs,
  });

  console.log(`📄 ✅ Combined ImportLog saved`);
};

export { fetchAllFeeds };
