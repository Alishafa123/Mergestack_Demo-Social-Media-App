import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.use(errorHandler);

export default app;
