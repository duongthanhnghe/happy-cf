import jwt from 'jsonwebtoken';
export const authenticateAdmin = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token)
        return res.status(401).json({ code: 1, message: 'Thiếu token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        if (decoded.role !== 2) {
            return res.status(403).json({ code: 1, message: 'Bạn không có quyền truy cập (Admin only)' });
        }
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ code: 1, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
//# sourceMappingURL=authenticateAdmin.js.map