import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      default: '',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    encoded: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      required: true,
    },
    guid: {
      type: String,
      required: true,
    },
    pubDate: {
      type: Date,
      required: true,
    },
    content: {
      url: {
        type: String,
        default: '',
      },
      medium: {
        type: String,
        default: '',
      },
    },
    jobType: {
      type: String,
      default: '',
      index: true,
    },
    category: {
      type: String,
      default: 'general',
    },
    region: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// 🔍 Indexes for performance & search
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ pubDate: -1 });
jobSchema.index({ company: 1, jobType: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
