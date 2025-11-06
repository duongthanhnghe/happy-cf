import { Router } from "express";
import { adminLogin, resetAdminPassword,
  getAccount,
  updateAccount,
  changePassword,
  verifyAdminToken
 } from "../../../controllers/v1/admin/adminAuthController";
import { authorizeRoles } from "../../../middlewares/adminRole";
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin'

const router = Router();

router.post("/login", adminLogin);
router.post("/reset-password", authenticateAdmin, authorizeRoles("superadmin", "editor") as any, resetAdminPassword);
router.get("/verify-token", verifyAdminToken);
router.get("/me/:id", authenticateAdmin, getAccount);
router.put("/update", authenticateAdmin, updateAccount);
router.post("/change-password", authenticateAdmin, changePassword);

router.post("/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  res.json({ code: 0, message: "Đăng xuất thành công" });
});

export default router;
