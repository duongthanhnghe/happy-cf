import type { Request, Response } from "express"
import { UserModel } from "../../../models/v1/user.entity"
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../../../models/v1/order.entity"
import { MembershipLevelModel } from "../../../models/v1/membership-level.entity"
import type { MembershipLevel } from "@/server/types/dto/v1/user.dto"
import type { Types } from "mongoose";
import { toOrderDTO, toOrderListDTO, toOrderStatusListDTO, toPaymentListDTO } from "../../../mappers/v1/order.mapper"
import { ORDER_STATUS } from "../../../shared/constants/order-status";
import { ProductReviewEntity } from "../../../models/v1/product-review.entity";
import { PaymentTransactionEntity } from "../../../models/v1/payment-transaction.entity";
import { PAYMENT_TRANSACTION_STATUS } from "../../../shared/constants/payment-transaction-status"
import { PAYMENT_METHOD_STATUS } from "../../../shared/constants/payment-method-status"
import path from "path";
import fs from "fs";
import { VoucherEntity } from "../../../models/v1/voucher.entity";
import { VoucherUsageEntity } from "../../../models/v1/voucher-usage.entity";
import type { Order } from "../../../models/v1/order.entity";
import mongoose from "mongoose";

const VIETTEL_POST_API = "https://partner.viettelpost.vn/v2"

export const getAllOrder = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    const numPage = Number(page);
    let numLimit = Number(limit);

    if (numLimit === -1) {
      const orders = await OrderEntity.find({})
        .sort({ createdAt: -1 })
        .populate("paymentId")
        .populate("status")
        .populate("userId")
        .populate({ path: "transaction", model: "PaymentTransaction" })

      return res.json({
        code: 0,
        data: toOrderListDTO(orders),
        pagination: {
          page: 1,
          limit: orders.length,
          totalPages: 1,
          total: orders.length
        }
      });
    }

    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        { path: "paymentId", model: "Payment" },
        { path: "status", model: "OrderStatus" },
        { path: "userId", model: "User" },
        { path: "transaction", model: "PaymentTransaction" }
      ]
    };

    const result = await OrderEntity.paginate({}, options);

    return res.json({
      code: 0,
      data: toOrderListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: 1, message: "Lỗi lấy danh sách order", error });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderEntity.findById(req.params.id).populate("paymentId").populate("status").populate("userId").populate({ path: "transaction", model: "PaymentTransaction" });
    if (!order) {
      return res.status(404).json({ code: 1, message: "Order không tồn tại" })
    }
    return res.json({ code: 0, data: toOrderDTO(order) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await OrderEntity.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Order không tồn tại" })
    }
    return res.json({ code: 0, message: "Xoá thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const rollbackVoucherUsage = async (order: any) => {
  if (!order?.userId || !Array.isArray(order.voucherUsage)) return;
  if (order.voucherRefunded) return;

  for (const vu of order.voucherUsage) {
    try {
      const voucher = await VoucherEntity.findOne({ code: vu.code });
      if (!voucher) continue;

      // ✅ rollback log
      await VoucherUsageEntity.updateMany(
        { userId: order.userId, orderId: order._id, code: vu.code },
        { $set: { reverted: true, revertedAt: new Date() } }
      );

      const userObjId = new mongoose.Types.ObjectId(order.userId);

      // ✅ rollback usedBy.count nếu user có trong usedBy
      const exists = await VoucherEntity.exists({
        code: vu.code,
        "usedBy.userId": userObjId,
      });

      if (exists && voucher.limitPerUser > 0) {
        await VoucherEntity.updateOne(
          { code: vu.code, "usedBy.userId": userObjId },
          { $inc: { "usedBy.$.count": -1, usedCount: -1 } }
        );
      } else {
        // rollback usedCount tổng
        await VoucherEntity.updateOne(
          { code: vu.code },
          { $inc: { usedCount: -1 } }
        );
      }

    } catch (err) {
      console.error(`❌ Lỗi rollback voucher ${vu.code}:`, err);
    }
  }

  await OrderEntity.findByIdAndUpdate(order._id, { voucherRefunded: true });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, statusId } = req.body

    if (!orderId || !statusId) {
      return res.status(400).json({ code: 1, message: "Thiếu orderId hoặc statusId" })
    }

    const status = await OrderStatusEntity.findById(statusId)
    if (!status) {
      return res.status(404).json({ code: 1, message: "Status không tồn tại" })
    }

    const order = await OrderEntity.findById(orderId)
    if (!order) {
      return res.status(404).json({ code: 1, message: "Order không tồn tại" })
    }

    if (order.cancelRequested && statusId !== ORDER_STATUS.CANCELLED) {
      return res.status(400).json({
        code: 1,
        message: "Khách đang yêu cầu hủy đơn, không thể thay đổi sang trạng thái này"
      })
    }

    if (order.status?.toString() === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({
        code: 1,
        message: "Đơn hàng đã đã hủy, không thể thay đổi trạng thái nữa"
      })
    }

    order.status = statusId

    // Nếu status = COMPLETED → tạo danh sách đánh giá
    if (status.id === ORDER_STATUS.COMPLETED && order.userId) {
      const existingReviews = await ProductReviewEntity.find({ orderId: orderId });

      if (existingReviews.length === 0) {

        const reviews = order.cartItems.map((item: any) => ({
          orderId: orderId,
          userId: order.userId,
          productId: item.idProduct,
          rating: 0,
          comment: null,
          images: [],
          status: "pending",
        }));

        await ProductReviewEntity.insertMany(reviews);
      }
    }

    // Nếu status = done → cộng điểm cho user (nếu chưa cộng)
    if (status.id === ORDER_STATUS.COMPLETED && order.userId && !order.reward.awarded) {
      await setPointAndUpgrade(order.userId.toString(), order.reward.points)
      order.reward.awarded = true
      order.reward.awardedAt = new Date()
      await order.save()
    }

    if (status.id === ORDER_STATUS.CANCELLED && order.userId) {
      const user = await UserModel.findById(order.userId);

      // Refund điểm người dùng
      if (!order.pointsRefunded && order.usedPoints > 0 && user) {
          user.membership.balancePoint += order.usedPoints; // cong lai điểm người dùng
          user.membership.balancePoint -= order.reward.points; // tru di điểm order da cong
          order.pointsRefunded = true;
      }

      // Nếu đơn này từng cộng điểm thưởng → rollback lại
      if (order.reward?.awarded && order.reward.points > 0) {
        await revertPointAndDowngrade(order.userId.toString(), order.reward.points);
        order.reward.awarded = false; 
        order.reward.awardedAt = new Date();
      }

      await rollbackVoucherUsage(order)
      await user?.save();
    }

    await order.save()

    return res.json({ code: 0, message: "Cập nhật status thành công", data: toOrderDTO(order) })
  } catch (err: any) {
    console.error("Lỗi updateOrderStatus:", err)
    return res.status(500).json({ code: 1, message: err.message || "Internal Server Error" })
  }
}

