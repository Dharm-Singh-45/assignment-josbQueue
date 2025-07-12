import express from 'express';
import { ImportLog } from '../models/index.js';

const router = express.Router();

// Get all import logs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ImportLog.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ImportLog.countDocuments()
    ]);

    res.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching import logs:', error);
    res.status(500).json({ error: 'Failed to fetch import logs' });
  }
});

// Get latest import log
router.get('/latest', async (req, res) => {
  try {
    const latestLog = await ImportLog.findOne()
      .sort({ timestamp: -1 })
      .lean();

    res.json(latestLog);
  } catch (error) {
    console.error('Error fetching latest import log:', error);
    res.status(500).json({ error: 'Failed to fetch latest import log' });
  }
});

// Get import statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalImports, totalJobsImported, averageSuccessRate, lastImportDate] = await Promise.all([
      ImportLog.countDocuments(),
      ImportLog.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$totalImported' }
          }
        }
      ]),
      ImportLog.aggregate([
        {
          $addFields: {
            successRate: {
              $multiply: [
                { $divide: ['$totalImported', { $max: ['$totalFetched', 1] }] },
                100
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgSuccessRate: { $avg: '$successRate' }
          }
        }
      ]),
      ImportLog.findOne().sort({ timestamp: -1 }).select('timestamp')
    ]);

    res.json({
      totalImports,
      totalJobsImported: totalJobsImported[0]?.total || 0,
      averageSuccessRate: averageSuccessRate[0]?.avgSuccessRate || 0,
      lastImportDate: lastImportDate?.timestamp || null
    });
  } catch (error) {
    console.error('Error fetching import stats:', error);
    res.status(500).json({ error: 'Failed to fetch import statistics' });
  }
});

// Get import log by ID
router.get('/:id', async (req, res) => {
  try {
    const log = await ImportLog.findById(req.params.id).lean();
    
    if (!log) {
      return res.status(404).json({ error: 'Import log not found' });
    }

    res.json(log);
  } catch (error) {
    console.error('Error fetching import log:', error);
    res.status(500).json({ error: 'Failed to fetch import log' });
  }
});

export default router; 