import express from 'express'
import { 
  deleteUsers,
  getAllUsers,
  getAllMembershipLevel,
  getUserById,
  toggleActive,
  getMembershipLevelById,
  updateMembershipLevel,
  createMembershipBenefit,
  updateMembershipBenefit,
  deleteMembershipBenefit,
  getAllMembershipBenefits,
  getMembershipBenefitById,
  getRewardHistory,
} from '../../../controllers/v1/admin/users.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { idParamSchema } from '../../../../shared/validate/schemas/user.schema'

const router = express.Router()

router.get('/reward-history', authenticateAdmin, getRewardHistory)

router.get('/membership-level', getAllMembershipLevel)
router.get('/membership-level/:id', getMembershipLevelById)
router.put('/membership-level/:id', authenticateAdmin, updateMembershipLevel)

router.get('/membership-benefit', getAllMembershipBenefits)
router.get('/membership-benefit/:id', getMembershipBenefitById)
router.post('/membership-benefit', authenticateAdmin, createMembershipBenefit)
router.put('/membership-benefit/:id', authenticateAdmin, updateMembershipBenefit)
router.delete('/membership-benefit/:id', authenticateAdmin, deleteMembershipBenefit)

router.get('/', authenticateAdmin, getAllUsers)
router.get('/:id', authenticateAdmin, validate(idParamSchema, 'params'), getUserById)
router.patch('/toggleActive/:id', authenticateAdmin, validate(idParamSchema, 'params'), toggleActive)
router.delete('/:id', authenticateAdmin, validate(idParamSchema, 'params'), deleteUsers)

export default router
