export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.account) {
            return res.status(403).json({ code: 403, message: "Chưa xác thực tài khoản quản trị" });
        }
        if (!roles.includes(req.account.role)) {
            return res.status(403).json({ code: 403, message: "Bạn không có quyền truy cập chức năng này" });
        }
        next();
    };
};
//# sourceMappingURL=admin-role.js.map