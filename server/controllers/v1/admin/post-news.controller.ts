import type { Request, Response } from "express"
import { PostNewsModel } from "../../../models/v1/news.entity"
import { toPostNewsDTO, toPostNewsListDTO } from "../../../mappers/v1/news.mapper"

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    let limit = parseInt(req.query.limit as string, 10) || 10
    const search = (req.query.search as string) || ''
    const categoryId = req.query.categoryId as string | undefined

    const query: any = {}

    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }

    if (categoryId) {
      query.categoryId = categoryId
    }

    if (limit === -1) {
      limit = await PostNewsModel.countDocuments(query)
    }

    const skip = (page - 1) * limit

    const [total, posts] = await Promise.all([
      PostNewsModel.countDocuments(query),
      PostNewsModel.find(query)
        .populate('categoryId', 'categoryName slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ])

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1

    return res.json({
      code: 0,
      message: 'Lấy danh sách bài viết thành công',
      data: toPostNewsListDTO(posts),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (err: any) {
    console.error('💥 getAllPosts error:', err)
    return res.status(500).json({
      code: 1,
      message: err.message || 'Lỗi server khi lấy danh sách bài viết',
    })
  }
}

export const getPostsById = async (req: Request, res: Response) => {
  try {
    const post = await PostNewsModel.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ code: 1, message: "Không tồn tại" })
    }
    return res.json({ code: 0, data: toPostNewsDTO(post) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const createPosts = async (req: Request, res: Response) => {
  try {
    const newPost = new PostNewsModel(req.body)
    await newPost.save()
    return res.status(201).json({ code: 0, message: "Tạo thành công", data: toPostNewsDTO(newPost) })
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message })
  }
}

export const updatePosts = async (req: Request, res: Response) => {
  try {
    const updated = await PostNewsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) {
      return res.status(404).json({ code: 1, message: "Không tồn tại" })
    }
    return res.json({ code: 0, message: "Cập nhật thành công", data: toPostNewsDTO(updated) })
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message })
  }
}

export const deletePosts = async (req: Request, res: Response) => {
  try {
    const deleted = await PostNewsModel.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Không tồn tại" })
    }
    return res.json({ code: 0, message: "Xoá thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
  
}

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await PostNewsModel.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "item không tồn tại" })
    }

    item.isActive = !item.isActive
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toPostNewsDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}
