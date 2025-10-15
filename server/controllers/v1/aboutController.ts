import type { Request, Response } from "express"
import { AboutEntity } from "../../models/v1/AboutEntity"
import { toAboutDTO, toAboutListDTO } from "../../mappers/v1/aboutMapper"

export const getAllAbout = async (_: Request, res: Response) => {
  try {
    const items = await AboutEntity.find().sort({ order: 1 })
    return res.json({ code: 0, data: toAboutListDTO(items) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getAboutById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const item = await AboutEntity.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "About không tồn tại" })
    }
    return res.json({ code: 0, data: toAboutDTO(item) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const createAbout = async (req: Request, res: Response) => {
  try {
    const { title, image } = req.body
    if (!title || !image) {
      return res.status(400).json({ code: 1, message: "Thiếu title hoặc image" })
    }

    const lastItem = await AboutEntity.findOne().sort({ order: -1 })
    const maxOrder = lastItem ? lastItem.order : 0

    const newItem = new AboutEntity({
      ...req.body,
      order: maxOrder + 1,
    })
    await newItem.save()

    return res.status(201).json({ code: 0, message: "Tạo thành công", data: toAboutDTO(newItem) })
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message })
  }
}

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await AboutEntity.findByIdAndUpdate(id, req.body, { new: true })

    if (!updated) {
      return res.status(404).json({ code: 1, message: "About không tồn tại" })
    }

    return res.json({ code: 0, message: "Cập nhật thành công", data: toAboutDTO(updated) })
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message })
  }
}

export const deleteAbout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await AboutEntity.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ code: 1, message: "About không tồn tại" })
    }

    return res.json({ code: 0, message: "Xoá thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { order } = req.body

    const currentItem = await AboutEntity.findById(id)
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item không tồn tại" })
    }

    const existingItem = await AboutEntity.findOne({ order: order })

    if (existingItem) {
      // swap
      const oldOrder = currentItem.order
      existingItem.order = oldOrder
      await existingItem.save()
    }

    // gán order mới cho current item
    currentItem.order = order
    await currentItem.save()

    return res.json({ code: 0, message: "Cập nhật thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await AboutEntity.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "about không tồn tại" })
    }

    item.isActive = !item.isActive
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toAboutDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}