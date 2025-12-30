import express from 'express';

import { login, signup, refresh, handleWebhook, forgotPassword, resetPassword } from '@controllers/auth.controller';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh', refresh);
router.post('/webhook', handleWebhook);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
