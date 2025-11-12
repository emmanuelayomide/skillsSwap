import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/verifyToken.js';

const prisma = new PrismaClient();

router.post("/track-activity", async (req, res) => {
    try {
        const { userId, timestamp } = req.body;

        if (!userId || !timestamp) {
            return res.status(400).json({ message: 'Missing userId or timestamp' });
        }
        
        const heartbeatTime = new Date(timestamp);

        await prisma.activityLog.create({
            data: {
                userId: parseInt(userId),
                heartbeatTime: heartbeatTime,
            },
        });

        res.status(200).json({ message: 'Heartbeat received and recorded' });
    } catch (error) {
        console.error('Error saving heartbeat:', error);
        res.status(500).json({ message: 'Internal server error while recording activity' });
    }
});


// getting users Analysis ..........




export default router;