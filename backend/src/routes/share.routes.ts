import { Router } from 'express';

import * as shareController from '@controllers/share.controller';
import { authenticateSupabaseToken } from '@middleware/supabase-auth.middleware';

const router = Router();

router.use(authenticateSupabaseToken);

// Share routes
router.post('/posts/:postId/share', shareController.sharePost);
router.delete('/posts/:postId/share', shareController.unsharePost);

export default router;
