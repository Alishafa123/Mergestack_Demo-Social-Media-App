import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";
import { authenticateSupabaseToken } from "../middleware/supabase-auth.middleware.js";

const router = Router();

router.use(authenticateSupabaseToken);

// Comment routes
router.post("/posts/:postId/comments", commentController.createComment);
router.get("/posts/:postId/comments", commentController.getPostComments);
router.put("/comments/:commentId", commentController.updateComment);
router.delete("/comments/:commentId", commentController.deleteComment);

export default router;