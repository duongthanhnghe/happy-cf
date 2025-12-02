import { VariantGroupEntity } from "../../models/v1/variant-group.entity.js";
import { toVariantGroupListDTO, } from "../../mappers/v1/variant-group.mapper.js";
export const getVariantGroups = async (req, res) => {
    try {
        const groups = await VariantGroupEntity.find({ isActive: true })
            .sort({ createdAt: -1 })
            .lean();
        return res.json({
            code: 0,
            data: toVariantGroupListDTO(groups),
            message: "Success"
        });
    }
    catch (err) {
        console.error("Get active variant groups error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=variant-group.controller.js.map