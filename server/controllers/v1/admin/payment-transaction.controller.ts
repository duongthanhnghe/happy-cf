import type { Request, Response } from "express"
import { PaymentTransactionEntity } from "../../../models/v1/payment-transaction.entity"
import { toPaymentTransactionDTO, toPaymentTransactionListDTO } from "../../../mappers/v1/payment-transaction.mapper"
import { Types } from "mongoose"

export const getDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const transaction = await PaymentTransactionEntity
      .findById(id)
      .populate({
        path: "orderId",
        select: "code"
      })

    if (!transaction) {
      return res.status(404).json({
        code: 1,
        message: "Không tìm thấy giao dịch"
      })
    }

    res.json({
      code: 0,
      data: toPaymentTransactionDTO(transaction),
      success: true
    })
  } catch (err: any) {
    res.status(500).json({
      code: 1,
      message: err.message,
      success: false
    })
  }
}

export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    let {
      page = 1,
      limit = 10,
      fromDate,
      toDate,
      status,
      method,
      search,
    } = req.query

    const numPage = Number(page)
    const numLimit = Number(limit)

    const filter: any = {}

    if (fromDate || toDate) {
      filter.createdAt = {}

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate as string)
      }

      if (toDate) {
        const endDate = new Date(toDate as string)
        endDate.setHours(23, 59, 59, 999)
        filter.createdAt.$lte = endDate
      }
    }

    if (status) {
      filter.status = status
    }

    if (method) {
      filter.method = method.toString().toLowerCase()
    }

    if (search) {
      const keyword = search.toString().trim()

      const orConditions: any[] = [
        { txnRef: { $regex: keyword, $options: "i" } },
      ]

      if (Types.ObjectId.isValid(keyword)) {
        orConditions.push({ _id: keyword })
        orConditions.push({ orderId: keyword })
      }

      filter.$or = orConditions
    }

    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        {
          path: "orderId",
          select: "_id code",
        },
      ],
    }

    const result = await PaymentTransactionEntity.paginate(filter, options)

    return res.json({
      code: 0,
      data: toPaymentTransactionListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs,
      },
    })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy danh sách giao dịch thanh toán",
    })
  }
}