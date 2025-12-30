import { Router } from 'express';

import { uploadSingle } from '@middleware/upload.middleware.js';
import * as profileController from '@controllers/profile.controller.js';
import { authenticateSupabaseToken } from '@middleware/supabase-auth.middleware.js';

const router = Router();

router.use(authenticateSupabaseToken);

router.get('/', profileController.getProfileData);
router.get('/users/search', profileController.searchUsers);

router.put('/', uploadSingle, profileController.updateMyProfile);
router.get('/stats/:userId', profileController.getStats);

// Profile GET routes  

export default router;
