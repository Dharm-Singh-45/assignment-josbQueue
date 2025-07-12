import express from 'express';
import cors from 'cors';
import connectDB from './connectDb.js';
import { fetchAndStoreJobs } from './utils/jobFetcher.js';

import './queues/jobProcessor.js'; 

import dotenv from 'dotenv';

dotenv.config({ path: './config.env' })

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 




app.get('/api/fetch-jobs', async (req, res) => {
  try {
    const result = await fetchAndStoreJobs();
    res.json({
      success: true,
      message: 'Jobs fetched and stored successfully',
      result
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});




// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 