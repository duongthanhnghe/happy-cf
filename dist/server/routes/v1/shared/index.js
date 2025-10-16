import { Router } from 'express';
import fileManageRoutes from './fileManageRouter.js';
import locationRoutes from './locationRouter.js';
const router = Router();
router.use('/fileManage', fileManageRoutes);
router.use('/location', locationRoutes);
export default router;
//# sourceMappingURL=index.js.map