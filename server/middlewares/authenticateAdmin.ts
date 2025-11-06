import jwt from 'jsonwebtoken'
import type { AdminJwtPayload, AdminRequest } from '../types/dto/v1/admin-auth.dto';
import { AdminAccountModel } from "../models/v1/AdminAccountEntity";

export const authenticateAdmin = async (req: any, res: any, next: any) => {

  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ code: 1, message: 'Thiếu token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as AdminJwtPayload;

    const admin = await AdminAccountModel.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ code: 2, message: "Tài khoản admin không tồn tại hoặc đã bị xóa" });
    }

    if (!admin.active) {
      return res.status(403).json({ code: 3, message: "Tài khoản quản trị đã bị vô hiệu hóa" });
    }

    (req as AdminRequest).admin = decoded;
    next();
  } catch {
    return res.status(401).json({ code: 1, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
