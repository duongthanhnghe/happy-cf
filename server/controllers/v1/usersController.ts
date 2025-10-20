import type { Request, Response } from "express";
import { SearchKeywordModel } from "../../models/v1/SearchKeywordEntity"
import { toSearchKeywordListDTO } from "../../mappers/v1/searchKeywordMapper"

export const getTopSearchKeyword = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10

    const keywords = await SearchKeywordModel.find()
      .sort({ totalCount: -1 })
      .limit(limit)

    return res.json({
      code: 0,
      data: toSearchKeywordListDTO(keywords),
    })
  } catch (error) {
    console.error("getTopSearchKeyword error:", error)
    return res.status(500).json({ code: 1, message: "Internal server error" })
  }
}

export const logSearchKeyword = async (
  req: Request<{}, {}, { keyword: string }>,
  res: Response
) => {
  try {
    const keyword = req.body.keyword?.trim().toLowerCase()
    if (!keyword) return res.status(400).json({ code: 1, message: "Keyword required" })

    const now = new Date()

    const existing = await SearchKeywordModel.findOne({ keyword })

    if (existing) {
      existing.totalCount += 1
      existing.lastSearchTime = now
      await existing.save()
    } else {
      await SearchKeywordModel.create({
        keyword,
        totalCount: 1,
        lastSearchTime: now,
      })
    }

    return res.status(200).json({ code: 0, message: "OK" })
  } catch (error) {
    console.error("logSearchKeyword error:", error)
    return res.status(500).json({ code: 1, message: "Internal server error" })
  }
}
