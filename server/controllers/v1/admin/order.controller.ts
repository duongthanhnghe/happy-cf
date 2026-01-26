import type { Request, Response } from "express"
import { UserModel } from "../../../models/v1/user.entity"
import { OrderEntity, OrderShippingEntity, OrderStatusEntity, PaymentEntity, ShippingProviderEntity } from "../../../models/v1/order.entity"
import { MembershipLevelModel } from "../../../models/v1/membership-level.entity"
import type { MembershipLevel } from "@/server/types/dto/v1/user.dto"
import { toOrderDTO, toOrderExport, toOrderListDTO, toOrderShippingDTO, toOrderStatusListDTO, toPaymentDTO, toPaymentListDTO, toShippingProviderDTO, toShippingProviderListDTO } from "../../../mappers/v1/order.mapper"
import { ORDER_STATUS } from "../../../shared/constants/order-status";
import { ProductReviewEntity } from "../../../models/v1/product-review.entity";
import { VoucherEntity } from "../../../models/v1/voucher.entity";
import { VoucherUsageEntity } from "../../../models/v1/voucher-usage.entity";
import mongoose from "mongoose";
import { restoreStockOrder } from "../../../utils/restoreStockOrder"
import XLSX from "xlsx";
import { buildVietQR } from "../../../utils/qrcode-payment"
import { buildBillHTML } from "../../../utils/print-bill"
import { createProductReviewEntity } from "../../../factories/v1/product-review.factory"
import { PromotionGiftEntity } from "@/server/models/v1/promotion-gift.entity"
import { PromotionGiftUsageEntity } from "@/server/models/v1/promotion-gift-usage.entity"

export const getAllOrder = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10, fromDate, toDate, search, statusId, transactionId, shippingStatus } = req.query;

    const numPage = Number(page);
    let numLimit = Number(limit);

    const filter: any = {};

    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);

      if (toDate) {
        const endDate = new Date(toDate as string);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    if (search) {
      const keyword = search.toString().trim();
      filter.$or = [
        { code: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
        { fullname: { $regex: keyword, $options: "i" } }
      ];
    }

    if (statusId) {
      filter.status = statusId;
    }

    let transactionMatch: any = {};

    if (transactionId) {
      transactionMatch.status = transactionId;
    }

    let shippingMatch: any = {};

    if (shippingStatus) {
      shippingMatch.status = shippingStatus;
    }

    if (numLimit === -1) {
      const orders = await OrderEntity.find(filter)
        .sort({ createdAt: -1 })
        .populate("paymentId")
        .populate("status")
        .populate("userId")
        .populate({
          path: "transaction",
        })
        .populate({
          path: "cartItems.idProduct",
          model: "Product",
          select: "image productName amount"
        })
        .populate({
          path: "shipping",
          model: "OrderShipping",
          match: shippingMatch,
          populate: {
            path: "providerId",
            model: "ShippingProvider"
          }
        });

      const filtered = transactionId
        ? orders.filter(o => o.transaction !== null)
        : orders;

      return res.json({
        code: 0,
        data: toOrderListDTO(filtered),
        pagination: {
          page: 1,
          limit: filtered.length,
          totalPages: 1,
          total: filtered.length
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
        {
          path: "transaction",
        },
        {
          path: "shipping",
          model: "OrderShipping",
          match: shippingMatch,
          populate: {
            path: "providerId",
            model: "ShippingProvider",
          }
        },
        { path: "cartItems.idProduct", model: "Product", select: "image productName amount" }
      ]
    };

    let result = await OrderEntity.paginate(filter, options);

    if (transactionId) {
      result.docs = result.docs.filter(doc => {
        const transaction = doc.transaction as any
        return transaction && transaction.status === transactionId
      })
    }

    if (shippingStatus) {
      result.docs = result.docs.filter(doc => {
        const shipping = doc.shipping as any
        return shipping && shipping.status === shippingStatus
      })
    }

    const totalFiltered = result.docs.length;

    return res.json({
      code: 0,
      data: toOrderListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(totalFiltered / result.limit),
        total: totalFiltered
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
    const order = await OrderEntity.findById(req.params.id)
      .populate("paymentId")
      .populate("status")
      .populate("userId")
      .populate("transaction")
      .populate({
        path: "shipping",
        model: "OrderShipping",
        populate: {
          path: "providerId",
          model: "ShippingProvider"
        }
      })
      .populate({
        path: "cartItems.idProduct",
        model: "Product",
        select: "productName image amount",
      })
      .populate({
        path: "giftItems.idProduct",
        model: "Product",
        select: "productName image amount",
      });

    if (!order) {
      return res.status(404).json({ code: 1, message: "Order không tồn tại" })
    }

    const promotionGiftUsages = await PromotionGiftUsageEntity.find({
      orderId: order._id,
    })
    .populate("promotionGiftId", "name usageLimit")
    .sort({ usedAt: 1 })
    .lean();

    return res.json({ 
      code: 0,
      data: {
        ...toOrderDTO(order),
        promotionGiftUsages,
      },
    })
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
      console.error(`Lỗi rollback voucher ${vu.code}:`, err);
    }
  }

  await OrderEntity.findByIdAndUpdate(order._id, { voucherRefunded: true });
};

export const rollbackPromotionGiftUsage = async (order: any) => {
  if (!order?._id) return;

  const logs = await PromotionGiftUsageEntity.find({
    orderId: order._id,
    reverted: false,
  });

  if (!logs.length) return;

  const promoCountMap = new Map<string, number>();

  for (const log of logs) {
    const id = log.promotionGiftId.toString();
    promoCountMap.set(id, (promoCountMap.get(id) || 0) + 1);
  }

  for (const [promoId, count] of promoCountMap.entries()) {
    await PromotionGiftEntity.updateOne(
      { _id: promoId, usedCount: { $gte: count } },
      { $inc: { usedCount: -count } }
    );
  }

  await PromotionGiftUsageEntity.updateMany(
    { orderId: order._id, reverted: false },
    { $set: { reverted: true, revertedAt: new Date() } }
  );
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, statusId } = req.body

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

        const reviews = order.cartItems.map(item =>
          createProductReviewEntity({
            orderId: order._id,
            userId: order.userId!,
            productId: item.idProduct as string,
          })
        );

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

    if (status.id === ORDER_STATUS.CANCELLED) {
      // hoàn kho
      if (order.stockDeducted) {
        await restoreStockOrder(order)
        order.stockDeducted = false
      }
      
      if(order.userId){
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

        await user?.save();
      }

      // hoàn lai voucher
      await rollbackVoucherUsage(order)

      // hoàn lai Gift Promotion
      await rollbackPromotionGiftUsage(order)
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

export const toggleActivePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const payment = await PaymentEntity.findById(id)
    if (!payment) {
      return res.status(404).json({
        code: 1,
        message: "Phương thức thanh toán không tồn tại"
      })
    }

    payment.isActive = !payment.isActive
    await payment.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái phương thức thanh toán thành công",
      data: toPaymentDTO(payment)
    })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message
    })
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

