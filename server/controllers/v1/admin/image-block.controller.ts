import type { Request, Response } from "express"
import { ImageBlockEntity } from "../../../models/v1/image-block.entity"
import {
  toImageBlockDTO,
  toImageBlockListDTO,
} from "../../../mappers/v1/image-block.mapper"

export const getAllImageBlocks = async (_: Request, res: Response) => {
  try {
    const items = await ImageBlockEntity.find().sort({ page: 1, position: 1, order: 1 })
    return res.json({ code: 0, data: toImageBlockListDTO(items) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getImageBlockById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const item = await ImageBlockEntity.findById(id)

    if (!item) {
      return res.status(404).json({ code: 1, message: "ImageBlock không tồn tại" })
    }

    return res.json({ code: 0, data: toImageBlockDTO(item) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

// export const getImageBlocksByPage = async (req: Request, res: Response) => {
//   try {
//     const { page, position } = req.query

//     if (!page || !position) {
//       return res.status(400).json({
//         code: 1,
//         message: "Thiếu page hoặc position",
//       })
//     }

//     const items = await ImageBlockEntity.find({
//       page,
//       position,
//       isActive: true,
//     }).sort({ order: 1 })

//     return res.json({ code: 0, data: toImageBlockListDTO(items) })
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message })
//   }
// }

export const createImageBlock = async (req: Request, res: Response) => {
  try {
    const { image, page, position } = req.body

    if (!image || !page || !position) {
      return res.status(400).json({
        code: 1,
        message: "Thiếu image / page / position",
      })
    }

    const lastItem = await ImageBlockEntity.findOne({
      page,
      position,
    }).sort({ order: -1 })

    const maxOrder = lastItem ? lastItem.order : 0

    const newItem = new ImageBlockEntity({
      ...req.body,
      order: maxOrder + 1,
    })

    await newItem.save()

    return res.status(201).json({
      code: 0,
      message: "Tạo ImageBlock thành công",
      data: toImageBlockDTO(newItem),
    })
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message })
  }
}

export const updateImageBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const updated = await ImageBlockEntity.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ code: 1, message: "ImageBlock không tồn tại" })
    }

    return res.json({
      code: 0,
      message: "Cập nhật thành công",
      data: toImageBlockDTO(updated),
    })
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message })
  }
}

export const deleteImageBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deleted = await ImageBlockEntity.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "ImageBlock không tồn tại" })
    }

    return res.json({ code: 0, message: "Xoá thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const updateImageBlockOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { order } = req.body

    const currentItem = await ImageBlockEntity.findById(id)
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item không tồn tại" })
    }

    const existingItem = await ImageBlockEntity.findOne({
      page: currentItem.page,
      position: currentItem.position,
      order,
    })

    if (existingItem) {
      existingItem.order = currentItem.order
      await existingItem.save()
    }

    currentItem.order = order
    await currentItem.save()

    return res.json({ code: 0, message: "Cập nhật thứ tự thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const toggleImageBlockActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await ImageBlockEntity.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "ImageBlock không tồn tại" })
    }

    item.isActive = !item.isActive
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toImageBlockDTO(item),
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}
