import { Router } from 'express';
import { getAllVariantGroups, getActiveVariantGroups, getVariantGroupById, createVariantGroup, updateVariantGroup, deleteVariantGroup, toggleVariantGroupActive, getVariantGroupsByType, } from '../../../controllers/v1/admin/variant-group.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
// Public routes (if needed)
router.get('/active', getActiveVariantGroups);
router.get('/type/:type', getVariantGroupsByType);
// Admin routes
router.get('/', authenticateAdmin, getAllVariantGroups);
router.get('/:id', authenticateAdmin, getVariantGroupById);
router.post('/', authenticateAdmin, createVariantGroup);
router.put('/:id', authenticateAdmin, updateVariantGroup);
router.delete('/:id', authenticateAdmin, deleteVariantGroup);
router.patch('/:id/toggle-active', authenticateAdmin, toggleVariantGroupActive);
export default router;
//# sourceMappingURL=variant-group.routes.js.map