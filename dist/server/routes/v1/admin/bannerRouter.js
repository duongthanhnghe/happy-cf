import { Router } from 'express';
import { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner, updateOrder, toggleActive, } from '../../../controllers/v1/admin/bannerController.js';
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
router.get('/', authenticateAdmin, getAllBanners);
router.get('/:id', getBannerById);
router.post('/', authenticateAdmin, createBanner);
router.put('/:id', authenticateAdmin, updateBanner);
router.delete('/:id', authenticateAdmin, deleteBanner);
router.patch('/updateOrder/:id', authenticateAdmin, updateOrder);
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
export default router;
//# sourceMappingURL=bannerRouter.js.map