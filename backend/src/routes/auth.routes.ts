import express from "express";
import { login, signup, refresh, handleWebhook, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/refresh", refresh);
router.post("/webhook", handleWebhook);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
