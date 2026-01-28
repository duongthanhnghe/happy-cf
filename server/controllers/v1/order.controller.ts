import type { Request, Response } from "express"
import { UserModel } from "../../models/v1/user.entity"
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../../models/v1/order.entity"
import type { Types } from "mongoose";
import { toOrderDTO, toOrderStatusListDTO, toPaymentListDTO } from "../../mappers/v1/order.mapper"
import { ORDER_STATUS } from "../../shared/constants/order-status";
import { PaymentTransactionEntity } from "../../models/v1/payment-transaction.entity";
import { PAYMENT_TRANSACTION_STATUS } from "../../shared/constants/payment-transaction-status"
import { PAYMENT_METHOD_STATUS } from "../../shared/constants/payment-method-status"
import path from "path";
import fs from "fs";
import { VoucherEntity } from "../../models/v1/voucher.entity";
import { VoucherUsageEntity } from "../../models/v1/voucher-usage.entity";
import { checkProductStockService } from "../../utils/productStock"
import { deductStockOrder } from "../../utils/deductStockOrder";
import mongoose from "mongoose";
import { BaseInformationEntity } from "@/server/models/v1/base-information.entity";
import qs from "qs";
import { createSecureHash, sortObject } from "../../utils/vnpay";
import crypto from "crypto";
import { createMomoSignature } from "@/server/utils/momo";
import { PAYMENT_STATUS } from '@/shared/constants/payment-status';
import { ProductEntity } from "@/server/models/v1/product.entity";
import { resolveGiftItems } from "@/server/utils/resolve-gift";
import { PromotionGiftEntity } from "@/server/models/v1/promotion-gift.entity";
import { restoreStockOrder } from "@/server/utils/restoreStockOrder";
import { toCreatePromotionGiftUsageEntity } from "@/server/mappers/v1/promotion-gift-usage.mapper";
import { PromotionGiftUsageEntity } from "@/server/models/v1/promotion-gift-usage.entity";