export const getAllStatus = async (_: Request, res: Response) => {
  try {
    const status = await OrderStatusEntity.find().sort({ index: 1 })
    return res.json({ code: 0, data: toOrderStatusListDTO(status) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getAllPayment = async (_: Request, res: Response) => {
  try {
    const payments = await PaymentEntity.find()
    return res.json({ code: 0, data: toPaymentListDTO(payments) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const setPointAndUpgrade = async (userId: string, point: number) => {
  const user = await UserModel.findById(userId)
  if (!user) return null

  const levels = await MembershipLevelModel.find()
  const newPoint = (user.membership?.point || 0) + point
  const newBalancePoint = (user.membership?.balancePoint || 0) + point

  const newLevel = levels
    .filter((level) => newPoint >= level.minPoint)
    .sort((a, b) => b.minPoint - a.minPoint)[0]

  const levelChanged = newLevel && user.membership?.level !== newLevel.name

  if (newLevel){
    user.membership.level = newLevel.name as MembershipLevel
    user.membership.discountRate = newLevel.discountRate ?? 0
    user.membership.pointRate = newLevel.pointRate ?? 0
  } 
  user.membership.point = newPoint
  user.membership.balancePoint = newBalancePoint

  await user.save()

  return {
    level: user.membership.level,
    point: user.membership.point,
    balancePoint: user.membership.balancePoint,
    discountRate: user.membership.discountRate,
    pointRate: user.membership.pointRate,
    levelChanged,
  }
}

export const revertPointAndDowngrade = async (userId: string, pointsToRevert: number) => {

  const user = await UserModel.findById(userId);
  if (!user) return;

  user.membership.point = Math.max(0, user.membership.point - pointsToRevert);

  const newLevel = await MembershipLevelModel
    .findOne({ minPoint: { $lte: user.membership.point } })
    .sort({ minPoint: -1 });

  if (newLevel && newLevel.name !== user.membership.level) {
    user.membership.level = newLevel.name as any;
    user.membership.discountRate = newLevel.discountRate;
    user.membership.pointRate = newLevel.pointRate;
  }

  await user.save();
};