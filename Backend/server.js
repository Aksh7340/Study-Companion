import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Study Companion Backend Running");
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});