const siteUrl = process.env.DOMAIN
const paymentResultUrl = `${siteUrl}/payment/result`

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
    const payments = await PaymentEntity.find({ isActive: true })
    return res.json({ code: 0, data: toPaymentListDTO(payments) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderEntity.findById(req.params.id)
      .populate("paymentId")
      .populate("status")
      .populate("userId")
      .populate("transaction")
      .populate({
        path: "cartItems.idProduct",
        model: "Product",
        select: "productName image",
      })
      .populate({
        path: "giftItems.idProduct",
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
  let user: any = null;
  let pointDeducted = false;
  let deductedPoints = 0;

  try {
    const { data, usedPoint } = req.body
    const {
      cartItems,
      giftItems,
      ...orderPayload
    } = data
    const userId = data.userId

    for (const item of data.cartItems) {
      const productId =
        typeof item.idProduct === 'string'
          ? item.idProduct
          : item.idProduct._id

      const result = await checkProductStockService({
        productId,
        sku: item.sku,
        quantity: item.quantity,
      })

      if (!result.ok) {
        return res.status(400).json({
          code: 1,
          message: "Sản phẩm không đủ tồn kho",
          data: {
            productId: item.productId,
            availableStock: result.availableStock,
          },
        })
      }
    }

    if (userId) {
      user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          code: 1,
          message: "Không tìm thấy user",
        });
      }
    }

    let membershipDiscountRate = 0
    let membershipDiscountAmount = 0

    if (user) {
      membershipDiscountRate = user.membership.discountRate || 0

      if (membershipDiscountRate > 0) {
        membershipDiscountAmount = Math.floor(data.totalPriceCurrent * (membershipDiscountRate / 100))
        // cập nhật lại totalPriceDiscount trước khi tính tiếp
        data.totalPriceDiscount = data.totalPriceCurrent - membershipDiscountAmount
      }
    }

    const baseInfo = await BaseInformationEntity.findOne().lean()
    const rewardConfig = baseInfo?.systemConfig?.reward
    const rateUsePoint = rewardConfig?.rateUsePoint || 0
    let earnPoints = 0

    if (usedPoint && usedPoint > 0) {
      if (usedPoint > 0 && !user) {
        return res.status(400).json({
          code: 1,
          message: "Cần đăng nhập để sử dụng điểm"
        })
      }

      if (!rewardConfig?.enableUsePoint) {
        return res.status(400).json({
          code: 1,
          message: "Hệ thống hiện không cho phép sử dụng điểm khi thanh toán",
        });
      }

      if (!rateUsePoint || rateUsePoint <= 0) {
        return res.status(400).json({
          code: 1,
          message: "Hệ thống chưa cấu hình tỉ lệ sử dụng điểm",
        });
      }

      const maxPointCanUse = Math.floor(
        data.totalPriceCurrent * rateUsePoint
      );

      if (usedPoint > maxPointCanUse) {
        return res.status(400).json({
          code: 1,
          message: `Số điểm sử dụng vượt quá giới hạn cho phép (${maxPointCanUse})`,
        });
      }
    }

    // validate voucher
    if (Array.isArray(data.voucherUsage) && data.voucherUsage.length > 0) {
      for (const v of data.voucherUsage) {
        const voucher = await VoucherEntity.findOne({ code: v.code });

        if (!voucher || !voucher.isActive) {
          return res.status(400).json({
            code: 1,
            message: `Voucher ${v.code} không hợp lệ`,
          });
        }

        if (
          voucher.usageLimit > 0 &&
          voucher.usedCount >= voucher.usageLimit
        ) {
          return res.status(400).json({
            code: 1,
            message: `Voucher ${v.code} đã hết lượt`,
          });
        }
      }
    }

    // Nếu có user và muốn dùng điểm
    if (rewardConfig?.enableUsePoint && user && usedPoint && usedPoint > 0) {
      if (user.membership.balancePoint < usedPoint) {
        return res.status(400).json({ code: 1, message: "Điểm tích lũy không đủ" });
      }

      // Trừ điểm từ balancePoint trong DB
      user.membership.balancePoint -= usedPoint;
      deductedPoints = usedPoint;
      pointDeducted = true;
    }

    // Nếu có user và tich điểm
    if (rewardConfig?.enableEarnPoint && user) {
      const rate = user.membership.pointRate || 0
      const orderPayAmount = data.totalPriceCurrent

      if (rate > 0 && orderPayAmount > 0) {
        earnPoints = Math.round(orderPayAmount * (rate / 100))
      }
    }

    // resolved promotion gift
    const resolvedGiftItems = giftItems.length
      ? await resolveGiftItems(giftItems)
      : [];

    const promotionGiftIds = [
      ...new Set(
        resolvedGiftItems
          .map(g => g.promotionGiftId?.toString())
          .filter(Boolean)
      )
    ]

    if (promotionGiftIds.length > 0) {
      const promotions = await PromotionGiftEntity.find({
        _id: { $in: promotionGiftIds },
        isActive: true,
      })

      const promotionMap = new Map(
        promotions.map(p => [p._id.toString(), p])
      )

      for (const promoId of promotionGiftIds) {
        const promotion = promotionMap.get(promoId)

        if (!promotion) {
          return res.status(400).json({
            code: 1,
            message: "CTKM quà tặng không tồn tại hoặc đã bị tắt",
          })
        }

        if (
          promotion.usageLimit > 0 &&
          promotion.usedCount >= promotion.usageLimit
        ) {
          return res.status(400).json({
            code: 1,
            message: `CTKM "${promotion.name}" đã hết lượt`,
          })
        }
      }
    }

    await deductStockOrder([
      ...data.cartItems,
      ...resolvedGiftItems,
    ])

    const newOrder = await OrderEntity.create({
      ...orderPayload,
      cartItems,
      giftItems: resolvedGiftItems,
      userId,
      stockDeducted: true,
      reward: { points: earnPoints || 0, awarded: false, awardedAt: null },
      usedPoints: deductedPoints,
      pointsRefunded: false,
      membershipDiscountRate,
      membershipDiscountAmount,
      cancelRequested: false,
    })

    if (pointDeducted && deductedPoints > 0) {
      await user.save();
    }

    //tao log promotion gift
    if (promotionGiftIds.length > 0) {
      const usageDocs = promotionGiftIds.map(promoId =>
        toCreatePromotionGiftUsageEntity({
          promotionGiftId: promoId,
          orderId: newOrder._id,
          userId,
          ip: req.ip,
          userAgent: req.headers["user-agent"] || "",
        })
      );

      await PromotionGiftUsageEntity.insertMany(usageDocs);

      for (const promoId of promotionGiftIds) {
        const updated = await PromotionGiftEntity.findOneAndUpdate(
          {
            _id: promoId,
            $or: [
              { usageLimit: 0 },
              { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
            ],
          },
          { $inc: { usedCount: 1 } },
          { new: true }
        )

        if (!updated) {
          await restoreStockOrder(newOrder)
          await OrderEntity.deleteOne({ _id: newOrder._id })
          throw new Error("CTKM quà tặng đã hết lượt trong lúc đặt hàng")
        }
      }
    }

    //tao log voucher
    if (Array.isArray(data.voucherUsage) && data.voucherUsage.length > 0) {
      for (const v of data.voucherUsage) {
        let updatedVoucher = await VoucherEntity.findOneAndUpdate(
          {
            code: v.code,
            isActive: true,
            $or: [
              { usageLimit: 0 },
              { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
            ],
            "usedBy.userId": userId,
          },
          {
            $inc: {
              usedCount: 1,
              "usedBy.$.count": 1,
            },
          },
          { new: true }
        );

        if (!updatedVoucher) {
          updatedVoucher = await VoucherEntity.findOneAndUpdate(
            { code: v.code, isActive: true },
            {
              $inc: { usedCount: 1 },
              $push: { usedBy: { userId, count: 1 } },
            },
            { new: true }
          );
        }

        if (!updatedVoucher) {
          throw new Error(`Voucher ${v.code} không thể sử dụng`);
        }

        await VoucherUsageEntity.create({
          voucherId: updatedVoucher._id,
          userId,
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

        if (
          updatedVoucher.usageLimit > 0 &&
          updatedVoucher.usedCount >= updatedVoucher.usageLimit
        ) {
          updatedVoucher.isActive = false;
          await updatedVoucher.save();
        }
      }
    }

    return res.status(201).json({
      code: 0,
      message: "Đặt hàng thành công",
      data: toOrderDTO(newOrder),
    })
  } catch (err: any) {
    console.error("Lỗi createOrder:", err)

    // ROLLBACK POINT
    if (pointDeducted && user) {
      user.membership.balancePoint += deductedPoints;
      await user.save();
    }

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
      .populate("transaction")
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


// const history = result.docs.map((order: any) => {
    //   let historyType = "";
    //   let points = 0;

    //   if (order.usedPoints > 0 && order.pointsRefunded) {
    //     historyType = "refunded";   // đã hoàn điểm
    //     points = order.usedPoints;
    //   } else if (order.usedPoints > 0) {
    //     historyType = "used";      // đã dùng điểm
    //     points = order.usedPoints;
    //   } else if (order.reward.points > 0 && order.reward.awarded) {
    //     historyType = "earned";    // đã được cộng điểm
    //     points = order.reward.points;
    //   } else if (order.reward.points > 0 && !order.reward.awarded) {
    //     historyType = "pending_reward"; // chờ cộng điểm
    //     points = order.reward.points;
    //   } else {
    //     historyType = "none"; // không có biến động điểm
    //   }

    //   return {
    //     orderId: order._id,
    //     code: order.code,
    //     createdAt: order.createdAt,
    //     historyType,
    //     points,
    //     order: toOrderDTO(order)
    //   };
    // });

const buildHistory = (order: any, type: string, points: number) => ({
  orderId: order._id,
  code: order.code,
  createdAt: order.createdAt,
  historyType: type,
  points,
  order: toOrderDTO(order),
});

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

    const history = result.docs.flatMap((order: any) => {
      const records: any[] = [];
      const isCancelled = order.status?.id === ORDER_STATUS.CANCELLED;

      if (order.usedPoints > 0 && order.pointsRefunded) {
        records.push(buildHistory(order, "refunded", order.usedPoints));
      } else if (order.usedPoints > 0) {
        records.push(buildHistory(order, "used", order.usedPoints));
      }

      if (!isCancelled && order.reward?.points > 0) {
        if (order.reward.awarded) {
          records.push(buildHistory(order, "earned", order.reward.points));
        } else {
          records.push(buildHistory(order, "pending_reward", order.reward.points));
        }
      }

      return records;
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

    if (!userId || usedPoint === undefined || orderTotal === undefined) {
      return res.status(400).json({
        code: 1,
        message: "Thiếu dữ liệu",
      });
    }

    const baseInfo = await BaseInformationEntity.findOne().lean();
    const rewardConfig = baseInfo?.systemConfig?.reward;

    if (!rewardConfig?.enableUsePoint) {
      return res.json({
        code: 2,
        message: "Hệ thống hiện không cho phép sử dụng điểm",
      });
    }

    const rateUsePoint = rewardConfig.rateUsePoint || 0;

    if (rateUsePoint <= 0) {
      return res.json({
        code: 3,
        message: "Hệ thống chưa cấu hình tỉ lệ sử dụng điểm",
      });
    }

    const user = await UserModel.findById(userId).select(
      "membership.balancePoint"
    );

    if (!user) {
      return res.status(404).json({
        code: 4,
        message: "Không tìm thấy user",
      });
    }

    const balancePoint = user.membership.balancePoint || 0;

    const maxPointAllow = Math.floor(orderTotal * rateUsePoint);

    if (usedPoint > balancePoint) {
      return res.json({
        code: 5,
        message: "Số điểm bạn có không đủ để sử dụng",
        data: {
          balancePoint,
        },
      });
    }

    if (usedPoint > maxPointAllow) {
      return res.json({
        code: 6,
        message: `Bạn chỉ được sử dụng tối đa ${maxPointAllow} điểm cho đơn hàng này`,
        data: {
          maxPointAllow,
        },
      });
    }

    return res.json({
      code: 0,
      data: {
        appliedPoint: usedPoint,
        maxPointAllow,
        balancePoint,
        rateUsePoint,
      },
    });
  } catch (error) {
    console.error("checkPoint error:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
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
      txnRef: order._id,
      transactionId: referenceNumber,
      amount: transferAmount,
      method: PAYMENT_METHOD_STATUS.VNPAY,
      status: PAYMENT_TRANSACTION_STATUS.PENDING,
    });

    order.transaction = transaction._id as Types.ObjectId;

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
      "reward.awarded": false,
      status: { $ne: ORDER_STATUS.CANCELLED },
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

export const getOrderCountByStatusByUser = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
      })
    }

    const statuses = await OrderStatusEntity.find().lean()

    const counts = await OrderEntity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        }
      }
    ])

    const countMap = new Map(
      counts.map(i => [i._id.toString(), i.count])
    )

    const statusItems = statuses
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map(s => ({
        statusId: s._id.toString(),
        status: s.status,
        name: s.name,
        icon: s.icon,
        index: s.index,
        count: countMap.get(s._id.toString()) ?? 0,
      }))

    const result = [
      ...statusItems,
    ]

    return res.json({
      code: 0,
      data: result,
    })
  } catch (error) {
    console.error("getOrderCountByStatusByUser error:", error)
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy số lượng đơn hàng theo trạng thái",
    })
  }
}

