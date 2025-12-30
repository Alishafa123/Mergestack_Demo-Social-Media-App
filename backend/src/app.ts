import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import authRoutes from '@routes/auth.routes';
import postRoutes from '@routes/post.routes';
import userRoutes from '@routes/user.routes';
import shareRoutes from '@routes/share.routes';
import profileRoutes from '@routes/profile.routes';
import commentRoutes from '@routes/comment.routes';
import errorHandler from '@middleware/error.middleware';
import { ensureDBConnection } from '@middleware/db.middleware';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection for all API routes
app.use('/api', ensureDBConnection);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes);
app.use('/api', shareRoutes);

app.get('/test', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.use(errorHandler);

export default app;
