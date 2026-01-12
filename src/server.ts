import type {} from './types/express';
import express, { Request, Response } from 'express'
import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import { yearRoutes } from './routes/year.routes';
import { teacherRoutes } from './routes/teacher.routes';
import { studentRoutes } from './routes/student.routes';
import "dotenv/config";
import { authRoutes } from './routes/auth.routes';
import { quizRoutes } from './routes/quizzes/quiz.routes'
import { studentQuizRoutes } from './routes/quizzes/studentQuiz.routes';
import "./config/env";
import { quizAttemptRoutes } from './routes/quizzes/quizAttempt.routes';
import cors from 'cors';

const server = express();

server.use(cors({
    origin: [
        "https://aqualab-frontend.vercel.app",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
}));

server.use(express.json());

server.use("/api", yearRoutes);
server.use("/api", teacherRoutes);
server.use("/api", studentRoutes);
server.use("/api", authRoutes);
server.use("/api", quizRoutes);
server.use("/api", studentQuizRoutes);
server.use("/api", quizAttemptRoutes);

server.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Aqualab Backend is running' });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

server.listen(process.env.PORT || 3000, () => console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`));
