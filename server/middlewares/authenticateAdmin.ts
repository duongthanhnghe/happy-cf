import jwt from 'jsonwebtoken'
import type { AccountJwtPayload, AccountRequest } from '../types/dto/v1/account.dto';
import { AccountModel } from "../models/v1/AccountEntity";

export const authenticateAdmin = async (req: any, res: any, next: any) => {

  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ code: 1, message: 'Thiếu token 123?' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as AccountJwtPayload;

    const admin = await AccountModel.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ code: 2, message: "Tài khoản admin không tồn tại hoặc đã bị xóa" });
    }

    if (!admin.active) {
      return res.status(403).json({ code: 3, message: "Tài khoản quản trị đã bị vô hiệu hóa" });
    }

    (req as AccountRequest).admin = decoded;
    next();
  } catch {
    return res.status(401).json({ code: 1, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
