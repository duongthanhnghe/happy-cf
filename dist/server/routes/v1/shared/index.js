import { Router } from 'express';
import fileManageRoutes from './file-manage.router.js';
import locationRoutes from './location.router.js';
import baseInformationRoutes from './base-information.router.js';
const router = Router();
router.use('/fileManage', fileManageRoutes);
router.use('/location', locationRoutes);
router.use('/base-information', baseInformationRoutes);
export default router;
//# sourceMappingURL=index.js.map