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
 } from "../../../controllers/v1/admin/account.controller";
import { authorizeRoles } from "../../../middlewares/admin-role";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { ACCOUNT_ROLES_CONST } from "../../../types/dto/v1/account.dto";

const router = Router();

router.post("/login", login);
router.post("/reset-password", authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), resetPassword);
router.get("/verify-token", verifyToken);
router.get('/list', authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), getAccountList);
router.get("/me/:id", authenticateAdmin, getAccount);
router.put("/update", authenticateAdmin, updateAccount);
router.post("/change-password", authenticateAdmin, changePassword);
router.post("/create", authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), createAccount);

router.post("/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  res.json({ code: 0, message: "Đăng xuất thành công" });
});

router.patch('/toggleActive/:id', authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), toggleActive)
router.delete('/:id', authenticateAdmin, authorizeRoles(ACCOUNT_ROLES_CONST.SUPERADMIN), deleteAccount)

export default router;
