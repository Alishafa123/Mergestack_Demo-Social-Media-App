import { Router } from "express";

import { uploadSingle } from "@middleware/upload.middleware.js";
import * as profileController from "@controllers/profile.controller.js";
import { authenticateSupabaseToken } from "@middleware/supabase-auth.middleware.js";

const router = Router();

router.use(authenticateSupabaseToken);

// Search route must come before parameterized routes
router.get("/users/search", profileController.searchUsers);

router.get("/me", profileController.getMyProfile);

router.put("/me", uploadSingle, profileController.updateMyProfile);

router.delete("/me", profileController.deleteMyProfile);

router.get("/stats/me", profileController.getUserStats);
router.get("/stats/:userId", profileController.getPublicUserStats);

router.get("/:userId", profileController.getProfile);
router.put("/:userId", uploadSingle, profileController.updateProfile);
router.delete("/:userId", profileController.deleteProfile);

export default router;