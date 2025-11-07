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
      where: { id: req.user.id },
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

export default router;
