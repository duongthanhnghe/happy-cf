import type { Request, Response } from "express"
import { PostNewsModel, CategoryNewsModel } from "../../models/v1/news.entity"
import { toPostNewsDTO, toPostNewsListDTO } from "../../mappers/v1/news.mapper"
import mongoose, { Types } from "mongoose"

export const isNewsCategoryActive = async (categoryId: Types.ObjectId | null): Promise<boolean> => {
  if (!categoryId) return false;

  const category = await CategoryNewsModel.findById(categoryId).lean();
  if (!category) return false;

  return category.isActive === true;
};

export const getPostsById = async (req: Request, res: Response) => {
  try {
    const post = await PostNewsModel.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ code: 1, message: "Không tồn tại" })
    }

    if (!post.isActive) {
      return res.status(404).json({ code: 1, message: "Bài viết đã bị vô hiệu hóa" })
    }

    const isActiveCategory = await isNewsCategoryActive(post.categoryId)
    if (!isActiveCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục của bài viết đã bị vô hiệu hóa" })
    }

    return res.json({ code: 0, data: toPostNewsDTO(post) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const post = await PostNewsModel.findOne({ slug })
    if (!post) {
      return res.status(404).json({ code: 1, message: "Không tồn tại" })
    }

    if (!post.isActive) {
      return res.status(404).json({ code: 1, message: "Bài viết đã bị vô hiệu hóa" })
    }

    const isActiveCategory = await isNewsCategoryActive(post.categoryId)
    if (!isActiveCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục của bài viết đã bị vô hiệu hóa" })
    }

    return res.json({ code: 0, data: toPostNewsDTO(post) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getPostsLatest = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 5;

    const posts = await PostNewsModel.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "post_categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
      { $match: { "category.isActive": true } },

      // thêm categoryName
      { $addFields: { categoryName: "$category.categoryName" } },

      { $sort: { createdAt: -1 } },
      { $limit: limit },
      { $project: { category: 0 } }
    ]);

    return res.json({
      code: 0,
      data: posts.map(toPostNewsDTO),
      message: "Success"
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
}

export const getPostsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 10
    const skip = (page - 1) * limit

    const query = { categoryId }

    const isActiveCategory = await isNewsCategoryActive(new Types.ObjectId(categoryId))
    if (!isActiveCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục đã bị vô hiệu hóa" })
    }

    const [total, posts] = await Promise.all([
      PostNewsModel.countDocuments(query),
      PostNewsModel.find({...query, isActive: true})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ])

    const totalPages = Math.ceil(total / limit)

    return res.json({
      code: 0,
      data: toPostNewsListDTO(posts),
      pagination: { page, limit, total, totalPages },
      message: 'Success'
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getRelatedPostsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const limit = parseInt(req.query.limit as string, 10) || 10

    const post = await PostNewsModel.findOne({ slug })
    if (!post) {
      return res.status(404).json({ code: 1, message: "Bài viết không tồn tại" })
    }

    const isActiveCategory = await isNewsCategoryActive(post.categoryId)
    if (!isActiveCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục của bài viết đã bị vô hiệu hóa" })
    }

    const relatedPosts = await PostNewsModel.find({
      categoryId: new mongoose.Types.ObjectId(post.categoryId),
      slug: { $ne: slug },
      isActive: true,
    })
      .limit(limit)
      .sort({ createdAt: -1 })

    return res.json({
      code: 0,
      data: relatedPosts.map(toPostNewsDTO),
      message: 'Success'
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const updateView = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const post = await PostNewsModel.findOneAndUpdate(
      { slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!post) return res.status(404).json({ code: 1, message: "Bài viết không tồn tại" })
    return res.json({ code: 0, data: { views: post.views }, message: "Cập nhật lượt xem thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

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

//     if (limit === -1) {
//       limit = await PostNewsModel.countDocuments(query)
//     }

//     const skip = (page - 1) * limit

//     const [total, posts] = await Promise.all([
//       PostNewsModel.countDocuments(query),
//       PostNewsModel.find(query)
//         .sort({ createdAt: -1 })
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

export const getAllPostsPagination = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    let limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;

    // Pipeline
    const pipeline: any[] = [
      // 1. Lọc bài viết active
      { $match: { isActive: true } },

      // 2. Join danh mục
      {
        $lookup: {
          from: "post_categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },

      // 3. Lọc danh mục active
      { $match: { "category.isActive": true } }
    ];

    // 4. Tìm kiếm
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { summaryContent: { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    // 5. Sắp xếp
    pipeline.push({ $sort: { createdAt: -1 } });

    // 6. Tính tổng trước khi skip & limit
    const countPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await PostNewsModel.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    // 7. Skip & limit
    pipeline.push({ $skip: skip }, { $limit: limit });

    // 8. Loại bỏ thông tin category khỏi kết quả
    pipeline.push({ $project: { category: 0 } });

    const posts = await PostNewsModel.aggregate(pipeline);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      code: 0,
      data: posts.map(toPostNewsDTO),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
