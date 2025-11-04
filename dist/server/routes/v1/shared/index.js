import { Router } from 'express';
import fileManageRoutes from './fileManageRouter.js';
import locationRoutes from './locationRouter.js';
import baseInformationRoutes from './baseInformationRouter.js';
const router = Router();
router.use('/fileManage', fileManageRoutes);
router.use('/location', locationRoutes);
router.use('/base-information', baseInformationRoutes);
export default router;
//# sourceMappingURL=index.js.map