export const createVnpayPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await OrderEntity.findById(orderId);

    if (!order) {
      return res.status(404).json({ code: 1, message: "Order không tồn tại" });
    }

    // const txnRef2 = order._id.toString();

    // const existing = await PaymentTransactionEntity.findOne({ txnRef2 });
    // if (!existing) {
    //   await PaymentTransactionEntity.create({
    //     orderId: order._id,
    //     txnRef: txnRef2,
    //     amount: order.totalPrice,
    //     method: PAYMENT_METHOD_STATUS.VNPAY,
    //     status: PAYMENT_TRANSACTION_STATUS.PENDING,
    //   });
    // }

    await OrderEntity.findByIdAndUpdate(order._id, {
      paymentId: PAYMENT_STATUS.VNPAY
    });

    await PaymentTransactionEntity.findOneAndUpdate(
      {
        orderId: order._id,
        method: PAYMENT_METHOD_STATUS.VNPAY,
      },
      {
        orderId: order._id,
        txnRef: order._id.toString(),
        amount: order.totalPrice,
        method: PAYMENT_METHOD_STATUS.VNPAY,
        status: PAYMENT_TRANSACTION_STATUS.PENDING,
      },
      { upsert: true, new: true }
    );


    const ipAddr =
    (req.headers['cf-connecting-ip'] as string) ||
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    '0.0.0.0';

    const tmnCode = process.env.VNP_TMNCODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const pad = (n: number) => n.toString().padStart(2, "0");

    const now = new Date();
    const createDate =
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());
      
    const txnRef = order._id.toString();

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = txnRef;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${txnRef}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = Math.floor(order.totalPrice * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    // console.log("VNP Params:", vnp_Params);

    vnp_Params = sortObject(vnp_Params);
    
    const signed = createSecureHash(vnp_Params, secretKey);
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

    return res.json({
      code: 0,
      data: { paymentUrl },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 2, message: "Lỗi server" });
  }
};

