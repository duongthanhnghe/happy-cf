import type { Request, Response } from "express"
import { UserModel } from "../../models/v1/user.entity"
import { OrderEntity } from "../../models/v1/order.entity"
import type { Types } from "mongoose";
import { toOrderDTO } from "../../mappers/v1/order.mapper"
import { ORDER_STATUS } from "../../shared/constants/order-status";
import { PaymentTransactionEntity } from "../../models/v1/payment-transaction.entity";
import { PAYMENT_TRANSACTION_STATUS } from "../../shared/constants/payment-transaction-status"
import { PAYMENT_METHOD_STATUS } from "../../shared/constants/payment-method-status"
import path from "path";
import fs from "fs";
import { VoucherEntity } from "../../models/v1/voucher.entity";
import { VoucherUsageEntity } from "../../models/v1/voucher-usage.entity";

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderEntity.findById(req.params.id)
      .populate("paymentId")
      .populate("status")
      .populate("userId")
      .populate({ path: "transaction", model: "PaymentTransaction" })
      .populate({
        path: "cartItems.idProduct",
        model: "Product",
        select: "productName image",
      });

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
      cancelRequested: false,
    })

    //tao log voucher
    if (Array.isArray(data.voucherUsage) && data.voucherUsage.length > 0 && userId) {
      for (const v of data.voucherUsage) {
        const voucher = await VoucherEntity.findOne({ code: v.code });
        if (!voucher) continue;

        await VoucherUsageEntity.create({
          voucherId: voucher._id,
          userId: userId || null,
          orderId: newOrder._id,
          code: v.code,
          type: v.type,
          discount: v.discount || 0,
          applicableProducts: v.applicableProducts || [],
          expiresAt: v.expiresAt,
          stackable: v.stackable,
          meta: {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
          },
        });

        // Cập nhật lượt dùng
        voucher.usedCount = (voucher.usedCount || 0) + 1;

        // Kiểm tra xem user đã sử dụng voucher này chưa
        const exists = voucher.usedBy?.some(
          (u) => u.userId?.toString() === userId.toString()
        );

        if (exists) {
          await VoucherEntity.updateOne(
            { code: v.code },
            {
              $inc: {
                usedCount: 1,
                "usedBy.$[u].count": 1,
              },
            },
            {
              arrayFilters: [{ "u.userId": userId }],
            }
          );
        } else {
          // Nếu chưa có user trong usedBy → thêm mới
          await VoucherEntity.updateOne(
            { code: v.code },
            {
              $inc: { usedCount: 1 },
              $push: { usedBy: { userId, count: 1 } },
            }
          );
        }

        // disable voucher luon neu hết lượt
        if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
          voucher.isActive = false;
        }
        await voucher.save();
      }
    }

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

 export const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const statusId = req.query.statusId as string | null;

    const filter: any = { userId };

    if (statusId) {
      filter.status = statusId;
    }

    const skip = (page - 1) * limit;

    const total = await OrderEntity.countDocuments(filter);

    const orders = await OrderEntity.find(filter)
      .populate("paymentId")
      .populate("status")
      .populate("userId")
      .populate({
        path: "cartItems.idProduct",
        model: "Product",
        select: "image productName"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      code: 0,
      data: orders.map(toOrderDTO),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};


export const getRewardHistoryByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);

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

    // Bỏ qua giao dịch ra
    if (transferType !== "in") {
      return res.status(200).json({ success: true }); 
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


const tokenCachePath = path.resolve("./storage/vtp_token_cache.json");

export const getViettelToken = async (): Promise<string> => {
  try {
    // 1️⃣ Đọc token từ cache nếu còn hạn
    if (fs.existsSync(tokenCachePath)) {
      const { token, expiresAt } = JSON.parse(fs.readFileSync(tokenCachePath, "utf-8"));
      if (Date.now() < expiresAt) {
        return token;
      }
    }

    // 2️⃣ Token hết hạn → gọi API login
    const response = await fetch("https://partner.viettelpost.vn/v2/user/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        USERNAME: process.env.VTP_USERNAME || "0365305920",
        PASSWORD: process.env.VTP_PASSWORD || "Evaadam@120796",
      }),
    });

    const data = await response.json();

    if (!data.data?.token) {
      throw new Error("Không lấy được token mới từ Viettel Post");
    }

    const newToken = data.data.token;

    // 3️⃣ Lưu token vào cache (12 tiếng)
    fs.writeFileSync(
      tokenCachePath,
      JSON.stringify({
        token: newToken,
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
      })
    );

    return newToken;
  } catch (err: any) {
    console.error("❌ getViettelToken error:", err.message);
    throw err;
  }
};

