import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return res.status(401).json({ message: 'Thiếu token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};
//# sourceMappingURL=authenticate.js.map