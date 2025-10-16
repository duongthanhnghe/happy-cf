import { BannerEntity } from "../../models/v1/BannerEntity.js";
import { toBannerListDTO } from "../../mappers/v1/bannerMapper.js";
export const getAllBanners = async (_, res) => {
    try {
        const banners = await BannerEntity.find({ isActive: true }).sort({ order: 1 });
        return res.json({ code: 0, data: toBannerListDTO(banners) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=bannerController.js.map