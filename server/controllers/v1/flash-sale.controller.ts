import type { Request, Response } from "express";
import { FlashSaleEntity } from "../../models/v1/flash-sale.entity";
import { toFlashSaleDTO } from "../../mappers/v1/flash-sale.mapper";

export const getTopPriorityFlashSaleRandom = async (
  req: Request,
  res: Response
) => {
  try {
    const now = new Date()

    const result = await FlashSaleEntity.aggregate([
      {
        $match: {
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now }
        }
      },

      // sort để priority cao nhất lên đầu
      {
        $sort: { priority: -1, createdAt: -1 }
      },

      // gom theo priority
      {
        $group: {
          _id: "$priority",
          flashSales: { $push: "$$ROOT" }
        }
      },

      // lấy group có priority cao nhất
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 1
      },

      // random 1 flash sale trong group
      {
        $project: {
          flashSale: {
            $arrayElemAt: [
              "$flashSales",
              {
                $floor: {
                  $multiply: [
                    { $rand: {} },
                    { $size: "$flashSales" }
                  ]
                }
              }
            ]
          }
        }
      },

      {
        $replaceRoot: { newRoot: "$flashSale" }
      }
    ])

    if (!result.length) {
      return res.json({ code: 0, data: null })
    }

    return res.json({
      code: 0,
      data: toFlashSaleDTO(result[0])
    })
  } catch (err: any) {
    console.error("getTopPriorityFlashSaleRandom error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}
