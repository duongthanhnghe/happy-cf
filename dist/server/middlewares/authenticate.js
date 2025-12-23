import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // lấy Bearer token
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