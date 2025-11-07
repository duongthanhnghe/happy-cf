import type { Request, Response } from "express"
import { PostNewsModel } from "../../../models/v1/news.entity"
import { toPostNewsDTO, toPostNewsListDTO } from "../../../mappers/v1/news.mapper"
import mongoose from "mongoose"

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    let limit = parseInt(req.query.limit as string, 10) || 10

    //lay tat ca
    const query: any = {}
    if (limit === -1) {
      limit = await PostNewsModel.countDocuments(query)
    }

    const skip = (page - 1) * limit

    const [total, posts] = await Promise.all([
      PostNewsModel.countDocuments(),
      PostNewsModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ])

    const totalPages = Math.ceil(total / limit)

    return res.json({
      code: 0,
      data: toPostNewsListDTO(posts),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
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

// export const getPostBySlug = async (req: Request, res: Response) => {
//   try {
//     const { slug } = req.params
//     const post = await PostNewsModel.findOne({ slug })
//     if (!post) {
//       return res.status(404).json({ code: 1, message: "Không tồn tại" })
//     }
//     return res.json({ code: 0, data: toPostNewsDTO(post) })
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message })
//   }
// }

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

// export const getPostsLatest = async (req: Request, res: Response) => {
//   try {
//     const limit = parseInt(req.query.limit as string, 10) || 5

//     const posts = await PostNewsModel.find()
//       .sort({ createdAt: -1 })
//       .limit(limit)

//     return res.json({ code: 0, data: toPostNewsListDTO(posts) })
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message })
//   }
// }

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

// // // export const getPostsByCategory = async (req: Request, res: Response) => {
// // //   try {
// // //     const { categoryId } = req.params
// // //     const page = parseInt(req.query.page as string, 10) || 1
// // //     const limit = parseInt(req.query.limit as string, 10) || 10
// // //     const skip = (page - 1) * limit

// // //     const query = { categoryId }

// // //     const [total, posts] = await Promise.all([
// // //       PostNewsModel.countDocuments(query),
// // //       PostNewsModel.find({...query, isActive: true})
// // //         .sort({ createdAt: -1 })
// // //         .skip(skip)
// // //         .limit(limit)
// // //     ])

// // //     const totalPages = Math.ceil(total / limit)

// // //     return res.json({
// // //       code: 0,
// // //       data: toPostNewsListDTO(posts),
// // //       pagination: { page, limit, total, totalPages },
// // //       message: 'Success'
// // //     })
// // //   } catch (err: any) {
// // //     return res.status(500).json({ code: 1, message: err.message })
// // //   }
// // // }

// // export const getRelatedPostsBySlug = async (req: Request, res: Response) => {
// //   try {
// //     const { slug } = req.params
// //     const limit = parseInt(req.query.limit as string, 10) || 10

// //     const post = await PostNewsModel.findOne({ slug })
// //     if (!post) {
// //       return res.status(404).json({ code: 1, message: "Bài viết không tồn tại" })
// //     }

// //     const relatedPosts = await PostNewsModel.find({
// //       categoryId: new mongoose.Types.ObjectId(post.categoryId),
// //       slug: { $ne: slug },
// //       isActive: true,
// //     })
// //       .limit(limit)
// //       .sort({ createdAt: -1 })

// //     return res.json({
// //       code: 0,
// //       data: relatedPosts.map(toPostNewsDTO),
// //       message: 'Success'
// //     })
// //   } catch (err: any) {
// //     return res.status(500).json({ code: 1, message: err.message })
// //   }
// // }

// export const updateView = async (req: Request, res: Response) => {
//   try {
//     const { slug } = req.params
//     const post = await PostNewsModel.findOneAndUpdate(
//       { slug, isActive: true },
//       { $inc: { views: 1 } },
//       { new: true }
//     )
//     if (!post) return res.status(404).json({ code: 1, message: "Bài viết không tồn tại" })
//     return res.json({ code: 0, data: { views: post.views }, message: "Cập nhật lượt xem thành công" })
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message })
//   }
// }

// //client
// export const getAllPostsPagination = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string, 10) || 1
//     let limit = parseInt(req.query.limit as string, 10) || 10
//     const search = (req.query.search as string) || ""

//     const query: any = { isActive: true }

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { summaryContent: { $regex: search, $options: "i" } }
//       ]
//     }

//     // Nếu limit = -1 thì lấy tất cả
//     if (limit === -1) {
//       limit = await PostNewsModel.countDocuments(query)
//     }

//     const skip = (page - 1) * limit

//     const [total, posts] = await Promise.all([
//       PostNewsModel.countDocuments(query),
//       PostNewsModel.find(query)
//         .sort({ createdAt: -1 }) // mới nhất lên đầu
//         .skip(skip)
//         .limit(limit)
//     ])

//     const totalPages = Math.ceil(total / limit)

//     return res.json({
//       code: 0,
//       data: toPostNewsListDTO(posts),
//       pagination: { page, limit, total, totalPages },
//       message: "Success"
//     })
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message })
//   }
// }