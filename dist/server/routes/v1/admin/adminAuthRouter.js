import { Router } from "express";
import { adminLogin, resetAdminPassword, getAccount, updateAccount, changePassword, verifyAdminToken, getAccountList, toggleActive, deleteAccount, createAccount, } from "../../../controllers/v1/admin/adminAuthController.js";
import { authorizeRoles } from "../../../middlewares/adminRole.js";
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
router.post("/login", adminLogin);
router.post("/reset-password", authenticateAdmin, authorizeRoles("superadmin"), resetAdminPassword);
router.get("/verify-token", verifyAdminToken);
router.get('/list', authenticateAdmin, authorizeRoles("superadmin"), getAccountList);
router.get("/me/:id", authenticateAdmin, getAccount);
router.put("/update", authenticateAdmin, updateAccount);
router.post("/change-password", authenticateAdmin, changePassword);
router.post("/create", authenticateAdmin, authorizeRoles("superadmin"), createAccount);
router.post("/logout", (req, res) => {
    res.clearCookie("admin_token", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
    });
    res.json({ code: 0, message: "Đăng xuất thành công" });
});
router.patch('/toggleActive/:id', authenticateAdmin, authorizeRoles("superadmin"), toggleActive);
router.delete('/:id', authenticateAdmin, authorizeRoles("superadmin"), deleteAccount);
export default router;
//# sourceMappingURL=adminAuthRouter.js.map