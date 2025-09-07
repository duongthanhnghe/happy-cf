import express from 'express';
import { register, login, forgotPassword, resetPassword, updateAccount, deleteUsers, getAllUsers, getAllMembershipLevel, setPoint, changePassword, logSearchKeyword, getTopSearchKeyword, getUserById } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';
const router = express.Router();
router.get('/users', getAllUsers);
router.put('/users/me', authenticate, updateAccount);
router.get('/users/:id', getUserById);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);
router.get('/membership-level', getAllMembershipLevel);
router.post('/set-point', setPoint);
router.post('/search-keywords/log', logSearchKeyword);
router.get('/search-keywords/list', getTopSearchKeyword);
router.delete('/:id', deleteUsers);
export default router;
//# sourceMappingURL=auth.js.map