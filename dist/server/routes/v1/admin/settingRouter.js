import { Router } from 'express';
import { updateSettings, } from '../../../controllers/v1/admin/setting.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
router.put('/update', authenticateAdmin, updateSettings);
export default router;
//# sourceMappingURL=settingRouter.js.map