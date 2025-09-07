import { Router } from 'express';
import { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner, } from '../controllers/bannerController.js';
const router = Router();
router.get('/', getAllBanners);
router.get('/:id', getBannerById);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);
export default router;
//# sourceMappingURL=banner.js.map