export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(403).json({ code: 403, message: "Chưa xác thực tài khoản quản trị" });
        }
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({ code: 403, message: "Bạn không có quyền truy cập chức năng này" });
        }
        next();
    };
};
//# sourceMappingURL=adminRole.js.map