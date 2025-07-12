import express from 'express';
import cors from 'cors';
import connectDB from './connectDb.js';


import './queues/jobProcessor.js'; 

import dotenv from 'dotenv';
import scheduleFetchJobs from './utils/cronScheduler.js';
import LogsRouter from './routes/importLogs.js'



dotenv.config({ path: './config.env' })

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 


// route 

app.use('/api',LogsRouter) 




// Start server
const startServer = async () => {
  try {
    
    await connectDB();
    
 
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
    await scheduleFetchJobs(); 
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 