import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/v1/user.entity.js";
import { MembershipLevelModel } from "../../models/v1/membership-level.entity.js";
import { toUserDTO } from "../../mappers/v1/user.mapper.js";
import { generateBarcode } from '../../utils/barcodeGenerator.js';
import { sendResetPasswordEmail } from "../../utils/mailer.js";
import { randomBytes } from 'crypto';
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID, process.env.NUXT_GOOGLE_CLIENT_SECRET);
export const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ code: 1, message: "Thiếu token đăng nhập" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        const user = await UserModel.findById(decoded.id);
        if (!user || !user.active) {
            return res.status(403).json({ code: 2, message: "Tài khoản không hợp lệ" });
        }
        return res.status(200).json({
            code: 0,
            message: "Xác thực thành công",
            data: toUserDTO(user),
        });
    }
    catch (err) {
        return res.status(401).json({ code: 3, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
export const register = async (req, res) => {
    try {
        const { fullname, email, password, gender } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ code: 1, message: "Email đã được đăng ký" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const barcode = Date.now().toString();
        const barcodeFilename = `barcode-${barcode}.png`;
        const barcodePath = await generateBarcode(barcode, barcodeFilename);
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
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ code: 2, message: "Register failed", error: err.message || err });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(400).json({ code: 2, message: "Email không đúng!" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ code: 1, message: "Mật khẩu không đúng!" });
        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/v1/auth/refresh-token",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 ngày
        });
        return res.status(200).json({
            code: 0,
            message: "Đăng nhập thành công",
            data: {
                accessToken,
                user: toUserDTO(user)
            }
        });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Đăng nhập thất bại", error: err });
    }
};
export const refreshToken = async (req, res) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!token) {
        return res.json({
            code: 1,
            message: "Không tìm thấy refresh token, vui lòng đăng nhập lại",
            data: null
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user)
            return res.status(403).json({ code: 2, message: "User not found" });
        const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        return res.json({
            code: 0,
            message: "Refresh thành công",
            data: { accessToken: newAccessToken }
        });
    }
    catch (err) {
        return res.status(401).json({ code: 3, message: "Refresh token hết hạn" });
    }
};
export const googleLogin = async (req, res) => {
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
            const barcode = Date.now().toString();
            const barcodeFilename = `barcode-${barcode}.png`;
            const barcodePath = await generateBarcode(barcode, barcodeFilename);
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
        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/v1/auth/refresh-token",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 ngày
        });
        return res.status(200).json({
            code: 0,
            message: "Đăng nhập thành công",
            data: {
                accessToken,
                user: toUserDTO(user)
            }
        });
    }
    catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ code: 1, message: "Đăng nhập Google thất bại", error: err.message });
    }
};
export const forgotPassword = async (req, res) => {
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
    }
    catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({
            code: 500,
            message: "Có lỗi xảy ra khi xử lý yêu cầu",
            error: err,
        });
    }
};
export const resetPassword = async (req, res) => {
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
    }
    catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({
            code: 500,
            message: "Có lỗi xảy ra khi xử lý yêu cầu",
            error: err,
        });
    }
};
export const updateAccount = async (req, res) => {
    const userId = req.user.id;
    const updated = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updated) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ code: 200, message: "Update success", data: toUserDTO(updated) });
};
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user)
        return res.status(404).json({ code: 404, message: "Not found" });
    res.json({ code: 0, data: toUserDTO(user) });
};
export const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(userId);
    if (!user)
        return res.status(404).json({ code: 404, message: "User not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
        return res.status(401).json({ code: 401, message: "Wrong old password" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ code: 200, message: "Password updated" });
};
export const logout = (req, res) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/api/v1/auth/refresh-token',
    });
    return res.status(200).json({ code: 0, message: "Đăng xuất thành công" });
};
//# sourceMappingURL=auth.controller.js.map