export const vnpayReturn = async (req: Request, res: Response) => {

  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET!;
    const signed = createSecureHash(vnp_Params, secretKey);

    // console.log("Return - Received Hash:", secureHash);

    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode'];

      const transaction = await PaymentTransactionEntity.findOne({
        orderId
      }).select("_id");

      if (!transaction) {
        return res.redirect(
        `${paymentResultUrl}?message=${encodeURIComponent(
          "Không tìm thấy giao dịch. Vui lòng kiểm tra lại mã đơn hàng."
        )}`
      );
      }

      if (rspCode === '00') {
        return res.redirect(`${paymentResultUrl}?transactionId=${transaction._id}`);
      } else {
        const errorMessages: Record<string, string> = {
          "07": "Giao dịch bị nghi ngờ gian lận. Vui lòng liên hệ ngân hàng.",
          "09": "Thẻ chưa đăng ký Internet Banking. Vui lòng liên hệ ngân hàng để kích hoạt.",
          "10": "Xác thực thông tin thẻ không chính xác quá số lần quy định.",
          "11": "Giao dịch đã hết thời gian thanh toán. Vui lòng thực hiện lại.",
          "12": "Thẻ bị khóa. Vui lòng liên hệ ngân hàng.",
          "13": "Mật khẩu xác thực giao dịch không chính xác.",
          "24": "Bạn đã hủy giao dịch. Vui lòng thử lại nếu muốn tiếp tục thanh toán.",
          "51": "Tài khoản không đủ số dư để thực hiện giao dịch.",
          "65": "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.",
          "75": "Ngân hàng thanh toán đang bảo trì. Vui lòng thử lại sau.",
          "79": "Giao dịch vượt quá số tiền cho phép.",
          "99": "Giao dịch thất bại do lỗi hệ thống. Vui lòng thử lại sau."
        };
        
        const errorMessage =
        errorMessages[rspCode as string] ||
        "Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.";

         return res.redirect(
          `${paymentResultUrl}?transactionId=${transaction._id}&message=${encodeURIComponent(
            errorMessage
          )}`
        );
      }
    } else {
      return res.redirect(
        `${paymentResultUrl}?message=${encodeURIComponent(
          "Xác thực chữ ký không hợp lệ. Vui lòng liên hệ hỗ trợ."
        )}`
      );
    }
  } catch (err) {
    console.error(err);
    return res.redirect(
      `${paymentResultUrl}?message=${encodeURIComponent(
        "Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ hỗ trợ."
      )}`
    );
  }
};

