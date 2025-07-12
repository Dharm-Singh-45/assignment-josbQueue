import Queue from 'bull';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' })

const jobQueue = new Queue('job-queue', {
  redis: {
    host: process.env.REDIS_HOST, // ✅ Redis Cloud host
    port: parseInt(process.env.REDIS_PORT), // ✅ Redis Cloud port
    password: process.env.REDIS_PASSWORD, // ✅ Redis Cloud password
    tls: {} // ✅ TLS is required for Redis Cloud
  }
});

export default jobQueue;
