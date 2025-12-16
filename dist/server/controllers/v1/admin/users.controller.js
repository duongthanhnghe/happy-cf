import { UserModel } from "../../../models/v1/user.entity.js";
import { MembershipLevelModel } from "../../../models/v1/membership-level.entity.js";
import { MembershipBenefitModel } from "../../../models/v1/membership-benefit.entity.js";
import { toUserDTO, toUserListDTO } from "../../../mappers/v1/user.mapper.js";
import { toMembershipLevelListDTO, toMembershipLevelDTO } from "../../../mappers/v1/membership-level.mapper.js";
import { toMembershipBenefitDTO, toMembershipBenefitListDTO } from "../../../mappers/v1/membership-benefit.mapper.js";
import { OrderEntity } from "../../../models/v1/order.entity.js";
export const deleteUsers = async (req, res) => {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.json({ code: 200, message: "Delete success" });
};
export const getAllUsers = async (req, res) => {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.trim();
        const membershipLevel = req.query.membershipLevel;
        const filter = {};
        if (search) {
            filter.$or = [
                { fullname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        if (membershipLevel) {
            filter["membership.level"] = membershipLevel;
        }
        if (limit === -1) {
            const users = await UserModel
                .find(filter)
                .sort({ createdAt: -1 });
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
        const benefit = await MembershipBenefitModel.findById(id);
        if (!benefit) {
            return res.status(404).json({ code: 1, message: "Benefit không tồn tại" });
        }
        const levelUsing = await MembershipLevelModel.findOne({ benefits: id });
        if (levelUsing) {
            return res.status(400).json({
                code: 1,
                message: `Không thể xóa Benefit vì đang được sử dụng trong cấp độ thành viên "${levelUsing.name}"`,
            });
        }
        await MembershipBenefitModel.findByIdAndDelete(id);
        return res.json({ code: 0, message: "Xóa benefit thành công" });
    }
    catch (err) {
        console.error("deleteMembershipBenefit error:", err);
        return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
    }
};
export const getRewardHistory = async (req, res) => {
    try {
        let { page = 1, limit = 20, userId, search, historyType, fromDate, toDate, } = req.query;
        const numPage = Number(page);
        const numLimit = Number(limit);
        const query = {
            $or: [
                { "reward.points": { $gt: 0 } },
                { usedPoints: { $gt: 0 } },
                { pointsRefunded: true },
            ],
        };
        if (userId) {
            query.userId = userId;
        }
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate)
                query.createdAt.$gte = new Date(fromDate);
            if (toDate)
                query.createdAt.$lte = new Date(toDate);
        }
        if (search) {
            const users = await UserModel.find({
                $or: [
                    { fullname: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ],
            }).select("_id");
            const userIds = users.map(u => u._id);
            if (userIds.length === 0) {
                return res.json({
                    code: 0,
                    data: [],
                    pagination: {
                        page: numPage,
                        limit: numLimit,
                        totalPages: 0,
                        total: 0,
                    },
                });
            }
            query.userId = { $in: userIds };
        }
        const result = await OrderEntity.paginate(query, {
            page: numPage,
            limit: numLimit,
            sort: { createdAt: -1 },
            populate: [
                { path: "userId", model: "User", select: "fullname email phone membership.balancePoint" },
                { path: "paymentId", model: "Payment" },
                { path: "status", model: "OrderStatus" },
                { path: "transaction", model: "PaymentTransaction" },
            ],
        });
        let history = result.docs.map((order) => {
            var _a, _b, _c;
            let type = "";
            let points = 0;
            if (order.usedPoints > 0 && order.pointsRefunded) {
                type = "refunded";
                points = order.usedPoints;
            }
            else if (order.usedPoints > 0) {
                type = "used";
                points = order.usedPoints;
            }
            else if (((_a = order.reward) === null || _a === void 0 ? void 0 : _a.points) > 0 && order.reward.awarded) {
                type = "earned";
                points = order.reward.points;
            }
            else if (((_b = order.reward) === null || _b === void 0 ? void 0 : _b.points) > 0 && !order.reward.awarded) {
                type = "pending_reward";
                points = order.reward.points;
            }
            else {
                type = "none";
            }
            return {
                orderId: order._id,
                code: order.code,
                createdAt: order.createdAt,
                user: order.userId
                    ? {
                        id: order.userId._id,
                        fullname: order.userId.fullname,
                        email: order.userId.email,
                        phone: order.userId.phone,
                        currentPoint: ((_c = order.userId.membership) === null || _c === void 0 ? void 0 : _c.balancePoint) || 0,
                    }
                    : null,
                historyType: type,
                points,
            };
        });
        if (historyType) {
            history = history.filter(item => item.historyType === historyType);
        }
        return res.json({
            code: 0,
            message: "Lấy lịch sử tích điểm thành công",
            data: history,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs,
            },
        });
    }
    catch (err) {
        console.error("💥 getRewardHistory error:", err);
        return res.status(500).json({
            code: 1,
            message: "Lỗi server khi lấy lịch sử tích điểm",
        });
    }
};
//# sourceMappingURL=users.controller.js.map