export const vnpayIPN = async (req: Request, res: Response) => {
  try {
    let vnpParams: any = { ...req.query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);

    const checkHash = createSecureHash(
      vnpParams,
      process.env.VNP_HASH_SECRET!
    );

    if (secureHash !== checkHash) {
      return res.json({ RspCode: "97", Message: "Invalid signature" });
    }

    const txnRef = vnpParams["vnp_TxnRef"];
    const rspCode = vnpParams["vnp_ResponseCode"];
    const vnpTransactionNo = vnpParams["vnp_TransactionNo"];
    const vnpAmount = Number(vnpParams["vnp_Amount"]) / 100;

    const transaction = await PaymentTransactionEntity.findOne({ txnRef });

    if (!transaction) {
      return res.json({ RspCode: "01", Message: "Transaction not found" });
    }

    if (transaction.status === PAYMENT_TRANSACTION_STATUS.PAID) {
      return res.json({ RspCode: "00", Message: "Already processed" });
    }

    if (transaction.amount !== vnpAmount) {
      transaction.status = PAYMENT_TRANSACTION_STATUS.FAILED;
      transaction.rawIpn = vnpParams;
      await transaction.save();

      return res.json({ RspCode: "04", Message: "Invalid amount" });
    }

    if (rspCode === "00") {
      transaction.status = PAYMENT_TRANSACTION_STATUS.PAID;
      transaction.vnpTransactionNo = vnpTransactionNo;
      transaction.paidAt = new Date();
      transaction.rawIpn = vnpParams;
      await transaction.save();

      // UPDATE ORDER STATUS
      // await OrderEntity.findByIdAndUpdate(transaction.orderId, {
      //   status: ORDER_STATUS.CONFIRMED,
      // });

    } else {
      transaction.status = PAYMENT_TRANSACTION_STATUS.FAILED;
      transaction.rawIpn = vnpParams;
      await transaction.save();
    }

    return res.json({ RspCode: "00", Message: "Success" });

  } catch (err) {
    console.error("VNPay IPN error:", err);
    return res.json({ RspCode: "99", Message: "Unknown error" });
  }
};

