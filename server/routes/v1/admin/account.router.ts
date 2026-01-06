import { Router } from "express";
import {
  login,
  resetPassword,
  getAccount,
  updateAccount,
  changePassword,
  verifyToken,
  getAccountList,
  toggleActive,
  deleteAccount,
  createAccount,
  refreshToken,
  logout,
 } from "../../../controllers/v1/admin/account.controller";
import { authorizeRoles } from "../../../middlewares/admin-role";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { ACCOUNT_ROLES_CONST } from "../../../types/dto/v1/account.dto";
import { validate } from '../../../middlewares/validate/validate'
import { idParamSchema, createAccountSchema, updateAccountSchema, changePasswordSchema } from '../../../../shared/validate/schemas/account.schema'

const router = Router();

router.post("/login", login);
router.post("/reset-password", authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), resetPassword);
router.get("/verify-token", verifyToken);
router.post('/refresh-token', refreshToken)
router.get('/list', authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), getAccountList);
router.get("/me/:id", authenticateAdmin, validate(idParamSchema, 'params'), getAccount);
router.put("/update", authenticateAdmin, validate(updateAccountSchema), updateAccount);
router.post("/change-password", authenticateAdmin, validate(changePasswordSchema), changePassword);
router.post("/create", authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), validate(createAccountSchema), createAccount);
router.post('/logout', logout)

router.patch('/toggleActive/:id', authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), validate(idParamSchema, 'params'), toggleActive)
router.delete('/:id', authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), validate(idParamSchema, 'params'), deleteAccount)

export default router;
