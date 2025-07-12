import Queue from 'bull';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};

// For Redis Cloud, try without TLS first
if (process.env.REDIS_HOST && process.env.REDIS_HOST.includes('redis-cloud')) {
  // Try without TLS for Redis Cloud
  console.log('🔧 Using Redis Cloud configuration without TLS');
} else if (process.env.REDIS_HOST && process.env.REDIS_HOST.includes('redis')) {
  // For other cloud Redis services
  redisConfig.tls = {
    rejectUnauthorized: false,
    servername: process.env.REDIS_HOST
  };
  console.log('🔧 Using Redis Cloud configuration with TLS');
} else {
  console.log('🔧 Using local Redis configuration');
}

const jobQueue = new Queue('job-queue', {
  redis: redisConfig
});

jobQueue.on('ready', () => {
  console.log('✅ Redis connection established (Bull queue is ready)');
});

jobQueue.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export default jobQueue;
