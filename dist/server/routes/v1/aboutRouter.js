import { Router } from 'express';
import { getAllAbout, getAboutById, createAbout, updateAbout, deleteAbout, updateOrder, toggleActive, } from '../../controllers/v1/aboutController.js';
const router = Router();
router.get('/', getAllAbout);
router.get('/:id', getAboutById);
router.post('/', createAbout);
router.put('/:id', updateAbout);
router.delete('/:id', deleteAbout);
router.patch('/updateOrder/:id', updateOrder);
router.patch('/toggleActive/:id', toggleActive);
export default router;
//# sourceMappingURL=aboutRouter.js.map