import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticateSupabaseToken } from "../middleware/supabase-auth.middleware.js";
import { uploadMultiple } from "../middleware/upload.middleware.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticateSupabaseToken);

// Post CRUD operations
router.post("/", uploadMultiple, postController.createPost);
router.get("/", postController.getPosts);
router.get("/trending", postController.getTrendingPosts);
router.get("/top/me", postController.getUserTopPosts);
router.get("/:postId", postController.getPost);
router.put("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

// Post interactions
router.post("/:postId/like", postController.toggleLike);

export default router;