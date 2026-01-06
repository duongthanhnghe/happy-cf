import { Router } from 'express'
import {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setAddressDefault,
  getDefaultAddressByUserId,
} from '../../controllers/v1/addresses.controller'
import { authenticate } from '../../middlewares/authenticate'
import { validate } from '../../middlewares/validate/validate'
import { createAddressSchema, updateAddressSchema, addressIdParamSchema } from '../../../shared/validate/schemas/address.schema'

const router = Router()

router.get('/default', authenticate, getDefaultAddressByUserId)
router.get('/',          authenticate, getAllAddress)
router.get('/:id',       authenticate, getAddressById)
router.post('/',         authenticate, validate(createAddressSchema), createAddress)
router.put('/:id',       authenticate, validate(updateAddressSchema), updateAddress)
router.delete('/:id',    authenticate, validate(addressIdParamSchema, 'params'), deleteAddress)
router.post('/:id/set-default', authenticate, validate(addressIdParamSchema, 'params'), setAddressDefault)

export default router
