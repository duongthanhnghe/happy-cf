import { Router } from 'express';
import { updateSettings, } from '../controllers/settingController.js';
const router = Router();
router.put('/update', updateSettings);
export default router;
//# sourceMappingURL=settingRouter.js.map