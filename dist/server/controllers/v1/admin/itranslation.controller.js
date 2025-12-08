import { ITranslationModel } from "../../../models/v1/itranslation.entity.js";
import { toTranslationDTO, toTranslationListDTO } from "../../../mappers/v1/itranslation.mapper.js";
export const getTranslations = async (req, res) => {
    var _a;
    try {
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().trim()) || "";
        const query = {};
        if (search) {
            query.$or = [
                { key: { $regex: search, $options: "i" } },
                { "translations.vi": { $regex: search, $options: "i" } },
                { "translations.en": { $regex: search, $options: "i" } }
            ];
        }
        const skip = (page - 1) * limit;
        const [total, items] = await Promise.all([
            ITranslationModel.countDocuments(query),
            ITranslationModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: toTranslationListDTO(items),
            pagination: { page, limit, total, totalPages },
            message: "Success"
        });
    }
    catch (err) {
        console.error("Get translations error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getTranslationDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await ITranslationModel.findById(id).lean();
        if (!item) {
            return res.status(404).json({ code: 1, message: "Không tìm thấy translation" });
        }
        const dto = toTranslationDTO(item);
        return res.json({ code: 0, data: dto });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// POST /api/v1/translations
export const createTranslation = async (req, res) => {
    const { key, type, translations } = req.body;
    try {
        const existing = await ITranslationModel.findOne({ key });
        if (existing) {
            return res.status(400).json({ code: 1, message: "Key đã tồn tại" });
        }
        const t = await ITranslationModel.create({ key, type, translations });
        return res.json({ code: 0, data: t });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// PUT /api/v1/translations/:id
export const updateTranslation = async (req, res) => {
    const { id } = req.params;
    const { type, translations } = req.body;
    try {
        const t = await ITranslationModel.findById(id);
        if (!t)
            return res.status(404).json({ code: 1, message: "Không tìm thấy translation" });
        if (type)
            t.type = type;
        if (translations)
            t.translations = { ...t.translations, ...translations };
        await t.save();
        return res.json({ code: 0, data: t });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// DELETE /api/v1/translations/:id
export const deleteTranslation = async (req, res) => {
    const { id } = req.params;
    try {
        await ITranslationModel.findByIdAndDelete(id);
        return res.json({ code: 0, message: "Xóa thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=itranslation.controller.js.map