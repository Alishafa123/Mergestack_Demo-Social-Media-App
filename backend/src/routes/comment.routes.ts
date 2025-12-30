import { Router } from 'express';

import * as commentController from '@controllers/comment.controller';
import { authenticateSupabaseToken } from '@middleware/supabase-auth.middleware';

const router = Router();

router.use(authenticateSupabaseToken);

router.put('/comments/:commentId', commentController.updateComment);
router.post('/posts/:postId/comments', commentController.createComment);
router.get('/posts/:postId/comments', commentController.getPostComments);
router.delete('/comments/:commentId', commentController.deleteComment);

export default router;