export const createMomoPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await OrderEntity.findById(orderId);

    if (!order) {
      return res.status(404).json({ code: 1, message: "Order không tồn tại" });
    }

    const partnerCode = process.env.MOMO_PARTNER_CODE!;
    const accessKey = process.env.MOMO_ACCESS_KEY!;
    const secretKey = process.env.MOMO_SECRET_KEY!;
    const endpoint = process.env.MOMO_ENDPOINT!;
    const ipnUrl = process.env.MOMO_IPN_URL!;
    const redirectUrl = process.env.MOMO_RETURN_URL!;

    const requestId = order._id.toString();
    const orderIdMomo = order._id.toString();
    const amount = order.totalPrice.toString();
    const orderInfo = `Thanh toán đơn hàng ${orderIdMomo}`;
    const requestType = "captureWallet";
    const extraData = "";

    // await PaymentTransactionEntity.findOneAndUpdate(
    //   { orderId: order._id },
    //   {
    //     orderId: order._id,
    //     txnRef: orderIdMomo,
    //     amount: order.totalPrice,
    //     method: PAYMENT_METHOD_STATUS.MOMO,
    //     status: PAYMENT_TRANSACTION_STATUS.PENDING,
    //   },
    //   { upsert: true }
    // );

    await PaymentTransactionEntity.findOneAndUpdate(
      {
        orderId: order._id,
        method: PAYMENT_METHOD_STATUS.MOMO,
      },
      {
        orderId: order._id,
        txnRef: orderIdMomo,
        amount: order.totalPrice,
        method: PAYMENT_METHOD_STATUS.MOMO,
        status: PAYMENT_TRANSACTION_STATUS.PENDING,
      },
      { upsert: true, new: true }
    );

    await OrderEntity.findByIdAndUpdate(order._id, {
      paymentId: PAYMENT_STATUS.MOMO
    });

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderIdMomo}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = createMomoSignature(rawSignature, secretKey);

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId: orderIdMomo,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.resultCode !== 0 || !result.payUrl) {
      return res.status(400).json({
        code: result.resultCode,
        message: result.message || "Tạo payment thất bại",
      });
    }

    return res.json({
      code: 0,
      data: {
        payUrl: result.payUrl,
      },
    });
  } catch (err) {
    console.error("MoMo create error:", err);
    return res.status(500).json({ code: 3, message: "Server error" });
  }
};

