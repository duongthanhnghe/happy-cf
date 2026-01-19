import type { Request, Response } from "express"
import { PaymentTransactionEntity } from "../../models/v1/payment-transaction.entity"
import { toPaymentTransactionDTO } from "../../mappers/v1/payment-transaction.mapper"

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
