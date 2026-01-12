import type { } from "./types/express";
import express from "express";
import "reflect-metadata";
import "dotenv/config";
import cors from "cors";

import { AppDataSource } from "./database/data-source";
import "./config/env";

import { yearRoutes } from "./routes/year.routes";
import { teacherRoutes } from "./routes/teacher.routes";
import { studentRoutes } from "./routes/student.routes";
import { authRoutes } from "./routes/auth.routes";
import { quizRoutes } from "./routes/quizzes/quiz.routes";
import { studentQuizRoutes } from "./routes/quizzes/studentQuiz.routes";
import { quizAttemptRoutes } from "./routes/quizzes/quizAttempt.routes";


const server = express();

server.use(cors({
    origin: [
        "https://aqualab-frontend.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
}));

server.use(express.json());

server.use("/api", yearRoutes);
server.use("/api", teacherRoutes);
server.use("/api", studentRoutes);
server.use("/api", authRoutes);
server.use("/api", quizRoutes);
server.use("/api", studentQuizRoutes);
server.use("/api", quizAttemptRoutes);

server.get("/", (_, res) => {
    res.json({ message: "Aqualab Backend is running" });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        server.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    });
