import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { AccountModel } from "../../../models/v1/AccountEntity";
import { toAccountDTO, toAccountListDTO } from "../../../mappers/v1/adminAuthMapper"
import type { AccountJwtPayload } from "@/server/types/dto/v1/account.dto";

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.cookies?.admin_token;

  if (!token)
    return res.status(401).json({ code: 1, message: "Thiếu token đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as AccountJwtPayload;
    const admin = await AccountModel.findById(decoded.id);

    if (!admin || !admin.active) {
      return res.status(403).json({ code: 2, message: "Tài khoản không hợp lệ" });
    }

    return res.status(200).json({
      code: 0,
      message: "Xác thực thành công",
      data: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ code: 3, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await AccountModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ code: 1, message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ code: 2, message: "Mật khẩu không đúng" });
    }

    if (!admin.active) {
      return res.status(403).json({ code: 3, message: "Tài khoản bị vô hiệu hóa" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role, email: admin.email, avatar: admin.avatar },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    admin.lastLogin = new Date();
    await admin.save();

    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true khi deploy https
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      code: 0,
      message: "Đăng nhập thành công",
      data: {
        token,
        admin: toAccountDTO(admin)
      },
    });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ code: 1, message: "Thiếu email hoặc mật khẩu mới" });
    }

    const admin = await AccountModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    return res.status(200).json({
      code: 0,
      message: "Đặt lại mật khẩu thành công, mật khẩu mới là: " + newPassword,
      data: {
        email: admin.email,
        fullname: admin.fullname,
        role: admin.role,
      },
    });
  } catch (err: any) {
    console.error("Reset admin password error:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống",
      error: err.message,
    });
  }
};

export const getAccount = async (req: any, res: Response) => {
  try {
    const adminId = req.user?.id || req.params?.id;

    if (!adminId) {
      return res.status(400).json({ code: 1, message: "Thiếu ID admin" });
    }

    const admin = await AccountModel.findById(adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
    }

    return res.status(200).json({
      code: 0,
      message: "Lấy thông tin admin thành công",
      data: toAccountDTO(admin)
    });
  } catch (err: any) {
    console.error("Get admin info error:", err);
    return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
  }
};

export const updateAccount = async (req: any, res: Response) => {
  try {
    const adminId = req.body.id;
    if (!adminId) {
      return res.status(400).json({ code: 1, message: "Thiếu thông tin xác thực" });
    }

    const fields = {
      fullname: req.body.fullname,
      avatar: req.body.avatar,
    };

    const updated = await AccountModel.findByIdAndUpdate(adminId, fields, { new: true }).select("-password");

    if (!updated) {
      return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
    }

    return res.status(200).json({
      code: 0,
      message: "Cập nhật thông tin thành công",
      data: toAccountDTO(updated)
    });
  } catch (err: any) {
    console.error("Update admin error:", err);
    return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error: err.message });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const adminId = req.body.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ code: 1, message: "Thiếu mật khẩu cũ hoặc mới" });
    }

    const admin = await AccountModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ code: 2, message: "Không tìm thấy tài khoản admin" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ code: 3, message: "Mật khẩu cũ không đúng" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.status(200).json({
      code: 0,
      message: "Đổi mật khẩu thành công",
    });
  } catch (err: any) {
    console.error("Change admin password error:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống",
      error: err.message,
    });
  }
};

export const getAccountList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string)?.trim() || "";

    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (limit === -1) {
      const admins = await AccountModel.find(filter)
        .sort({ createdAt: -1 })
        .select("-password");

      return res.status(200).json({
        code: 0,
        data: toAccountListDTO(admins),
        pagination: {
          total: admins.length,
          totalPages: 1,
          page: 1,
          limit: admins.length,
        },
      });
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password",
    };

    const result = await (AccountModel as any).paginate(filter, options);

    return res.status(200).json({
      code: 0,
      data: toAccountListDTO(result.docs),
      pagination: {
        total: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error: any) {
    console.error("get all account error:", error);

    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await AccountModel.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "Account không tồn tại" })
    }

    item.active = !item.active
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toAccountDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  await AccountModel.findByIdAndDelete(id);
  res.json({ code: 0, message: "Delete success" });
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        code: 1,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const existing = await AccountModel.findOne({ email });
    if (existing) {
      return res.status(409).json({
        code: 3,
        message: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await AccountModel.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      active: true,
      avatar: process.env.IMAGE_AVATAR_DEFAULT || "",
      lastLogin: null,
    });

    return res.status(201).json({
      code: 0,
      message: "Tạo tài khoản thành công",
      data: toAccountDTO(newAccount),
    });
  } catch (err: any) {
    console.error("Create admin error:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống",
      error: err.message,
    });
  }
};
