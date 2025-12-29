import type { Request, Response } from "express"
import { ImageBlockEntity } from "../../models/v1/image-block.entity"
import {
  toImageBlockDTO,
} from "../../mappers/v1/image-block.mapper"

export const getImageBlocksByPage = async (req: Request, res: Response) => {
  try {
    const { page, positionLimits } = req.query

    if (!page) {
      return res.status(400).json({
        code: 1,
        message: 'Thiếu page',
      })
    }

    let limits: Record<string, number> = {}

    if (positionLimits) {
      try {
        limits = JSON.parse(positionLimits as string)
      } catch {
        return res.status(400).json({
          code: 1,
          message: 'positionLimits không hợp lệ',
        })
      }
    }

    const filter = {
      page,
      isActive: true,
    }

    const items = await ImageBlockEntity
      .find(filter)
      .sort({ position: 1, order: 1 })

    const grouped = items.reduce((acc: any, item) => {
      const pos = item.position
      if (!acc[pos]) acc[pos] = []

      const limit = limits[pos]
      if (!limit || acc[pos].length < limit) {
        acc[pos].push(toImageBlockDTO(item))
      }

      return acc
    }, {})

    return res.json({
      code: 0,
      data: grouped,
    })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message,
    })
  }
}
