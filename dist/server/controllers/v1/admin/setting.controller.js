import fs from "fs";
import path from "path";
export const updateSettings = async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), "./public/data/settings.json");
        const oldData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const newData = { ...oldData, ...(req.body || {}) };
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");
        return res.json({ code: 0, message: "Cập nhật thành công", data: newData });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=setting.controller.js.map