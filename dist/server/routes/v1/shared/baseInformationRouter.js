import { Router } from 'express';
import { getBaseInformation, updateBaseInformation, } from '../../../controllers/v1/shared/base-Information.controller.js';
import { authenticate } from '../../../middlewares/authenticate.js';
const router = Router();
router.get('/', getBaseInformation);
router.put('/', authenticate, updateBaseInformation);
export default router;
//# sourceMappingURL=baseInformationRouter.js.map