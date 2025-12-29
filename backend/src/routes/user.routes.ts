import { Router } from 'express';

import * as userController from '@controllers/user.controller.js';
import { authenticateSupabaseToken } from '@middleware/supabase-auth.middleware.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticateSupabaseToken);

router.post('/:userId/follow', userController.followUser);
router.delete('/:userId/follow', userController.unfollowUser);

router.get('/:userId/followers', userController.getFollowers);
router.get('/:userId/following', userController.getFollowing);

router.get('/:userId/follow-status', userController.checkFollowStatus);

export default router;
