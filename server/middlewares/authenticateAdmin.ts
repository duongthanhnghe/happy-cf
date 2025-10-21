import jwt from 'jsonwebtoken'
import type { MyJwtPayload } from '@/server/types/dto/v1/user.dto';

export const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ code: 1, message: 'Thiếu token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as MyJwtPayload;
    if (decoded.role !== 2) {
      return res.status(403).json({ code: 1, message: 'Bạn không có quyền truy cập (Admin only)' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ code: 1, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
