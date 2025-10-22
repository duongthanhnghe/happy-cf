import { Router } from 'express';
import { getAllAddress, getAddressById, createAddress, updateAddress, deleteAddress, setAddressDefault, getDefaultAddressByUserId, } from '../../controllers/v1/addressesController.js';
import { authenticate } from '../../middlewares/authenticate.js';
const router = Router();
router.get('/default/:userId', authenticate, getDefaultAddressByUserId);
router.get('/user/:userId', authenticate, getAllAddress);
router.get('/:id', authenticate, getAddressById);
router.post('/', authenticate, createAddress);
router.put('/:id', authenticate, updateAddress);
router.delete('/:id', authenticate, deleteAddress);
router.post('/:id/set-default', authenticate, setAddressDefault);
export default router;
//# sourceMappingURL=addressesRouter.js.map