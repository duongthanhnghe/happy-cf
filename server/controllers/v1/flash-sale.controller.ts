import type { Request, Response } from "express";
import { FlashSaleEntity } from "../../models/v1/flash-sale.entity";
import { toFlashSaleDTO } from "../../mappers/v1/flash-sale.mapper";
import { Types } from "mongoose";

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

export const getFlashSaleById = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params
    const now = new Date()

    const isObjectId = Types.ObjectId.isValid(slug)

    const flashSale = await FlashSaleEntity.findOne({
      ...(isObjectId
        ? { _id: slug }
        : { slug }
      ),
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).lean()

    if (!flashSale) {
      return res.json({ code: 0, data: null })
    }

    return res.json({
      code: 0,
      data: toFlashSaleDTO(flashSale)
    })
  } catch (err: any) {
    console.error("getFlashSaleBySlug error:", err)
    return res.status(500).json({
      code: 1,
      message: err.message || "Server error"
    })
  }
}
