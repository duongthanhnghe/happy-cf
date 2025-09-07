import type { Request, Response } from "express"
import { UserModel } from "../models/UserEntity"
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../models/OrderEntity"
import { MembershipLevelModel } from "../models/MembershipLevelEntity"
import type { MembershipLevel } from "@/server/types/dto/user.dto"
import { toOrderDTO, toOrderListDTO, toOrderStatusListDTO, toPaymentListDTO } from "../mappers/orderMapper"

export const getAllOrder = async (_: Request, res: Response) => {
  try {
    const orders = await OrderEntity.find()
      .populate('cartItems.idProduct').populate("paymentId").populate("status").sort({ createdAt: -1 });
    return res.json({ code: 0, data: toOrderListDTO(orders) })
  } catch (err: any) {
    console.error('Get orders error:', err)
    res.status(500).json({
      code: 1,
      message: err.message || 'Internal Server Error',
      data: [],
    })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderEntity.findById(req.params.id).populate("paymentId").populate("status");
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
    const { data, userId, point } = req.body

    if (!data?.fullname || !data?.phone || !data?.paymentId || !data?.cartItems) {
      return res.status(400).json({ code: 1, message: "Dữ liệu đơn hàng không hợp lệ" })
    }

    const newOrder = await OrderEntity.create({ ...data, userId })

    let membershipUpdate = null
    if (userId && typeof point === "number" && point > 0) {
      membershipUpdate = await setPointAndUpgrade(userId, point)
    }

    return res.status(201).json({
      code: 0,
      message: "Đặt hàng thành công",
      data: toOrderDTO(newOrder),
      membership: membershipUpdate,
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

  const newLevel = levels
    .filter((level) => newPoint >= level.minPoint)
    .sort((a, b) => b.minPoint - a.minPoint)[0]

  const levelChanged = newLevel && user.membership?.level !== newLevel.name

  if (newLevel) user.membership.level = newLevel.name as MembershipLevel
  user.membership.point = newPoint

  await user.save()

  return {
    level: user.membership.level,
    point: user.membership.point,
    levelChanged,
  }
}