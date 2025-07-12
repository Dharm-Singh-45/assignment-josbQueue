import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    totalFetched: {
      type: Number,
      required: true,
    },
    totalImported: {
      type: Number,
      required: true,
    },
    newJobs: {
      type: Number,
      required: true,
    },
    updatedJobs: {
      type: Number,
      required: true,
    },
    failedJobs: [
      {
        jobId: { type: String, default: '' },
        reason: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const ImportLog = mongoose.model('ImportLog', importLogSchema);
export default ImportLog;
