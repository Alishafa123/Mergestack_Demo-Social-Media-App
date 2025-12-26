import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "@routes/auth.routes.js";
import postRoutes from "@routes/post.routes.js";
import userRoutes from "@routes/user.routes.js";
import shareRoutes from "@routes/share.routes.js";
import profileRoutes from "@routes/profile.routes.js";
import commentRoutes from "@routes/comment.routes.js";
import errorHandler from "@middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentRoutes);
app.use("/api", shareRoutes);

app.get("/", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.use(errorHandler);

export default app;
