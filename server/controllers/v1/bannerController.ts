import type { Request, Response } from "express"
import { BannerEntity } from "../../models/v1/BannerEntity"
import { toBannerListDTO } from "../../mappers/v1/bannerMapper"

export const getAllBanners = async (_: Request, res: Response) => {
  try {
    const banners = await BannerEntity.find({ isActive: true }).sort({ order: 1 })
    return res.json({ code: 0, data: toBannerListDTO(banners) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}