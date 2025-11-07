import jwt from 'jsonwebtoken';
import { AccountModel } from "../models/v1/account.entity.js";
export const authenticateAdmin = async (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.admin_token;
    if (!token)
        return res.status(401).json({ code: 1, message: 'Thiếu token 123?' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const admin = await AccountModel.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ code: 2, message: "Tài khoản admin không tồn tại hoặc đã bị xóa" });
        }
        if (!admin.active) {
            return res.status(403).json({ code: 3, message: "Tài khoản quản trị đã bị vô hiệu hóa" });
        }
        req.admin = decoded;
        next();
    }
    catch {
        return res.status(401).json({ code: 1, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
//# sourceMappingURL=authenticate-admin.js.map