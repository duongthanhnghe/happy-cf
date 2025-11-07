import { Router } from 'express';
import { updateSettings, } from '../../../controllers/v1/admin/setting.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.put('/update', authenticateAdmin, updateSettings);
export default router;
//# sourceMappingURL=setting.router.js.map