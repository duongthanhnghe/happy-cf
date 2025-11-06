import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminAccountModel } from "../../../models/v1/AdminAccountEntity.js";
import { toAdminAccountDTO } from "../../../mappers/v1/adminAuthMapper.js";
export const verifyAdminToken = async (req, res) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.admin_token;
    if (!token)
        return res.status(401).json({ code: 1, message: "Thiếu token đăng nhập" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        const admin = await AdminAccountModel.findById(decoded.id);
        if (!admin || !admin.active) {
            return res.status(403).json({ code: 2, message: "Tài khoản không hợp lệ" });
        }
        return res.status(200).json({
            code: 0,
            message: "Xác thực thành công",
            data: {
                id: admin._id,
                fullname: admin.fullname,
                email: admin.email,
                role: admin.role,
            },
        });
    }
    catch (err) {
        return res.status(401).json({ code: 3, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminAccountModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ code: 1, message: "Tài khoản không tồn tại" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ code: 2, message: "Mật khẩu không đúng" });
        }
        if (!admin.active) {
            return res.status(403).json({ code: 3, message: "Tài khoản bị vô hiệu hóa" });
        }
        const token = jwt.sign({ id: admin._id, role: admin.role, email: admin.email, avatar: admin.avatar }, process.env.JWT_SECRET, { expiresIn: "8h" });
        admin.lastLogin = new Date();
        await admin.save();
        res.cookie("admin_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // true khi deploy https
            maxAge: 8 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            code: 0,
            message: "Đăng nhập thành công",
            data: {
                token,
                admin: toAdminAccountDTO(admin)
            },
        });
    }
    catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
    }
};
export const resetAdminPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ code: 1, message: "Thiếu email hoặc mật khẩu mới" });
        }
        const admin = await AdminAccountModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        admin.password = hashed;
        await admin.save();
        return res.status(200).json({
            code: 0,
            message: "Đặt lại mật khẩu thành công",
            data: {
                email: admin.email,
                fullname: admin.fullname,
                role: admin.role,
            },
        });
    }
    catch (err) {
        console.error("Reset admin password error:", err);
        return res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống",
            error: err.message,
        });
    }
};
export const getAccount = async (req, res) => {
    var _a, _b;
    try {
        const adminId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
        if (!adminId) {
            return res.status(400).json({ code: 1, message: "Thiếu ID admin" });
        }
        const admin = await AdminAccountModel.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        return res.status(200).json({
            code: 0,
            message: "Lấy thông tin admin thành công",
            data: toAdminAccountDTO(admin)
        });
    }
    catch (err) {
        console.error("Get admin info error:", err);
        return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
    }
};
export const updateAccount = async (req, res) => {
    try {
        const adminId = req.body.id;
        if (!adminId) {
            return res.status(400).json({ code: 1, message: "Thiếu thông tin xác thực" });
        }
        const fields = {
            fullname: req.body.fullname,
            avatar: req.body.avatar,
        };
        const updated = await AdminAccountModel.findByIdAndUpdate(adminId, fields, { new: true }).select("-password");
        if (!updated) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        return res.status(200).json({
            code: 0,
            message: "Cập nhật thông tin thành công",
            data: toAdminAccountDTO(updated)
        });
    }
    catch (err) {
        console.error("Update admin error:", err);
        return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
    }
};
export const changePassword = async (req, res) => {
    try {
        const adminId = req.body.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ code: 1, message: "Thiếu mật khẩu cũ hoặc mới" });
        }
        const admin = await AdminAccountModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ code: 3, message: "Mật khẩu cũ không đúng" });
        }
        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();
        return res.status(200).json({
            code: 0,
            message: "Đổi mật khẩu thành công",
        });
    }
    catch (err) {
        console.error("Change admin password error:", err);
        return res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống",
            error: err.message,
        });
    }
};
//# sourceMappingURL=adminAuthController.js.map