export const getOrderCountByStatus = async (req: Request, res: Response) => {
  try {
    const totalCount = await OrderEntity.countDocuments()

    const statuses = await OrderStatusEntity.find().lean()

    const counts = await OrderEntity.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
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
        count: countMap.get(s._id.toString()) ?? 0
      }))

    const result = [
      {
        statusId: "",
        status: "all",
        name: "Tất cả",
        icon: "list_alt",
        index: -1,
        count: totalCount
      },
      ...statusItems
    ]

    return res.json({
      code: 0,
      data: result
    })
  } catch (error) {
    console.error("getOrderCountByStatus error:", error)
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy số lượng đơn hàng theo trạng thái"
    })
  }
}

export const printOrderBill = async (req: Request, res: Response) => {
  try {
    const order = await OrderEntity.findById(req.params.id)
      .populate("paymentId")
      .populate("status")
      .populate("userId")
      .populate({ path: "transaction", model: "PaymentTransaction" })
      .populate({
        path: "cartItems.idProduct",
        model: "Product",
        select: "productName sku",
      })
      .lean()

    if (!order) {
      return res.status(404).send("Order không tồn tại")
    }

    const siteName =
      (req.query.siteName as string) ||
      ""

    const qrUrl = buildVietQR(order)

    const html = buildBillHTML(order, qrUrl, siteName)

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    return res.send(html)
  } catch (err: any) {
    return res.status(500).send(err.message)
  }
}

