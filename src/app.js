import express from 'express';
import cors from 'cors';
import postsRoutes from './routes/posts.routes.js';
import authRoutes from './routes/auth.routes.js';
import professorsRoutes from './routes/professors.routes.js';
import studentsRoutes from './routes/students.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/professors', professorsRoutes);
app.use('/students', studentsRoutes);
app.use(errorHandler);

export default app;
