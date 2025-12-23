import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountModel } from "../../../models/v1/account.entity.js";
import { toAccountDTO, toAccountListDTO } from "../../../mappers/v1/admin-auth.mapper.js";
export const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ code: 1, message: "Thiếu token đăng nhập" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        const account = await AccountModel.findById(decoded.id);
        if (!account || !account.active) {
            return res.status(403).json({ code: 2, message: "Tài khoản không hợp lệ" });
        }
        return res.status(200).json({
            code: 0,
            message: "Xác thực thành công",
            data: {
                id: account._id,
                avatar: account.avatar,
                fullname: account.fullname,
                email: account.email,
                role: account.role,
            },
        });
    }
    catch (err) {
        return res.status(401).json({ code: 3, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await AccountModel.findOne({ email });
        if (!account) {
            return res.status(400).json({ code: 1, message: "Tài khoản không tồn tại" });
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(400).json({ code: 2, message: "Mật khẩu không đúng" });
        }
        if (!account.active) {
            return res.status(403).json({ code: 3, message: "Tài khoản bị vô hiệu hóa" });
        }
        const accessToken = jwt.sign({ id: account._id, email: account.email, avatar: account.avatar, role: account.role, fullname: account.fullname }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: account._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        account.lastLogin = new Date();
        await account.save();
        res.cookie("admin_refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/v1/admin",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 ngày
        });
        return res.status(200).json({
            code: 0,
            message: "Đăng nhập thành công",
            data: {
                accessToken,
                account: toAccountDTO(account)
            },
        });
    }
    catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
    }
};
export const refreshToken = async (req, res) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.admin_refresh_token;
    if (!token) {
        return res.json({
            code: 1,
            message: "Không tìm thấy refresh token, vui lòng đăng nhập lại",
            data: null
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const account = await AccountModel.findById(decoded.id);
        if (!account)
            return res.status(403).json({ code: 2, message: "Account not found" });
        const newAccessToken = jwt.sign({ id: account._id, email: account.email, avatar: account.avatar, role: account.role, fullname: account.fullname }, process.env.JWT_SECRET, { expiresIn: "15m" });
        return res.json({
            code: 0,
            message: "Refresh thành công",
            data: { accessToken: newAccessToken }
        });
    }
    catch (err) {
        return res.status(401).json({ code: 3, message: "Refresh token hết hạn" });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ code: 1, message: "Thiếu email hoặc mật khẩu mới" });
        }
        const admin = await AccountModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        admin.password = hashed;
        await admin.save();
        return res.status(200).json({
            code: 0,
            message: "Đặt lại mật khẩu thành công, mật khẩu mới là: " + newPassword,
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
        const admin = await AccountModel.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        return res.status(200).json({
            code: 0,
            message: "Lấy thông tin admin thành công",
            data: toAccountDTO(admin)
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
        const updated = await AccountModel.findByIdAndUpdate(adminId, fields, { new: true }).select("-password");
        if (!updated) {
            return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
        }
        return res.status(200).json({
            code: 0,
            message: "Cập nhật thông tin thành công",
            data: toAccountDTO(updated)
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
        const admin = await AccountModel.findById(adminId);
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
export const getAccountList = async (req, res) => {
    var _a, _b;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        const role = (_b = req.query.role) === null || _b === void 0 ? void 0 : _b.trim();
        const filter = {};
        if (search) {
            filter.$or = [
                { fullname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (role) {
            filter.role = role;
        }
        if (limit === -1) {
            const admins = await AccountModel.find(filter)
                .sort({ createdAt: -1 })
                .select("-password");
            return res.status(200).json({
                code: 0,
                data: toAccountListDTO(admins),
                pagination: {
                    total: admins.length,
                    totalPages: 1,
                    page: 1,
                    limit: admins.length,
                },
            });
        }
        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
            select: "-password",
        };
        const result = await AccountModel.paginate(filter, options);
        return res.status(200).json({
            code: 0,
            data: toAccountListDTO(result.docs),
            pagination: {
                total: result.totalDocs,
                totalPages: result.totalPages,
                page: result.page,
                limit: result.limit,
            },
        });
    }
    catch (error) {
        console.error("get all account error:", error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await AccountModel.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "Account không tồn tại" });
        }
        item.active = !item.active;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toAccountDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    await AccountModel.findByIdAndDelete(id);
    res.json({ code: 0, message: "Delete success" });
};
export const createAccount = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                code: 1,
                message: "Thiếu thông tin bắt buộc",
            });
        }
        const existing = await AccountModel.findOne({ email });
        if (existing) {
            return res.status(409).json({
                code: 3,
                message: "Email đã tồn tại",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = await AccountModel.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            active: true,
            avatar: process.env.IMAGE_AVATAR_DEFAULT || "",
            lastLogin: null,
        });
        return res.status(201).json({
            code: 0,
            message: "Tạo tài khoản thành công",
            data: toAccountDTO(newAccount),
        });
    }
    catch (err) {
        console.error("Create admin error:", err);
        return res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống",
            error: err.message,
        });
    }
};
//# sourceMappingURL=account.controller.js.map