import express from 'express';
import cors from 'cors';
import postsRoutes from './routes/posts.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/posts', postsRoutes);

export default app;
