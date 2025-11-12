import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

//  Protected route — only accessible with a valid token
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // req.user contains the decoded info from the token
    const user = await prisma.user.findUnique({
   where:{id:req.user.id},
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile fetched successfully ", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/weekly", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const rawActivityData = await prisma.$queryRaw`
            SELECT
                DATE_TRUNC('day', "heartbeatTime") AS day,
                COUNT(id) AS heartbeat_count
            FROM
                "ActivityLog"
            WHERE
                "userId" = ${userId} AND
                "heartbeatTime" >= ${sevenDaysAgo}
            GROUP BY
                day
            ORDER BY
                day;
        `;

        const weeklyActivity = rawActivityData.map(row => {
            const count = Number(row.heartbeat_count);
            const totalSeconds = count * 30;
            const totalHours = parseFloat((totalSeconds / 3600).toFixed(2));

            return {
                name: new Date(row.day).toLocaleDateString('en-US', { weekday: 'short' }),
                hours: totalHours,
            };
        });
const totalHoursSum = weeklyActivity.reduce((sum, day) => sum + day.hours, 0);
const formattedTotalHours = parseFloat(totalHoursSum.toFixed(1)); 
     
        res.status(200).json({
    dailyData: weeklyActivity,
    totalHours: formattedTotalHours,
});
console.log(weeklyActivity)
    } catch (error) {
        console.error('Error fetching weekly activity:', error);
        res.status(500).json({ message: 'Internal server error while fetching activity data' });
    }
});

export default router;
