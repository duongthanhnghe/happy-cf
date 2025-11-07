import { Router } from 'express';
import { getAllBanners, } from '../../controllers/v1/banner.controller.js';
const router = Router();
router.get('/', getAllBanners);
export default router;
//# sourceMappingURL=banner.router.js.map