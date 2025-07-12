import axios from "axios";
import xml2js from "xml2js";
import Job from "../models/Job.js";

// Parse XML to JSON
const parseXMLToJSON = async (xmlData) => {
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: false,
    tagNameProcessors: [xml2js.processors.stripPrefix], // ✅ key fix
  });
  return await parser.parseStringPromise(xmlData);
};

// ✅ Transform function
const transformJobData = (item) => {
  const jobData = {
  jobId: item.id || "",
  title: item.title || "",
  link: item.link || "",
  pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
  guid:
    item.guid && typeof item.guid === "object"
      ? item.guid._ || ""
      : item.guid || "",
  description: item.description || "",
  encoded: item.encoded?._cdata || item.encoded || "",
  content: {
    url: item.content?._url || "",
    medium: item.content?._medium || "",
  },
  location: item.location?._cdata || item.location || "",
  jobType: item.job_type?._cdata || item.job_type || "",
  company: item.company?._cdata || item.company || "",
  };

  return jobData;
};

// ✅ Fetch XML from Jobicy
// const fetchJobsFromAPI = async () => {
//   const url = "https://jobicy.com/?feed=job_feed";
//   console.log(`📡 Fetching jobs from: ${url}`);
//   const response = await axios.get(url, { timeout: 30000 });
//   return response.data;
// };
const fetchJobsFromAPI = async (feedUrl) => {
  const response = await axios.get(feedUrl, { timeout: 30000 });
  return response.data;
};

// Process and store jobs
const processAndStoreJobs = async (jsonData, feedUrl) => {
  const items = jsonData.rss?.channel?.item;
  const itemsArray = Array.isArray(items) ? items : [items];

  if (!itemsArray || itemsArray.length === 0) {
    return { processed: 0, created: 0, updated: 0, failedJobs: [] };
  }

  let created = 0,
    updated = 0,
    processed = 0;
  const failedJobs = [];

  for (const item of itemsArray) {
    try {
      const jobData = transformJobData(item);

      if (!jobData.jobId || !jobData.title || !jobData.company) {
        failedJobs.push({
          jobId: jobData.jobId || "N/A",
          reason: "Missing required fields",
        });
        continue;
      }

      const result = await Job.findOneAndUpdate(
        { jobId: jobData.jobId },
        jobData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }

      processed++;
    } catch (err) {
      failedJobs.push({
        jobId: item.id || "unknown",
        reason: err.message,
      });
    }
  }

  return { processed, created, updated, failedJobs };
};

// Entry point
const fetchAndStoreJobs = async (feedUrl) => {
  try {
    const xmlData = await fetchJobsFromAPI(feedUrl);
    const jsonData = await parseXMLToJSON(xmlData);
    return await processAndStoreJobs(jsonData, feedUrl);
  } catch (err) {
    return { error: err.message };
  }
};

export { fetchAndStoreJobs };
