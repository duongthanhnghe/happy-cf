import { Router } from 'express';
import { getAllBanners, } from '../../controllers/v1/bannerController.js';
const router = Router();
router.get('/', getAllBanners);
export default router;
//# sourceMappingURL=bannerRouter.js.map