import { Router } from 'express';
import {
  getAllVariantGroups,
  getActiveVariantGroups,
  getVariantGroupById,
  createVariantGroup,
  updateVariantGroup,
  deleteVariantGroup,
  toggleVariantGroupActive,
  getVariantGroupsByType,
} from '../../../controllers/v1/admin/variant-group.controller';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createVariantGroupSchema, updateVariantGroupSchema, idParamSchema } from '../../../../shared/validate/schemas/variant-group.schema'

const router = Router();

router.get('/active', authenticateAdmin, getActiveVariantGroups);
router.get('/type/:type', authenticateAdmin, getVariantGroupsByType);

router.get('/', authenticateAdmin, getAllVariantGroups);
router.get('/:id', authenticateAdmin, validate(idParamSchema, 'params'), getVariantGroupById);
router.post('/', authenticateAdmin, validate(createVariantGroupSchema), createVariantGroup);
router.put('/:id', authenticateAdmin, validate(idParamSchema, 'params'), validate(updateVariantGroupSchema), updateVariantGroup);
router.delete('/:id', authenticateAdmin, validate(idParamSchema, 'params'), deleteVariantGroup);
router.patch('/:id/toggle-active', authenticateAdmin, validate(idParamSchema, 'params'), toggleVariantGroupActive);

export default router;