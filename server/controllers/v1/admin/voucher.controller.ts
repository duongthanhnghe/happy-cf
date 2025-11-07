import type { Request, Response } from "express"
import { VoucherEntity } from "../../../models/v1/voucher.entity"
import { toVoucherDTO } from "../../../mappers/v1/voucher.mapper"
import { VoucherUsageEntity } from "../../../models/v1/voucher-usage.entity"

export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10 } = req.query

    const numPage = Number(page)
    const numLimit = Number(limit)

    if (numLimit === -1) {
      const vouchers = await VoucherEntity.find().sort({ createdAt: -1 })
      return res.json({
        code: 0,
        data: vouchers.map(toVoucherDTO),
        pagination: {
          page: 1,
          limit: vouchers.length,
          totalPages: 1,
          total: vouchers.length
        }
      })
    }

    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 }
    }

    const result = await VoucherEntity.paginate({}, options)

    return res.json({
      code: 0,
      data: result.docs.map(toVoucherDTO),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: "Lỗi lấy danh sách voucher", error: err.message })
  }
}

export const getVoucherById = async (req: Request, res: Response) => {
  try {
    const voucher = await VoucherEntity.findById(req.params.id)
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher không tồn tại" })
    }
    return res.json({ code: 0, data: toVoucherDTO(voucher) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const exists = await VoucherEntity.findOne({ code: req.body.code })
    if (exists) {
      return res.status(400).json({ code: 1, message: "Mã voucher đã tồn tại" })
    }

    const voucher = new VoucherEntity(req.body)
    await voucher.save()

    return res.json({
      code: 0,
      message: "Tạo voucher thành công",
      data: toVoucherDTO(voucher)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const updateVoucher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const voucher = await VoucherEntity.findById(id)
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher không tồn tại" })
    }

    const now = new Date()

    // Voucher đã hết hạn
    if (voucher.endDate < now) {
      return res.status(400).json({ code: 1, message: "Voucher đã hết hạn, không thể cập nhật" })
    }

    // Nếu voucher đang hoạt động hoặc đã có người dùng → hạn chế update
    if (voucher.usedCount > 0 || (voucher.startDate <= now && voucher.endDate >= now)) {
      const allowedFields = ["isActive", "name", "description"]
      const filteredData = Object.keys(updateData)
        .filter((k) => allowedFields.includes(k))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key]
          return obj
        }, {})

      const updated = await VoucherEntity.findByIdAndUpdate(id, filteredData, { new: true })
      return res.json({
        code: 0,
        message: "Cập nhật thành công",
        data: toVoucherDTO(updated!)
      })
    }

    // Nếu chưa bắt đầu → cho cập nhật toàn bộ
    const updated = await VoucherEntity.findByIdAndUpdate(id, updateData, { new: true })
    return res.json({
      code: 0,
      message: "Cập nhật voucher thành công",
      data: toVoucherDTO(updated!)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const voucher = await VoucherEntity.findById(id)

    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher không tồn tại" })
    }

    const now = new Date()

    // vô hiệu hóa thay vì xóa
    if (voucher.usedCount > 0 || voucher.startDate <= now) {
      voucher.isActive = false
      await voucher.save()

      return res.json({
        code: 0,
        message: "Voucher đã được sử dụng hoặc đang hoạt động — chuyển sang trạng thái vô hiệu hóa"
      })
    }

    // Có thể xóa hẳn
    await VoucherEntity.findByIdAndDelete(id)
    return res.json({ code: 0, message: "Xóa voucher thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const toggleActiveVoucher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const voucher = await VoucherEntity.findById(id)
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher không tồn tại" })
    }

    const now = new Date()

    // Voucher đã hết hạn thì không thể bật lại
    if (voucher.endDate < now) {
      return res.status(400).json({
        code: 1,
        message: "Voucher đã hết hạn, không thể thay đổi trạng thái",
      })
    }

    // Đảo trạng thái hoạt động
    voucher.isActive = !voucher.isActive
    await voucher.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái hoạt động thành công",
      data: toVoucherDTO(voucher),
    })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message || "Lỗi khi cập nhật trạng thái voucher",
    })
  }
}