import express from "express";
import { login, signup, refresh, handleWebhook } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/refresh", refresh);
router.post("/webhook", handleWebhook);

export default router;
