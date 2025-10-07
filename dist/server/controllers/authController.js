import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserEntity.js";
import { MembershipLevelModel } from "../models/MembershipLevelEntity.js";
import { MembershipBenefitModel } from "../models/MembershipBenefitEntity.js";
import { toUserDTO, toUserListDTO } from "../mappers/userMapper.js";
import { generateBarcode } from '../utils/barcodeGenerator.js';
import { sendResetPasswordEmail } from "../utils/mailer.js";
import { randomBytes } from 'crypto';
import { SearchKeywordModel } from "../models/SearchKeywordEntity.js";
import { toSearchKeywordListDTO } from "../mappers/searchKeywordMapper.js";
import { toMembershipLevelListDTO, toMembershipLevelDTO } from "../mappers/membershipLevelMapper.js";
import { toMembershipBenefitDTO, toMembershipBenefitListDTO } from "../mappers/MembershipBenefitMapper.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID, process.env.NUXT_GOOGLE_CLIENT_SECRET);
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
                level: "Bronze",
                point: 0,
                balancePoint: 0,
                membership: 0,
                discountRate: 0,
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
            return res.status(400).json({ code: 2, message: "Email khong dung, vui long nhap lai!" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ code: 1, message: "Mat khau khong dung, vui long nhap lai!" });
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "12h" });
        res.cookie('token', token, {
            httpOnly: true, // FE không đọc trực tiếp
            secure: false, // localhost => false
            sameSite: 'lax', // thử 'none' nếu khác port
            maxAge: 12 * 60 * 60 * 1000,
        });
        res.status(200).json({ code: 0, message: "Đăng nhập thành công", data: { token, user: toUserDTO(user) } });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Đăng nhập thất bại, vui lòng thử lại", error: err });
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
                    level: "Bronze",
                    point: 0,
                    balancePoint: 0,
                    membership: 0,
                    discountRate: 0,
                    joinedAt: new Date(),
                    code: Date.now(),
                    barcode: barcodePath || ""
                }
            });
        }
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 12 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            code: 0,
            message: "Đăng nhập Google thành công",
            data: { token: jwtToken, user: toUserDTO(user) },
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
export const deleteUsers = async (req, res) => {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.json({ code: 200, message: "Delete success" });
};
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role ? parseInt(req.query.role) : undefined;
        const filter = {};
        if (role !== undefined) {
            filter.role = role;
        }
        if (limit === -1) {
            const users = await UserModel.find(filter).sort({ createdAt: -1 });
            return res.status(200).json({
                code: 0,
                data: toUserListDTO(users),
                pagination: {
                    total: users.length,
                    totalPages: 1,
                    page: 1,
                    limit: users.length,
                },
            });
        }
        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
        };
        const result = await UserModel.paginate(filter, options);
        return res.status(200).json({
            code: 0,
            data: toUserListDTO(result.docs),
            pagination: {
                total: result.totalDocs,
                totalPages: result.totalPages,
                page: result.page,
                limit: result.limit,
            },
        });
    }
    catch (error) {
        console.error("getAllUsers error:", error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
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
export const getAllMembershipLevel = async (_, res) => {
    try {
        const data = await MembershipLevelModel.find().populate("benefits");
        return res.status(200).json({
            code: 0,
            data: toMembershipLevelListDTO(data),
        });
    }
    catch (error) {
        console.error("getAllMembershipLevel error:", error);
        return res.status(500).json({
            code: 1,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const getMembershipLevelById = async (req, res) => {
    try {
        const { id } = req.params;
        const level = await MembershipLevelModel.findById(id).populate("benefits");
        if (!level) {
            return res.status(404).json({
                code: 1,
                message: "Membership level không tồn tại",
            });
        }
        return res.json({
            code: 0,
            data: toMembershipLevelDTO(level),
        });
    }
    catch (error) {
        console.error("getMembershipLevelById error:", error);
        return res.status(500).json({
            code: 1,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const updateMembershipLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = await MembershipLevelModel.findByIdAndUpdate(id, updateData, { new: true }).populate('benefits');
        if (!updated) {
            return res.status(404).json({
                code: 1,
                message: 'Membership level not found',
            });
        }
        return res.json({
            code: 0,
            message: 'Membership level updated successfully',
            data: updated,
        });
    }
    catch (error) {
        console.error('updateMembershipLevel error:', error);
        return res.status(500).json({
            code: 1,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
export const setPoint = async (req, res) => {
    const { userId, point } = req.body;
    const user = await UserModel.findById(userId);
    if (!user)
        return res.status(404).json({ code: 1, message: "Không tìm thấy người dùng" });
    user.membership.point = point;
    user.membership.balancePoint = point;
    await user.save();
    res.json({ code: 0, message: "Tích điểm thành công", data: toUserDTO(user) });
};
export const getTopSearchKeyword = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const keywords = await SearchKeywordModel.find()
            .sort({ totalCount: -1 })
            .limit(limit);
        return res.json({
            code: 0,
            data: toSearchKeywordListDTO(keywords),
        });
    }
    catch (error) {
        console.error("getTopSearchKeyword error:", error);
        return res.status(500).json({ code: 1, message: "Internal server error" });
    }
};
export const logSearchKeyword = async (req, res) => {
    var _a;
    try {
        const keyword = (_a = req.body.keyword) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        if (!keyword)
            return res.status(400).json({ code: 1, message: "Keyword required" });
        const now = new Date();
        const existing = await SearchKeywordModel.findOne({ keyword });
        if (existing) {
            existing.totalCount += 1;
            existing.lastSearchTime = now;
            await existing.save();
        }
        else {
            await SearchKeywordModel.create({
                keyword,
                totalCount: 1,
                lastSearchTime: now,
            });
        }
        return res.status(200).json({ code: 0, message: "OK" });
    }
    catch (error) {
        console.error("logSearchKeyword error:", error);
        return res.status(500).json({ code: 1, message: "Internal server error" });
    }
};
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await UserModel.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "User không tồn tại" });
        }
        item.active = !item.active;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toUserDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//benefits
export const createMembershipBenefit = async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const existing = await MembershipBenefitModel.findOne({ name });
        if (existing) {
            return res.status(400).json({ code: 1, message: "Benefit đã tồn tại" });
        }
        const benefit = await MembershipBenefitModel.create({ name, description, icon });
        return res.status(201).json({
            code: 0,
            message: "Tạo benefit thành công",
            data: toMembershipBenefitDTO(benefit),
        });
    }
    catch (err) {
        console.error("createMembershipBenefit error:", err);
        return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
    }
};
export const getAllMembershipBenefits = async (_, res) => {
    try {
        const benefits = await MembershipBenefitModel.find().sort({ createdAt: -1 });
        return res.json({
            code: 0,
            data: toMembershipBenefitListDTO(benefits),
        });
    }
    catch (err) {
        console.error("getAllMembershipBenefits error:", err);
        return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
    }
};
export const getMembershipBenefitById = async (req, res) => {
    try {
        const { id } = req.params;
        const benefit = await MembershipBenefitModel.findById(id);
        if (!benefit)
            return res.status(404).json({ code: 1, message: "Benefit không tồn tại" });
        return res.json({ code: 0, data: toMembershipBenefitDTO(benefit) });
    }
    catch (err) {
        console.error("getMembershipBenefitById error:", err);
        return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
    }
};
export const updateMembershipBenefit = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const benefit = await MembershipBenefitModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!benefit)
            return res.status(404).json({ code: 1, message: "Benefit không tồn tại" });
        return res.json({
            code: 0,
            message: "Cập nhật benefit thành công",
            data: toMembershipBenefitDTO(benefit),
        });
    }
    catch (err) {
        console.error("updateMembershipBenefit error:", err);
        return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
    }
};
export const deleteMembershipBenefit = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await MembershipBenefitModel.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ code: 1, message: "Benefit không tồn tại" });
        return res.json({ code: 0, message: "Xóa benefit thành công" });
    }
    catch (err) {
        console.error("deleteMembershipBenefit error:", err);
        return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
    }
};
//# sourceMappingURL=authController.js.map