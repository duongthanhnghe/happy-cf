import express from 'express';
import { deleteUsers, getAllUsers, getAllMembershipLevel, getUserById, toggleActive, getMembershipLevelById, updateMembershipLevel, createMembershipBenefit, updateMembershipBenefit, deleteMembershipBenefit, getAllMembershipBenefits, getMembershipBenefitById, getRewardHistory, } from '../../../controllers/v1/admin/usersController.js';
const router = express.Router();
router.get('/reward-history', getRewardHistory);
router.get('/membership-level', getAllMembershipLevel);
router.get('/membership-level/:id', getMembershipLevelById);
router.put('/membership-level/:id', updateMembershipLevel);
router.get('/membership-benefit', getAllMembershipBenefits);
router.get('/membership-benefit/:id', getMembershipBenefitById);
router.post('/membership-benefit', createMembershipBenefit);
router.put('/membership-benefit/:id', updateMembershipBenefit);
router.delete('/membership-benefit/:id', deleteMembershipBenefit);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/toggleActive/:id', toggleActive);
router.delete('/:id', deleteUsers);
export default router;
//# sourceMappingURL=usersRouter.js.map