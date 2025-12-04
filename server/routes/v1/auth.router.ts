import express from 'express'
import { 
  register,
  login,
  forgotPassword,
  resetPassword,
  updateAccount,
  changePassword,
  getUserById,
  googleLogin,
  verifyToken,
  refreshToken,
  logout,
} from '../../controllers/v1/auth.controller'
import { authenticate } from '../../middlewares/authenticate'

const router = express.Router()

router.put('/users/me', authenticate, updateAccount)
router.get('/users/:id', getUserById)
router.get('/verify-token', verifyToken)
router.post('/refresh-token', refreshToken)
router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/change-password', authenticate, changePassword)
router.post('/logout', authenticate, logout)

export default router
