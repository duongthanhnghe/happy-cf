import jwt from 'jsonwebtoken'
// import type { AccountJwtPayload, AccountRequest } from '../types/dto/v1/account.dto';
// import { AccountModel } from "../models/v1/account.entity";

export const authenticateAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // lấy Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Thiếu token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    req.account = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
  // const token = req.cookies?.admin_refresh_token;
  // if (!token) return res.status(401).json({ code: 1, message: 'Thiếu token day ne?' });

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || '') as AccountJwtPayload;

  //   const admin = await AccountModel.findById(decoded.id);
  //   if (!admin) {
  //     return res.status(401).json({ code: 2, message: "Tài khoản admin không tồn tại hoặc đã bị xóa" });
  //   }

  //   if (!admin.active) {
  //     return res.status(403).json({ code: 3, message: "Tài khoản quản trị đã bị vô hiệu hóa" });
  //   }

  //   (req as AccountRequest).account = decoded;
  //   next();
  // } catch {
  //   return res.status(401).json({ code: 1, message: 'Token không hợp lệ hoặc đã hết hạn' });
  // }
};
