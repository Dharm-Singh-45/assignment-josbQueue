import express from 'express';
import { fetchImportLogs } from '../controller/importLogController.js';


const router = express.Router();

router.get('/fetch-logs', fetchImportLogs);

export default router;