export const getShippingFee = async (req: Request, res: Response) => {
  try {
    const {
      PRODUCT_WEIGHT,
      PRODUCT_PRICE,
      MONEY_COLLECTION,
      SENDER_PROVINCE,
      SENDER_DISTRICT,
      RECEIVER_PROVINCE,
      RECEIVER_DISTRICT,
    } = req.body

    if (
      !PRODUCT_WEIGHT ||
      !SENDER_PROVINCE ||
      !SENDER_DISTRICT ||
      !RECEIVER_PROVINCE ||
      !RECEIVER_DISTRICT
    ) {
      return res.status(400).json({
        code: 1,
        message: "Missing required fields",
        data: null
      })
    }

    const body = {
      PRODUCT_WEIGHT: Number(PRODUCT_WEIGHT),
      PRODUCT_PRICE: Number(PRODUCT_PRICE) || 0,
      MONEY_COLLECTION: Number(MONEY_COLLECTION) || 0,
      ORDER_SERVICE_ADD: "",
      ORDER_SERVICE: "VCBO",
      SENDER_PROVINCE: Number(SENDER_PROVINCE),
      SENDER_DISTRICT: Number(SENDER_DISTRICT),
      RECEIVER_PROVINCE: Number(RECEIVER_PROVINCE),
      RECEIVER_DISTRICT: Number(RECEIVER_DISTRICT),
      PRODUCT_TYPE: "HH",
      NATIONAL_TYPE: 1,
      PRODUCT_LENGTH: 0,
      PRODUCT_WIDTH: 0,
      PRODUCT_HEIGHT: 0,
    }

    const token = await getViettelToken();

    const response = await fetch("https://partner.viettelpost.vn/v2/order/getPrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": token || ""
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()
    
    if (!response.ok || result.error || result.status !== 200) {
      console.error("❌ ViettelPost API Error:", result)
      return res.status(400).json({ 
        code: 1,
        message: result.message || "Error fetching fee from Viettel Post",
        data: result || null
      })
    }

    return res.json({
      code: 0,
      message: "Success",
      data: result.data
    })

  } catch (err: any) {
    console.error("❌ getShippingFee error:", err.message)
    console.error("Stack trace:", err.stack)
    res.status(500).json({
      code: 1,
      message: "Internal Server Error",
      data: null
    })
  }
}

export const cancelOrderByUser = async (req: Request, res: Response) => {
  try {
    const { orderId,userId } = req.body;

    if (!userId) {
      return res.status(401).json({ code: 1, message: "Unauthorized" });
    }

    if (!orderId) {
      return res.status(400).json({ code: 1, message: "Thiếu orderId" });
    }

    const order = await OrderEntity.findById(orderId)

    if (!order) {
      return res.status(404).json({ code: 1, message: "Đơn hàng không tồn tại" });
    }

    if (order.cancelRequested) {
      return res.status(400).json({ code: 1, message: "Đơn hàng da duoc gui yeu cau huy don" });
    }

    if (!order.userId || order.userId?.toString() !== userId) {
      return res.status(403).json({ code: 1, message: "Bạn không có quyền hủy đơn này" });
    }

    if (order.status && [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED, ORDER_STATUS.CONFIRMED].includes(order.status.toString())) {
      return res.status(400).json({ code: 1, message: "Đơn hàng này không thể hủy" });
    }

    order.cancelRequested = true;
    await order.save();

    return res.json({
      code: 0,
      message: "Yêu cầu hủy đơn hàng đã được gửi đến admin",
      data: order
    });

  } catch (err: any) {
    console.error("Lỗi cancelOrderByUser:", err);
    return res.status(500).json({ code: 1, message: err.message || "Internal Server Error" });
  }
};

export const getPendingRewardPoints = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ code: 1, message: "Thiếu userId" });
    }

    const orders = await OrderEntity.find({
      userId,
      "reward.points": { $gt: 0 },
      "reward.awarded": false
    }).select("reward.points");

    const totalPendingPoints = orders.reduce((sum, order: any) => {
      return sum + (order.reward?.points || 0);
    }, 0);

    return res.json({
      code: 0,
      data: {
        totalPendingPoints,
        orders: orders.length
      }
    });

  } catch (error: any) {
    console.error("Lỗi getPendingRewardPoints:", error);
    return res.status(500).json({ code: 1, message: error.message });
  }
};
