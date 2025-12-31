import type {} from './types/express';
import express, { Request, Response } from 'express'
import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import { yearRoutes } from './routes/YearRoutes';
import { teacherRoutes } from './routes/TeacherRoutes';
import { studentRoutes } from './routes/StudentRoutes';
import "dotenv/config";
import { authRoutes } from './routes/AuthRoutes';

const server = express();

server.use(express.json());

server.use("/api", yearRoutes);
server.use("/api", teacherRoutes);
server.use("/api", studentRoutes);
server.use("/api", authRoutes);

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

server.listen(3333, () => console.log('Server is running on http://localhost:3333'));