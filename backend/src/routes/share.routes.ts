import { Router } from 'express';

import * as shareController from '@controllers/share.controller.js';
import { authenticateSupabaseToken } from '@middleware/supabase-auth.middleware.js';

const router = Router();

router.use(authenticateSupabaseToken);

// Share routes
router.post('/posts/:postId/share', shareController.sharePost);
router.get('/posts/:postId/shares', shareController.getPostShares);
router.get('/users/:userId/shares', shareController.getUserShares);
router.delete('/posts/:postId/share', shareController.unsharePost);

export default router;
