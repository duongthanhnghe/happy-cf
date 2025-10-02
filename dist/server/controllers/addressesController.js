import { AddressModel } from "../models/AddressEntity.js";
import { toAddressDTO, toAddressListDTO } from "../mappers/addressesMapper.js";
export const getAllAddress = async (req, res) => {
    try {
        const { userId } = req.params || req.query;
        if (!userId) {
            return res.status(400).json({ code: 1, message: "Thiếu userId" });
        }
        const addresses = await AddressModel.find({ userId });
        return res.json({ code: 0, data: toAddressListDTO(addresses) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await AddressModel.findById(id).lean();
        if (!address) {
            return res.status(404).json({ code: 1, message: "address không tồn tại" });
        }
        return res.json({ code: 0, data: toAddressDTO(address) });
    }
    catch (err) {
        console.error("Error getAddressById:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createAddress = async (req, res) => {
    try {
        const dataBody = req.body;
        const newAddress = new AddressModel(dataBody);
        if (dataBody.isDefault) {
            await AddressModel.updateMany({ userId: dataBody.userId }, { $set: { isDefault: false } });
        }
        await newAddress.save();
        return res.status(201).json({ code: 0, message: "Tạo thành công", data: toAddressDTO(newAddress) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const dataBody = req.body;
        const address = await AddressModel.findById(id);
        if (!address) {
            return res.status(404).json({ code: 1, message: "address không tồn tại" });
        }
        // Nếu set default
        if (dataBody.isDefault === true) {
            await AddressModel.updateMany({ userId: address.userId, _id: { $ne: id } }, { $set: { isDefault: false } });
        }
        Object.assign(address, dataBody);
        await address.save();
        return res.json({ code: 0, message: "Cập nhật thành công", data: toAddressDTO(address) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await AddressModel.findByIdAndDelete(id);
        if (!address) {
            return res.status(404).json({ code: 1, message: "address không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 2, message: err.message });
    }
};
export const setAddressDefault = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await AddressModel.findById(id);
        if (!address) {
            return res.status(404).json({ code: 1, message: "address không tồn tại" });
        }
        await AddressModel.updateMany({ userId: address.userId }, { $set: { isDefault: false } });
        address.isDefault = true;
        await address.save();
        return res.json({ code: 0, message: "Đặt địa chỉ mặc định thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getDefaultAddressByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ code: 1, message: "Thiếu userId" });
        }
        const defaultAddress = await AddressModel.findOne({ userId, isDefault: true });
        if (!defaultAddress) {
            return res.status(400).json({ code: 2, message: "Không tìm thấy địa chỉ mặc định" });
        }
        return res.json({ code: 0, data: toAddressDTO(defaultAddress) });
    }
    catch (err) {
        return res.status(500).json({ code: 3, message: err.message });
    }
};
//# sourceMappingURL=addressesController.js.map