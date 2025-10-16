import { Router } from 'express';
import { updateSettings, } from '../../../controllers/v1/admin/settingController.js';
const router = Router();
router.put('/update', updateSettings);
export default router;
//# sourceMappingURL=settingRouter.js.map