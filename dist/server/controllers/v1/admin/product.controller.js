import mongoose from "mongoose";
import { ProductEntity, CategoryProductEntity } from "../../../models/v1/product.entity.js";
import { toProductDTO, toProductListDTO } from "../../../mappers/v1/product.mapper.js";
import XLSX from "xlsx";
import slugify from "slugify";
export const getAllProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || "";
        const categoryId = req.query.categoryId;
        const query = {};
        if (search.trim()) {
            query.productName = { $regex: search.trim(), $options: "i" };
        }
        if (categoryId) {
            query.categoryId = categoryId;
        }
        if (limit === -1) {
            limit = await ProductEntity.countDocuments(query);
        }
        const skip = (page - 1) * limit;
        const [total, products] = await Promise.all([
            ProductEntity.countDocuments(query),
            ProductEntity.find(query)
                .populate("category")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: toProductListDTO(products),
            pagination: { page, limit, total, totalPages },
            message: "Success",
        });
    }
    catch (err) {
        console.error("Get all product error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getProductById = async (req, res) => {
    try {
        let product;
        if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            product = await ProductEntity.findById(req.params.id);
        }
        else {
            product = await ProductEntity.findOne({ slug: req.params.id });
        }
        if (!product) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        return res.json({ code: 0, data: toProductDTO(product) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        const data = req.body;
        if (!(data === null || data === void 0 ? void 0 : data.productName) || !(data === null || data === void 0 ? void 0 : data.image) || !(data === null || data === void 0 ? void 0 : data.categoryId) || !(data === null || data === void 0 ? void 0 : data.price)) {
            return res.status(400).json({ code: 1, message: "Thiếu dữ liệu" });
        }
        const categoryExists = await CategoryProductEntity.findById(data.categoryId);
        if (!categoryExists) {
            return res.status(400).json({ code: 1, message: "Category không tồn tại" });
        }
        const newProduct = await ProductEntity.create({
            ...data,
            categoryId: new mongoose.Types.ObjectId(data.categoryId),
        });
        return res.status(201).json({
            code: 0,
            message: "Tạo thành công",
            data: toProductDTO(newProduct),
        });
    }
    catch (err) {
        console.error("Create product error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const importProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ code: 1, message: "Không có file upload" });
        }
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        const results = [];
        let successCount = 0;
        let failCount = 0;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowIndex = i + 1;
            try {
                if (!row.productName || !row.price || !row.categoryId || !row.priceDiscounts || !row.amount || !row.image) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: "Thiếu dữ liệu bắt buộc (productName, price, categorySlug/categoryId)"
                    });
                    continue;
                }
                const existingProduct = await ProductEntity.findOne({
                    productName: row.productName.trim()
                });
                if (existingProduct) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: `Sản phẩm '${row.productName}' đã tồn tại, không thể import`
                    });
                    continue;
                }
                let category = null;
                if (row.categoryId) {
                    category = await CategoryProductEntity.findById(row.categoryId);
                }
                if (!category) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: "Category không tồn tại"
                    });
                    continue;
                }
                const productSlug = slugify(row.productName, { lower: true });
                const newProduct = await ProductEntity.create({
                    productName: row.productName,
                    price: Number(row.price),
                    priceDiscounts: Number(row.priceDiscounts || 0),
                    amount: Number(row.amount || 0),
                    description: row.description || "",
                    image: row.image || "",
                    listImage: [],
                    variantGroups: [],
                    summaryContent: row.summaryContent || "",
                    categoryId: new mongoose.Types.ObjectId(category._id),
                    weight: Number(row.weight || 0),
                    sku: row.sku || `PRD-${new mongoose.Types.ObjectId(category._id).toString().slice(0, 5)}-${Date.now()}`,
                    isActive: row.isActive || false,
                    titleSEO: row.titleSEO || row.productName,
                    descriptionSEO: row.descriptionSEO || "",
                    slug: productSlug,
                    keywords: row.keywords ? row.keywords.split(",") : [],
                });
                successCount++;
                results.push({
                    rowIndex,
                    row,
                    status: "success",
                    id: newProduct._id
                });
            }
            catch (err) {
                failCount++;
                results.push({
                    rowIndex,
                    row,
                    status: "error",
                    message: err.message,
                });
            }
        }
        return res.json({
            code: 0,
            message: "Import hoàn tất",
            summary: {
                total: rows.length,
                success: successCount,
                fail: failCount,
                report: `${successCount}/${rows.length} sản phẩm import thành công`
            },
            data: results,
        });
    }
    catch (err) {
        console.log("Import error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const exportProducts = async (req, res) => {
    try {
        const products = await ProductEntity.find().lean();
        if (!products || products.length === 0) {
            return res.status(200).json({
                code: 1,
                message: "Không có sản phẩm để export",
            });
        }
        const exportData = await Promise.all(products.map(async (p) => {
            // const category = await CategoryProductEntity.findById(p.categoryId).lean();
            var _a, _b;
            return {
                id: p._id.toString(),
                productName: p.productName,
                image: p.image,
                categoryId: String(p.categoryId),
                // categoryName: category ? category.categoryName : "",
                price: p.price,
                priceDiscounts: p.priceDiscounts,
                amount: p.amount,
                description: p.description,
                summaryContent: p.summaryContent,
                isActive: p.isActive,
                weight: p.weight,
                sku: p.sku,
                titleSEO: p.titleSEO,
                descriptionSEO: p.descriptionSEO,
                keywords: (_b = (_a = p.keywords) === null || _a === void 0 ? void 0 : _a.join(",")) !== null && _b !== void 0 ? _b : "",
                slug: p.slug,
            };
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        const excelBuffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        const fileName = `product_export_${Date.now()}.xlsx`;
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("X-Code", "0");
        res.setHeader("X-Message", "Export thành công");
        return res.send(excelBuffer);
    }
    catch (error) {
        console.log("Export error:", error);
        return res.status(500).json({
            code: 1,
            message: error.message,
        });
    }
};
export const updateImportProducts = async (req, res) => {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ code: 1, message: "Không có file upload" });
        }
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        const results = [];
        let successCount = 0;
        let failCount = 0;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowIndex = i + 1;
            try {
                if (!row.id) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: "Thiếu id sản phẩm, không thể update"
                    });
                    continue;
                }
                const product = await ProductEntity.findById(row.id);
                if (!product) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: `Không tìm thấy sản phẩm với id: ${row.id}`
                    });
                    continue;
                }
                if (!row.productName || !row.price || !row.categoryId || !row.priceDiscounts ||
                    !row.amount || !row.image) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: "Thiếu dữ liệu bắt buộc (productName, price, priceDiscounts, amount, image, categoryId)"
                    });
                    continue;
                }
                // Kiểm tra category
                let category = null;
                if (row.categoryId) {
                    category = await CategoryProductEntity.findById(row.categoryId);
                }
                if (!category) {
                    failCount++;
                    results.push({
                        rowIndex,
                        row,
                        status: "error",
                        message: "Category không tồn tại"
                    });
                    continue;
                }
                product.productName = row.productName || product.productName;
                product.price = Number(row.price) || product.price;
                product.priceDiscounts = Number(row.priceDiscounts || 0);
                product.amount = Number(row.amount || 0);
                product.description = row.description || "";
                product.image = row.image || "";
                product.summaryContent = row.summaryContent || "";
                product.isActive = (_a = row.isActive) !== null && _a !== void 0 ? _a : product.isActive;
                product.weight = Number(row.weight || 0);
                product.sku = row.sku || "";
                product.titleSEO = row.titleSEO || product.titleSEO;
                product.descriptionSEO = row.descriptionSEO || product.descriptionSEO;
                product.keywords = row.keywords ? row.keywords.split(",") : [];
                product.categoryId = category._id;
                product.slug = row.slug;
                await product.save();
                successCount++;
                results.push({
                    rowIndex,
                    row,
                    status: "success",
                    id: row.id
                });
            }
            catch (err) {
                failCount++;
                results.push({
                    rowIndex,
                    row,
                    status: "error",
                    message: err.message
                });
            }
        }
        return res.json({
            code: 0,
            message: "Update sản phẩm từ file thành công",
            summary: {
                total: rows.length,
                success: successCount,
                fail: failCount,
                report: `${successCount}/${rows.length} sản phẩm update thành công`
            },
            data: results
        });
    }
    catch (err) {
        console.log("Update import error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.categoryId) {
            data.categoryId = new mongoose.Types.ObjectId(data.categoryId);
        }
        const updated = await ProductEntity.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        return res.json({
            code: 0,
            message: "Cập nhật thành công",
            data: toProductDTO(updated),
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await ProductEntity.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ProductEntity.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "product không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toProductDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=product.controller.js.map