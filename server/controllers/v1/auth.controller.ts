import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/v1/user.entity";
import { MembershipLevelModel } from "../../models/v1/membership-level.entity";
import { toUserDTO } from "../../mappers/v1/user.mapper";
import type { Request, Response } from "express";
import { generateBarcode } from '../../utils/barcodeGenerator'
import { sendResetPasswordEmail } from "../../utils/mailer";
import { randomBytes } from 'crypto'
import { OAuth2Client } from "google-auth-library";
import type { MyJwtPayload } from "@/server/types/dto/v1/user.dto";
import { clearAuthCookie, setRefreshCookie } from "@/server/utils/cookieHelpers";

const client = new OAuth2Client(process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID, process.env.NUXT_GOOGLE_CLIENT_SECRET);

export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]

  if (!token)
    return res.status(401).json({ code: 1, message: "Thiếu token đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as MyJwtPayload;
    const user = await UserModel.findById(decoded.id);

    if (!user || !user.active) {
      return res.status(403).json({ code: 2, message: "Tài khoản không hợp lệ" });
    }

    return res.status(200).json({
      code: 0,
      message: "Xác thực thành công",
      data: toUserDTO(user),
    });
  } catch (err) {
    return res.status(401).json({ code: 3, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, gender } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ code: 1, message: "Email đã được đăng ký" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const barcode = Date.now().toString()
    const barcodeFilename = `barcode-${barcode}.png`
    const barcodePath = await generateBarcode(barcode, barcodeFilename) as string;

    const defaultLevel = await MembershipLevelModel.findOne({ name: "Bronze" });

    if (!defaultLevel) {
      return res.status(500).json({
        code: 2,
        message: "Không tìm thấy hạng mặc định (Bronze) trong hệ thống",
      });
    }

    const user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
      gender,
      phone: "",
      birthday: new Date().toISOString(),
      avatar: process.env.IMAGE_AVATAR_DEFAULT || "",
      active: true,
      role: 1,
      authProvider: 'local',
      googleId: null,
      membership: {
        level: defaultLevel.name || "Bronze",
        point: 0,
        balancePoint: 0,
        discountRate: defaultLevel.discountRate || 0,
        pointRate: defaultLevel.pointRate || 0,
        joinedAt: new Date(),
        code: Date.now(),
        barcode: barcodePath || ""
      }
    });

    res.status(200).json({ code: 0, message: "Register success", data: toUserDTO(user) });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ code: 2, message: "Register failed", error: err.message || err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ code: 2, message: "Email không đúng!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ code: 1, message: "Mật khẩu không đúng!" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "30d" }
    );

    setRefreshCookie(req, res, "refresh_token", refreshToken)

    return res.status(200).json({
      code: 0,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        user: toUserDTO(user)
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Đăng nhập thất bại", error: err });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return res.json({ 
      code: 1, 
      message: "Không tìm thấy refresh token, vui lòng đăng nhập lại", 
      data: null 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(403).json({ code: 2, message: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return res.json({
      code: 0,
      message: "Refresh thành công",
      data: { accessToken: newAccessToken }
    });

  } catch (err) {
    return res.status(401).json({ code: 3, message: "Refresh token hết hạn" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Xác thực token từ Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ code: 1, message: "Xác thực Google thất bại" });
    }

    const { email, name, picture, sub } = payload;

    let user = await UserModel.findOne({ email });
    if (!user) {
      const barcode = Date.now().toString()
      const barcodeFilename = `barcode-${barcode}.png`
      const barcodePath = await generateBarcode(barcode, barcodeFilename) as string;

      const defaultLevel = await MembershipLevelModel.findOne({ name: "Bronze" });

      if (!defaultLevel) {
        return res.status(500).json({
          code: 2,
          message: "Không tìm thấy hạng mặc định (Bronze) trong hệ thống",
        });
      }

      user = await UserModel.create({
        fullname: name,
        email,
        // password: "",
        gender: "male",
        phone: "",
        birthday: new Date().toISOString(),
        avatar: picture || process.env.IMAGE_AVATAR_DEFAULT,
        authProvider: 'google',
        googleId: sub,
        active: true,
        role: 1,
        membership: {
          level: defaultLevel.name || "Bronze",
          point: 0,
          balancePoint: 0,
          discountRate: defaultLevel.discountRate || 0,
          pointRate: defaultLevel.pointRate || 0,
          joinedAt: new Date(),
          code: Date.now(),
          barcode: barcodePath || ""
        }
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "30d" }
    );

    setRefreshCookie(req, res, "refresh_token", refreshToken)
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   // sameSite: "strict",
    //   // path: "/api/v1/auth",
    //   sameSite: "lax",
    //   path: "/",
    //   maxAge: 10 * 24 * 60 * 60 * 1000 // 10 ngày
    // });

    return res.status(200).json({
      code: 0,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        user: toUserDTO(user)
      }
    });
  } catch (err: any) {
    console.error("Google login error:", err);
    res.status(500).json({ code: 1, message: "Đăng nhập Google thất bại", error: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ code: 1, message: "Thiếu email" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ code: 2, message: "Email không tồn tại" });
    }

    const token = randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 phút

    await user.save();

    const resetLink = `${process.env.DOMAIN}/reset-password?email=${email}&token=${token}`;
    await sendResetPasswordEmail(email, resetLink);

    return res.status(200).json({
      code: 0,
      message: "Đã gửi email đặt lại mật khẩu",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      code: 500,
      message: "Có lỗi xảy ra khi xử lý yêu cầu",
      error: err,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.json({ code: 2, message: "Thiếu dữ liệu" });
    }

    const user = await UserModel.findOne({
      email,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        code: 1,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return res.status(200).json({
      code: 0,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      code: 500,
      message: "Có lỗi xảy ra khi xử lý yêu cầu",
      error: err,
    });
  }
};

export const updateAccount = async (req: any, res: Response) => {
  const userId = req.user.id;
  const updated = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ code: 1, success: false, message: "User not found" });
  }

  res.json({ code: 0, message: "Update success", data: toUserDTO(updated!) });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) return res.status(404).json({ code: 404, message: "Not found" });
  res.json({ code: 0, data: toUserDTO(user) });
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        code: 2,
        message: "Không tìm thấy tài khoản",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 3, message: "Mật khẩu cũ không đúng" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

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

export const logout = (req: Request, res: Response) => {
  clearAuthCookie(req, res, "refresh_token")

  return res.status(200).json({
    code: 0,
    message: "Đăng xuất thành công",
  })
}
