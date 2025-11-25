import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import activitesRoutes from "./routes/activitesRoutes.js";


dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running successfully ");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.use("/vi/user", activitesRoutes);
// app.use("api/vi/activity", activitesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

