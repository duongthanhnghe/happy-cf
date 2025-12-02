import { Router } from 'express';
import { getVariantGroups, } from '../../controllers/v1/variant-group.controller.js';
const router = Router();
router.get('/', getVariantGroups);
export default router;
//# sourceMappingURL=variant-group.routes.js.map