export const exportOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderEntity.find()
      .populate("paymentId")
      .populate("status")
      .populate("userId")
      .populate({
        path: "transaction",
        model: "PaymentTransaction",
      })
      .populate({
        path: "shipping",
        model: "OrderShipping",
        populate: {
          path: "providerId",
          model: "ShippingProvider",
        },
      })
      .populate({
        path: "cartItems.idProduct",
        model: "Product",
        select: "productName sku",
      })
      .lean();

    if (!orders.length) {
      return res.status(200).json({
        code: 1,
        message: "Không có đơn hàng để export",
      });
    }

    const exportData = orders.map(toOrderExport);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const fileName = `order_export_${Date.now()}.xlsx`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("X-Code", "0");
    res.setHeader("X-Message", "Export orders thành công");

    return res.send(excelBuffer);
  } catch (error: any) {
    console.error("Export orders error:", error);
    return res.status(500).json({
      code: 1,
      message: error.message,
    });
  }
};

export const getAllShippingProviders = async (req: Request, res: Response) => {
  try {
    const { active } = req.query

    const filter: any = {}
    if (active !== undefined) {
      filter.isActive = active === "true"
    }

    const providers = await ShippingProviderEntity
      .find(filter)
      .sort({ name: 1 })

    return res.json({
      code: 0,
      message: "Lấy danh sách đơn vị vận chuyển thành công",
      data: toShippingProviderListDTO(providers)
    })
  } catch (error) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy danh sách đơn vị vận chuyển"
    })
  }
}

export const getShippingProviderDetail = async (req: Request, res: Response) => {
  try {
    const provider = await ShippingProviderEntity.findById(req.params.id)

    if (!provider) {
      return res.status(404).json({
        code: 1,
        message: "Đơn vị vận chuyển không tồn tại"
      })
    }

    return res.json({
      code: 0,
      message: "Lấy chi tiết đơn vị vận chuyển thành công",
      data: toShippingProviderDTO(provider)
    })
  } catch (error) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy chi tiết đơn vị vận chuyển"
    })
  }
}

export const createOrderShipping = async (req: Request, res: Response) => {
  try {
    const { orderId, providerId, trackingCode, shippingFee } = req.body

    if (!orderId || !providerId) {
      return res.status(400).json({
        code: 1,
        message: "Thiếu orderId hoặc providerId"
      })
    }

    const order = await OrderEntity.findById(orderId)
    if (!order) {
      return res.status(404).json({
        code: 1,
        message: "Order không tồn tại"
      })
    }

    // 1 order chỉ có 1 vận đơn
    const existed = await OrderShippingEntity.findOne({ orderId })
    if (existed) {
      return res.status(400).json({
        code: 1,
        message: "Order đã có vận đơn"
      })
    }

    const shipping = await OrderShippingEntity.create({
      orderId,
      providerId,
      trackingCode,
      shippingFee: shippingFee ?? order.shippingFee,
      status: "pending",
      logs: [
        {
          status: "pending",
          description: "Tạo vận đơn",
          time: new Date()
        }
      ]
    })

    // gán vận đơn vào order
    order.shipping = shipping._id
    await order.save()

    return res.json({
      code: 0,
      data: shipping
    })
  } catch (error) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi tạo vận đơn"
    })
  }
}

export const getOrderShippingDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const shipping = await OrderShippingEntity
      .findById(id)
      .populate({
        path: "providerId",
        model: "ShippingProvider"
      })

    if (!shipping) {
      return res.status(404).json({
        code: 1,
        message: "Vận đơn không tồn tại"
      })
    }

    return res.json({
      code: 0,
      message: "Lấy chi tiết vận đơn thành công",
      data: toOrderShippingDTO(shipping)
    })
  } catch (error) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy chi tiết vận đơn"
    })
  }
}

export const updateOrderShippingStatus = async (req: Request, res: Response) => {
  try {
    const { status, statusText } = req.body
    const shipping = await OrderShippingEntity.findById(req.params.id)

    if (!shipping) {
      return res.status(404).json({
        code: 1,
        message: "Vận đơn không tồn tại"
      })
    }

    shipping.status = status
    if (statusText) shipping.statusText = statusText

    if (status === "shipping") {
      shipping.shippedAt = new Date()
    }

    if (status === "delivered") {
      shipping.deliveredAt = new Date()
    }

    shipping.logs.push({
      status,
      description: statusText || "Cập nhật trạng thái",
      time: new Date()
    })

    await shipping.save()

    return res.json({
      code: 0,
      data: shipping
    })
  } catch (error) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi cập nhật trạng thái vận đơn"
    })
  }
}

