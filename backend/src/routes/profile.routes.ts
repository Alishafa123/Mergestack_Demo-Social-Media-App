import { Router } from "express";
import * as profileController from "../controllers/profile.controller.js";
import { authenticateSupabaseToken } from "../middleware/supabase-auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = Router();

router.use(authenticateSupabaseToken);

router.get("/me", profileController.getMyProfile);

router.put("/me", uploadSingle, profileController.updateMyProfile);

router.delete("/me", profileController.deleteMyProfile);

router.get("/:userId", profileController.getProfile);
router.put("/:userId", uploadSingle, profileController.updateProfile);
router.delete("/:userId", profileController.deleteProfile);

export default router;