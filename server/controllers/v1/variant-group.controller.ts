import type { Request, Response } from "express";
import { VariantGroupEntity } from "../../models/v1/variant-group.entity";
import { toVariantGroupListDTO } from "../../mappers/v1/variant-group.mapper";
import { Types } from "mongoose";
import { ProductEntity } from "@/server/models/v1/product.entity";

export const getVariantGroups = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryIdsParam = req.query.categoryIds as string

    if (!categoryIdsParam) {
      return res.json({ code: 0, data: [] })
    }

    const categoryIds = categoryIdsParam
      .split(',')
      .filter(id => Types.ObjectId.isValid(id))
      .map(id => new Types.ObjectId(id))

    if (!categoryIds.length) {
      return res.json({ code: 0, data: [] })
    }

    const products = await ProductEntity.find({
      categoryId: { $in: categoryIds },
      isActive: true,
      variantGroups: { $exists: true, $ne: [] }
    })
      .select("variantGroups")
      .lean()

    if (!products.length) {
      return res.json({ code: 0, data: [] })
    }

    const groupIdSet = new Set<string>()

    products.forEach(p => {
      p.variantGroups.forEach(vg => {
        if (vg.groupId) groupIdSet.add(vg.groupId)
      })
    })

    const groupIds = [...groupIdSet]

    if (!groupIds.length) {
      return res.json({ code: 0, data: [] })
    }

    const groups = await VariantGroupEntity.find({
      _id: { $in: groupIds.map(id => new Types.ObjectId(id)) },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .lean()

    return res.json({
      code: 0,
      data: toVariantGroupListDTO(groups),
      message: "Success"
    })
  } catch (err: any) {
    console.error("getVariantGroups error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}
