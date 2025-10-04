import express from 'express';
import { register, login, forgotPassword, resetPassword, updateAccount, deleteUsers, getAllUsers, getAllMembershipLevel, setPoint, changePassword, logSearchKeyword, getTopSearchKeyword, getUserById, toggleActive, getMembershipLevelById, updateMembershipLevel, createMembershipBenefit, updateMembershipBenefit, deleteMembershipBenefit, getAllMembershipBenefits, getMembershipBenefitById, googleLogin, } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';
const router = express.Router();
// User routes
router.get('/users', getAllUsers);
router.put('/users/me', authenticate, updateAccount);
router.get('/users/:id', getUserById);
router.patch('/users/toggleActive/:id', toggleActive);
router.post('/register', register);
router.post('/login', login);
// router.get('/google-login', (req, res) => {
//   // Khi Google kiểm tra redirect URI, hoặc user truy cập trực tiếp
//   res.send("Google OAuth callback OK - Use POST /api/auth/google-login to verify token.");
// });
// Route FE thực tế gọi khi user login Google
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);
router.post('/set-point', setPoint);
router.delete('/:id', deleteUsers);
router.get('/membership-level', getAllMembershipLevel);
router.get('/membership-level/:id', getMembershipLevelById);
router.put('/membership-level/:id', updateMembershipLevel);
router.post('/search-keywords/log', logSearchKeyword);
router.get('/search-keywords/list', getTopSearchKeyword);
router.get('/membership-benefit', getAllMembershipBenefits);
router.get('/membership-benefit/:id', getMembershipBenefitById);
router.post('/membership-benefit', authenticate, createMembershipBenefit);
router.put('/membership-benefit/:id', authenticate, updateMembershipBenefit);
router.delete('/membership-benefit/:id', authenticate, deleteMembershipBenefit);
export default router;
//# sourceMappingURL=authRouter.js.map