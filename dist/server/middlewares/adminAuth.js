import jwt from "jsonwebtoken";
export const verifyAdminToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            return res.status(401).json({ code: 401, message: "Chưa đăng nhập" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ code: 401, message: "Token không hợp lệ" });
    }
};
//# sourceMappingURL=adminAuth.js.map