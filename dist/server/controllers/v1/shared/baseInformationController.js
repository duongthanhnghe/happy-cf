import { BaseInformationEntity } from "../../../../server/models/v1/BaseInformationEntity.js";
import { toBaseInformationDTO } from "../../../../server/mappers/v1/baseInformationMapper.js";
export const getBaseInformation = async (_, res) => {
    try {
        const item = await BaseInformationEntity.findOne();
        if (!item) {
            return res.status(404).json({ code: 1, message: "Chưa có thông tin cơ bản" });
        }
        return res.json({ code: 0, data: toBaseInformationDTO(item) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateBaseInformation = async (req, res) => {
    try {
        // Kiểm tra xem đã có thông tin chưa
        let existing = await BaseInformationEntity.findOne();
        if (!existing) {
            // Nếu chưa có -> tạo mới
            const created = await BaseInformationEntity.create(req.body);
            return res.status(201).json({
                code: 0,
                message: "Tạo thông tin cơ bản thành công",
                data: toBaseInformationDTO(created),
            });
        }
        // Nếu đã có -> cập nhật
        existing.set(req.body);
        await existing.save();
        return res.json({
            code: 0,
            message: "Cập nhật thông tin cơ bản thành công",
            data: toBaseInformationDTO(existing),
        });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=baseInformationController.js.map