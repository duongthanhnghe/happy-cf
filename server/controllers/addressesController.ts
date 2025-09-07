import type { Request, Response } from "express"
import { AddressModel } from "../models/AddressEntity"
import { toAddressDTO, toAddressListDTO } from "../mappers/addressesMapper"

export const getAllAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params || req.query
    if (!userId) {
      return res.status(400).json({ code: 1, message: "Thiếu userId" })
    }

    const addresses = await AddressModel.find({ userId })
    return res.json({ code: 0, data: toAddressListDTO(addresses) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const address = await AddressModel.findById(id)
    if (!address) {
      return res.status(404).json({ code: 1, message: "address không tồn tại" })
    }
    return res.json({ code: 0, data: toAddressDTO(address) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const createAddress = async (req: Request, res: Response) => {
  try {
    const dataBody = req.body
    const newAddress = new AddressModel(dataBody)

    // Nếu isDefault = true thì reset các địa chỉ cũ của user
    if (dataBody.isDefault) {
      await AddressModel.updateMany(
        { userId: dataBody.userId },
        { $set: { isDefault: false } }
      )
    }

    await newAddress.save()
    return res.status(201).json({ code: 0, message: "Tạo thành công", data: toAddressDTO(newAddress) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const dataBody = req.body

    const address = await AddressModel.findById(id)
    if (!address) {
      return res.status(404).json({ code: 1, message: "address không tồn tại" })
    }

    // Nếu set default
    if (dataBody.isDefault === true) {
      await AddressModel.updateMany(
        { userId: address.userId, _id: { $ne: id } },
        { $set: { isDefault: false } }
      )
    }

    Object.assign(address, dataBody)
    await address.save()

    return res.json({ code: 0, message: "Cập nhật thành công", data: toAddressDTO(address) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const address = await AddressModel.findByIdAndDelete(id)
    if (!address) {
      return res.status(404).json({ code: 1, message: "address không tồn tại" })
    }
    return res.json({ code: 0, message: "Xoá thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 2, message: err.message })
  }
}

export const setAddressDefault = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const address = await AddressModel.findById(id)

    if (!address) {
      return res.status(404).json({ code: 1, message: "address không tồn tại" })
    }

    await AddressModel.updateMany(
      { userId: address.userId },
      { $set: { isDefault: false } }
    )

    address.isDefault = true
    await address.save()

    return res.json({ code: 0, message: "Đặt địa chỉ mặc định thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getDefaultAddressByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ code: 1, message: "Thiếu userId" })
    }

    const defaultAddress = await AddressModel.findOne({ userId, isDefault: true })
    if (!defaultAddress) {
      return res.status(400).json({ code: 2, message: "Không tìm thấy địa chỉ mặc định" })
    }

    return res.json({ code: 0, data: toAddressDTO(defaultAddress) })
  } catch (err: any) {
    return res.status(500).json({ code: 3, message: err.message })
  }
}
