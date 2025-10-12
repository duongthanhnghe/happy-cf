import type { Request, Response } from "express"
import { UserModel } from "../models/UserEntity"
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../models/OrderEntity"
import { MembershipLevelModel } from "../models/MembershipLevelEntity"
import type { MembershipLevel } from "@/server/types/dto/user.dto"
import type { Types } from "mongoose";
import { toOrderDTO, toOrderListDTO, toOrderStatusListDTO, toPaymentListDTO } from "../mappers/orderMapper"
import { ORDER_STATUS } from "../shared/constants/order-status";
import { ProductReviewEntity } from "../models/ProductReviewEntity";
import { PaymentTransactionEntity } from "../models/PaymentTransactionEntity";
import { PAYMENT_TRANSACTION_STATUS } from "../shared/constants/payment-transaction-status"
import { PAYMENT_METHOD_STATUS } from "../shared/constants/payment-method-status"

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

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { data, userId, point, usedPoint } = req.body

    if (!data?.fullname || !data?.phone || !data?.paymentId || !data?.cartItems) {
      return res.status(400).json({ code: 1, message: "Dữ liệu đơn hàng không hợp lệ" })
    }

    let membershipDiscountRate = 0
    let membershipDiscountAmount = 0

    if (userId) {
      const user = await UserModel.findById(userId)
      if (user) {
        membershipDiscountRate = user.membership.discountRate || 0

        if (membershipDiscountRate > 0) {
          membershipDiscountAmount = Math.floor(data.totalPriceCurrent * (membershipDiscountRate / 100))
          // cập nhật lại totalPriceDiscount trước khi tính tiếp
          data.totalPriceDiscount = data.totalPriceCurrent - membershipDiscountAmount
        }
      }
    }

    let deductedPoints = 0;

    // ✅ Nếu có user và muốn dùng điểm
    if (userId && usedPoint && usedPoint > 0) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ code: 1, message: "Không tìm thấy user" });
      }

      if (user.membership.balancePoint < usedPoint) {
        return res.status(400).json({ code: 1, message: "Điểm tích lũy không đủ" });
      }

      // ✅ Trừ điểm từ balancePoint trong DB
      user.membership.balancePoint -= usedPoint;
      await user.save();

      deductedPoints = usedPoint;
    }

    const newOrder = await OrderEntity.create({
      ...data,
      userId,
      reward: { points: point || 0, awarded: false, awardedAt: null },
      usedPoints: deductedPoints,
      pointsRefunded: false,
      membershipDiscountRate,
      membershipDiscountAmount,
    })

    return res.status(201).json({
      code: 0,
      message: "Đặt hàng thành công",
      data: toOrderDTO(newOrder),
    })
  } catch (err: any) {
    console.error("Lỗi createOrder:", err)
    return res.status(500).json({ code: 2, message: "Lỗi server" })
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

export const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const orders = await OrderEntity.find({ userId: req.params.userId }).populate("paymentId").populate("status").sort({ createdAt: -1 });
    return res.json({ code: 0, data: orders.map(toOrderDTO) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

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

    if (order.status?.toString() === ORDER_STATUS.COMPLETED || order.status?.toString() === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({
        code: 1,
        message: "Đơn hàng đã hoàn tất hoặc đã hủy, không thể thay đổi trạng thái nữa"
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

    if (status.id === ORDER_STATUS.CANCELLED && order.userId && order.usedPoints > 0) {
      if (!order.pointsRefunded) {
        const user = await UserModel.findById(order.userId);
        if (user) {
          user.membership.balancePoint += order.usedPoints;
          await user.save();

          order.pointsRefunded = true; // đánh dấu đã hoàn rồi
        }
      }
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
  } 
  user.membership.point = newPoint
  user.membership.balancePoint = newBalancePoint

  await user.save()

  return {
    level: user.membership.level,
    point: user.membership.point,
    balancePoint: user.membership.balancePoint,
    discountRate: user.membership.discountRate,
    levelChanged,
  }
}

export const getRewardHistoryByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);

    // 👉 Lấy tất cả order có liên quan đến điểm
    const query = {
      userId,
      $or: [
        { "reward.points": { $gt: 0 } },   // có thưởng điểm
        { usedPoints: { $gt: 0 } },        // có sử dụng điểm
        { pointsRefunded: true }           // có hoàn điểm
      ]
    };

    const result = await OrderEntity.paginate(query, {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        { path: "paymentId", model: "Payment" },
        { path: "status", model: "OrderStatus" },
        { path: "transaction", model: "PaymentTransaction" }
      ]
    });

    const history = result.docs.map((order: any) => {
      let historyType = "";
      let points = 0;

      if (order.usedPoints > 0 && order.pointsRefunded) {
        historyType = "refunded";   // đã hoàn điểm
        points = order.usedPoints;
      } else if (order.usedPoints > 0) {
        historyType = "used";      // đã dùng điểm
        points = order.usedPoints;
      } else if (order.reward.points > 0 && order.reward.awarded) {
        historyType = "earned";    // đã được cộng điểm
        points = order.reward.points;
      } else if (order.reward.points > 0 && !order.reward.awarded) {
        historyType = "pending_reward"; // chờ cộng điểm
        points = order.reward.points;
      } else {
        historyType = "none"; // không có biến động điểm
      }

      return {
        orderId: order._id,
        code: order.code,
        createdAt: order.createdAt,
        historyType,
        points,
        order: toOrderDTO(order)
      };
    });

    return res.json({
      code: 0,
      data: history,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (err: any) {
    console.error("Lỗi getRewardHistoryByUserId:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};


export const checkPoint = async (req: Request, res: Response) => {
  try {
    const { userId, usedPoint, orderTotal } = req.body;

    if (!userId || !usedPoint || !orderTotal) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
    }

    const user = await UserModel.findById(userId).select("membership.balancePoint");
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user" });
    }

    const balancePoint = user.membership.balancePoint || 0;
    const maxPointAllow = Math.floor(orderTotal * 0.1); // toi da 10%

    if (usedPoint > balancePoint) {
      return res.json({
        code: 2,
        message: "Số điểm bạn có không đủ để sử dụng",
      });
    }

    if (usedPoint > maxPointAllow) {
      return res.json({
        code: 1,
        message: `Bạn chỉ được sử dụng tối đa ${maxPointAllow} điểm cho đơn hàng này`,
      });
    }

    return res.json({
      code: 0,
      data: { appliedPoint: usedPoint },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const sepayCallback = async (req: Request, res: Response) => {
  try {

    const authHeader = req.headers["authorization"];
    const expectedApiKey = `Apikey ${process.env.SEPAY_WEBHOOK_API_KEY}`;
    if (authHeader !== expectedApiKey) {
      console.error("Invalid API Key in webhook");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { 
      transferType,      // in | out
      transferAmount,    // số tiền
      transferContent,   // nội dung CK
      referenceNumber,   // mã giao dịch ngân hàng
    } = req.body;

    if (transferType !== "in") {
      return res.status(200).json({ success: true }); // Bỏ qua giao dịch ra
    }

    const orderCodeMatch = transferContent.match(/ORDER\d+/);
    if (!orderCodeMatch) {
      console.error("❌ Cannot parse order code");
      return res.status(200).send("OK");
    }

    const orderCode = orderCodeMatch[0];
    const order = await OrderEntity.findOne({ code: orderCode })
      .populate({ path: "transaction", model: "PaymentTransaction" });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Kiểm tra đã xử lý chưa
    if (order.transaction && (order.transaction as any).status === PAYMENT_TRANSACTION_STATUS.PAID) {
      return res.status(200).json({ success: true, message: "Already processed" });
    }

    // Kiểm tra số tiền
    if (transferAmount < order.totalPrice) {
      return res.status(200).json({ success: false, message: "Amount mismatch" });
    }

    console.log("✅ Payment successful");

    // Tạo transaction
    const transaction = await PaymentTransactionEntity.create({
      orderId: order._id,
      transactionId: referenceNumber,
      amount: transferAmount,
      method: PAYMENT_METHOD_STATUS.BANK,
      status: PAYMENT_TRANSACTION_STATUS.PAID,
    });

    order.transaction = transaction._id as Types.ObjectId;

    // Cập nhật status = COMPLETED
    // const completedStatus = await OrderStatusEntity.findOne({ 
    //   id: ORDER_STATUS.COMPLETED 
    // });
    
    // if (completedStatus) {
    //   order.status = completedStatus._id;
      
    //   // Cộng điểm
    //   if (order.userId && !order.reward.awarded) {
    //     await setPointAndUpgrade(order.userId.toString(), order.reward.points);
    //     order.reward.awarded = true;
    //     order.reward.awardedAt = new Date();
    //   }
    // }

    await order.save();

    return res.status(200).json({ success: true });
    
  } catch (err) {
    console.error("💥 Webhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
};