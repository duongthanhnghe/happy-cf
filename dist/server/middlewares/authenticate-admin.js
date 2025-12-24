import jwt from 'jsonwebtoken';
export const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Thiếu token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        req.account = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};
//# sourceMappingURL=authenticate-admin.js.map