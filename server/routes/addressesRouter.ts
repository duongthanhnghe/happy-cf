import { Router } from 'express'
import {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setAddressDefault,
  getDefaultAddressByUserId,
} from '../controllers/addressesController'

const router = Router()

router.get('/default/:userId', getDefaultAddressByUserId)
router.get('/:userId',          getAllAddress)
router.get('/:id',       getAddressById)
router.post('/',         createAddress)
router.put('/:id',       updateAddress)
router.delete('/:id',    deleteAddress)
router.post('/:id/set-default', setAddressDefault)

export default router
