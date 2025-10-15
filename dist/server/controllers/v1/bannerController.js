import { BannerEntity } from "../../models/v1/BannerEntity.js";
import { toBannerDTO, toBannerListDTO } from "../../mappers/v1/bannerMapper.js";
export const getAllBanners = async (_, res) => {
    try {
        const banners = await BannerEntity.find().sort({ order: 1 });
        return res.json({ code: 0, data: toBannerListDTO(banners) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await BannerEntity.findById(id);
        if (!banner) {
            return res.status(404).json({ code: 1, message: "Banner không tồn tại" });
        }
        return res.json({ code: 0, data: toBannerDTO(banner) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createBanner = async (req, res) => {
    try {
        const { title, description, image, isActive } = req.body;
        if (!title || !image) {
            return res.status(400).json({ code: 1, message: "Thiếu title hoặc image" });
        }
        const lastItem = await BannerEntity.findOne().sort({ order: -1 });
        const maxOrder = lastItem ? lastItem.order : 0;
        const newItem = new BannerEntity({
            ...req.body,
            order: maxOrder + 1,
        });
        await newItem.save();
        return res.status(201).json({ code: 0, message: "Tạo thành công", data: toBannerDTO(newItem) });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await BannerEntity.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ code: 1, message: "Banner không tồn tại" });
        }
        return res.json({ code: 0, message: "Cập nhật thành công", data: toBannerDTO(updated) });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await BannerEntity.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Banner không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { order } = req.body;
        const currentItem = await BannerEntity.findById(id);
        if (!currentItem) {
            return res.status(404).json({ code: 1, message: "Item không tồn tại" });
        }
        const existingItem = await BannerEntity.findOne({ order: order });
        if (existingItem) {
            const oldOrder = currentItem.order;
            existingItem.order = oldOrder;
            await existingItem.save();
        }
        currentItem.order = order;
        await currentItem.save();
        return res.json({ code: 0, message: "Cập nhật thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await BannerEntity.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "Banner không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toBannerDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=bannerController.js.map