export const momoIPN = async (req: Request, res: Response) => {
  try {
    const secretKey = process.env.MOMO_SECRET_KEY!;
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const checkSignature = createMomoSignature(rawSignature, secretKey);

    if (signature !== checkSignature) {
      console.error("Signature mismatch:", {
        received: signature,
        expected: checkSignature,
      });
      return res.json({ code: 97, message: "Invalid signature" });
    }

    const transaction = await PaymentTransactionEntity.findOne({
      txnRef: orderId,
    });

    if (!transaction) {
      return res.json({ code: 1, message: "Transaction not found" });
    }

    if (transaction.status === PAYMENT_TRANSACTION_STATUS.PAID) {
      return res.json({ code: 0, message: "Already processed" });
    }

    if (resultCode === 0) {
      transaction.status = PAYMENT_TRANSACTION_STATUS.PAID;
      transaction.rawIpn = req.body;
      transaction.paidAt = new Date();
      await transaction.save();

      // ✅ Update order status
      // await OrderEntity.findByIdAndUpdate(transaction.orderId, {
      //   paymentStatus: "PAID",
      //   status: "CONFIRMED", // hoặc status phù hợp logic của bạn
      // });
    } else {
      console.log("IPN resultCode:", resultCode);
      transaction.status = PAYMENT_TRANSACTION_STATUS.FAILED;
      transaction.rawIpn = req.body;
      await transaction.save();
    }

    return res.json({ code: 0, message: "Success" });
  } catch (err) {
    console.error("MoMo IPN error:", err);
    return res.json({ code: 99, message: "Unknown error" });
  }
};

export const momoReturn = async (req: Request, res: Response) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.query;

    const secretKey = process.env.MOMO_SECRET_KEY!;
    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const checkSignature = createMomoSignature(rawSignature, secretKey);

    if (signature !== checkSignature) {
      return res.redirect(
        `${paymentResultUrl}?&message=${encodeURIComponent(
          "Xác thực chữ ký không hợp lệ. Vui lòng liên hệ hỗ trợ."
        )}`
      );
    }

    const transaction = await PaymentTransactionEntity.findOne({
      txnRef: orderId as string,
    });

    if (!transaction) {
      return res.redirect(
        `${paymentResultUrl}?&message=${encodeURIComponent(
          "Không tìm thấy giao dịch. Vui lòng kiểm tra lại mã đơn hàng."
        )}`
      );
    }

    if (transaction.status !== PAYMENT_TRANSACTION_STATUS.PENDING) {
      const statusMessage =
        transaction.status === PAYMENT_TRANSACTION_STATUS.PAID
          ? "Thanh toán thành công! Đơn hàng của bạn đang được xử lý."
          : "Giao dịch đã thất bại trước đó. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.";

      return res.redirect(
        `${paymentResultUrl}?transactionId=${transaction._id}&message=${encodeURIComponent(statusMessage)}`
      );
    }

    if (resultCode === "0") {
      transaction.status = PAYMENT_TRANSACTION_STATUS.PAID;
      transaction.rawIpn = req.query;
      transaction.paidAt = new Date();
      await transaction.save();

      // await OrderEntity.findByIdAndUpdate(transaction.orderId, {
      //   paymentStatus: "PAID",
      //   status: "CONFIRMED",
      // });

      return res.redirect(
        `${paymentResultUrl}?transactionId=${transaction._id}&message=${encodeURIComponent(
          "Thanh toán thành công! Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất."
        )}`
      );
    } else {
      transaction.status = PAYMENT_TRANSACTION_STATUS.FAILED;
      transaction.rawIpn = req.query;
      await transaction.save();

      const errorMessages: Record<string, string> = {
        "1006": "Bạn đã hủy giao dịch. Vui lòng thử lại nếu muốn tiếp tục thanh toán.",
        "1001": "Giao dịch thất bại do lỗi từ MoMo. Vui lòng thử lại sau.",
        "1002": "Giao dịch bị từ chối. Vui lòng kiểm tra số dư hoặc liên hệ MoMo.",
        "1003": "Giao dịch bị hủy do hết thời gian chờ.",
        "1004": "Số tiền giao dịch vượt quá hạn mức cho phép.",
        "1005": "Giao dịch bị từ chối do lý do bảo mật.",
        "1007": "Giao dịch đang được xử lý. Vui lòng đợi trong giây lát.",
        "9000": "Giao dịch bị hủy bởi hệ thống. Vui lòng thử lại.",
      };

      const errorMessage =
        errorMessages[resultCode as string] ||
        (message as string) ||
        "Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.";

      return res.redirect(
        `${paymentResultUrl}?transactionId=${transaction._id}&message=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
  } catch (err) {
    return res.redirect(
      `${paymentResultUrl}?&message=${encodeURIComponent(
        "Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ hỗ trợ."
      )}`
    );
  }
};
