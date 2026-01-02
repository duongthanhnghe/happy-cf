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
import { validate } from '../../middlewares/validate/validate'
import { idParamSchema, loginSchema, registerSchema, resetPasswordSchema, changePasswordSchema } from '../../../shared/validate/schemas/user.schema'

const router = express.Router()

router.put('/users/me', authenticate, updateAccount)
router.get('/users/:id', validate(idParamSchema, 'params'), getUserById)
router.get('/verify-token', verifyToken)
router.post('/refresh-token', refreshToken)
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/google-login', googleLogin)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword)
router.post('/logout', authenticate, logout)

export default router
