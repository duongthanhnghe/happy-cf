import type { Response, NextFunction } from "express";
import type { AccountRequest, AccountRoleType } from '../types/dto/v1/account.dto';

export const authorizeRoles = (...roles: AccountRoleType[]) => {
  
  return (req: AccountRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(403).json({ code: 403, message: "Chưa xác thực tài khoản quản trị" });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ code: 403, message: "Bạn không có quyền truy cập chức năng này" });
    }

    next();
  };
};
