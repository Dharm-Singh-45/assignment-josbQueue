import express from 'express';
import cors from 'cors';
import connectDB from './connectDb.js';


import './queues/jobProcessor.js'; 

import dotenv from 'dotenv';
import scheduleFetchJobs from './utils/cronScheduler.js';
import ImportLog from './models/ImportLog.js';



dotenv.config({ path: './config.env' })

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 




// app.get('/api/fetch-jobs', async (req, res) => {
//   try {
//     const result = await fetchAndStoreJobs();
//     res.json({
//       success: true,
//       message: 'Jobs fetched and stored successfully',
//       result
//     });
//   } catch (error) {
//     console.error('Error fetching jobs:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching jobs',
//       error: error.message
//     });
//   }
// });

app.get("/api/fetch-logs",async(req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      ImportLog.find()
        .sort({ timestamp: -1 }) // Sort by timestamp descending (newest first)
        .skip(skip)
        .limit(limit)
        .lean(),
      ImportLog.countDocuments()
    ]);

    res.status(200).json({
      message:"successfully fetch logs",
      result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.log("error in fetching logs",error.message)
    res.status(500).json({
      message: "Error fetching logs",
      error: error.message
    })
  }
})


// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
    await scheduleFetchJobs(); 
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 