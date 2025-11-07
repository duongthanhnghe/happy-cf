import { Types } from "mongoose";
import { CategoryProductEntity, ProductEntity } from "../../../models/v1/product.entity.js";
import { toCategoryProductDTO, toCategoryProductListDTO, } from "../../../mappers/v1/product.mapper.js";
function buildCategoryTree(list) {
    const map = new Map();
    list.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });
    const tree = [];
    map.forEach(cat => {
        if (cat.parentId) {
            const parent = map.get(cat.parentId);
            if (parent) {
                parent.children.push(cat);
            }
            else {
                tree.push(cat);
            }
        }
        else {
            tree.push(cat);
        }
    });
    return tree;
}
export const getAllCategoriesTree = async (_, res) => {
    try {
        const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
        const dtoList = toCategoryProductListDTO(categories);
        const tree = buildCategoryTree(dtoList);
        return res.json({ code: 0, data: tree });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getAllCategories = async (_, res) => {
    try {
        const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
        return res.json({ code: 0, data: toCategoryProductListDTO(categories) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getCategoriesById = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        const category = await CategoryProductEntity.findById(req.params.id).lean();
        if (!category) {
            return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
        }
        return res.json({ code: 0, data: toCategoryProductDTO(category) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// export const getCategoriesBySlug = async (
//   req: Request<{ slug: string }>,
//   res: Response
// ) => {
//   try {
//     const { slug } = req.params;
//     const category = await CategoryProductEntity.findOne({ slug }).lean();
//     if (!category) {
//       return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
//     }
//     return res.json({
//       code: 0,
//       data: toCategoryProductDTO(category),
//       message: "Success",
//     });
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message });
//   }
// };
// export const getChildrenCategories = async (
//   req: Request<{ id: string }, {}, {}, { includeInactive?: string }>,
//   res: Response
// ) => {
//   try {
//     const { id } = req.params;
//     const { includeInactive } = req.query;
//     if (!Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
//     }
//     const query: any = { parentId: id };
//     if (!includeInactive || includeInactive === "false") {
//       query.isActive = true;
//     }
//     const children = await CategoryProductEntity.find(query)
//       .lean()
//       .sort({ order: 1 });
//     return res.json({
//       code: 0,
//       data: toCategoryProductListDTO(children),
//       message: "Success",
//     });
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message });
//   }
// };
export const createCategories = async (req, res) => {
    try {
        const { categoryName, image, parentId } = req.body;
        if (!categoryName || !image) {
            return res.status(400).json({ code: 1, message: "Thiếu categoryName hoặc image" });
        }
        if (parentId && !Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ code: 1, message: "parentId không hợp lệ" });
        }
        if (parentId) {
            const parent = await CategoryProductEntity.findById(parentId);
            if (!parent) {
                return res.status(400).json({ code: 1, message: "Danh mục cha không tồn tại" });
            }
        }
        const existed = await CategoryProductEntity.findOne({ categoryName });
        if (existed) {
            return res.status(400).json({ code: 1, message: "Danh mục đã tồn tại" });
        }
        const lastItem = await CategoryProductEntity.findOne().sort({ order: -1 });
        const maxOrder = lastItem ? lastItem.order : 0;
        const newItem = new CategoryProductEntity({
            ...req.body,
            parentId: parentId || null,
            order: maxOrder + 1,
        });
        await newItem.save();
        return res.status(201).json({ code: 0, message: "Tạo thành công", data: toCategoryProductDTO(newItem) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateCategories = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        if (req.body.parentId === "") {
            delete req.body.parentId;
        }
        const { parentId } = req.body;
        if (parentId && !Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ code: 1, message: "parentId không hợp lệ" });
        }
        if (parentId) {
            const parent = await CategoryProductEntity.findById(parentId);
            if (!parent) {
                return res.status(400).json({ code: 1, message: "Danh mục cha không tồn tại" });
            }
        }
        const updatedCategory = await CategoryProductEntity.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!updatedCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
        }
        return res.json({ code: 0, message: "Cập nhật thành công", data: toCategoryProductDTO(updatedCategory) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteCategories = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        const categoryId = new Types.ObjectId(req.params.id);
        const hasChildren = await CategoryProductEntity.exists({ parentId: categoryId });
        if (hasChildren) {
            return res.json({
                code: 1,
                message: "Không thể xóa danh mục vì vẫn còn danh mục con"
            });
        }
        const hasProducts = await ProductEntity.exists({ categoryId });
        if (hasProducts) {
            return res.json({
                code: 1,
                message: "Không thể xóa danh mục vì vẫn còn sản phẩm trong danh mục này"
            });
        }
        const deletedCategory = await CategoryProductEntity.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// export const getProductsByCategory = async (
//   req: Request<{ id: string }>,
//   res: Response
// ) => {
//   try {
//     if (!Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
//     }
//     const categoryId = new Types.ObjectId(req.params.id);
//     const categories = await CategoryProductEntity.aggregate([
//       { $match: { _id: categoryId } },
//       {
//         $graphLookup: {
//           from: "product_categories",      // 👈 tên collection (mặc định là model name viết thường + "s")
//           startWith: "$_id",
//           connectFromField: "_id",
//           connectToField: "parentId",
//           as: "descendants"
//         }
//       },
//       {
//         $project: {
//           ids: {
//             $concatArrays: [["$_id"], "$descendants._id"]
//           }
//         }
//       }
//     ]);
//     const categoryIds: Types.ObjectId[] = categories[0]?.ids || [categoryId];
//     const page = parseInt(req.query.page as string, 10) || 1;
//     let limit = parseInt(req.query.limit as string, 10) || 10;
//     const sortType = (req.query.sort as string) || "default";
//     if (limit === -1) {
//       limit = await ProductEntity.countDocuments({
//         categoryId: { $in: categoryIds },
//         isActive: true
//       });
//     }
//     const skip = (page - 1) * limit;
//     const [total, products] = await Promise.all([
//       ProductEntity.countDocuments({
//         categoryId: { $in: categoryIds },
//         isActive: true
//       }),
//       ProductEntity.aggregate([
//         { $match: { categoryId: { $in: categoryIds }, isActive: true } },
//         // Ép kiểu price & priceDiscount sang số
//         {
//           $addFields: {
//             price: { $toDouble: "$price" },
//             priceDiscount: { $toDouble: "$priceDiscount" },
//           },
//         },
//         // Tính toán giảm giá
//         {
//           $addFields: {
//             hasDiscount: { $cond: [{ $lt: ["$priceDiscount", "$price"] }, 1, 0] },
//             discountValue: {
//               $cond: [
//                 { $lt: ["$priceDiscount", "$price"] },
//                 { $subtract: ["$price", "$priceDiscount"] },
//                 0,
//               ],
//             },
//             discountPercent: {
//               $cond: [
//                 { $lt: ["$priceDiscount", "$price"] },
//                 {
//                   $multiply: [
//                     { $divide: [{ $subtract: ["$price", "$priceDiscount"] }, "$price"] },
//                     100,
//                   ],
//                 },
//                 0,
//               ],
//             },
//           },
//         },
//         // Sort động theo sortType
//         {
//           $sort:
//             sortType === "discount"
//               ? { hasDiscount: -1, discountPercent: -1, updatedAt: -1 }
//               : sortType === "popular"
//               ? { amountOrder: -1 }
//               : sortType === "price_desc"
//               ? { price: -1 }
//               : sortType === "price_asc"
//               ? { price: 1 }
//               : { updatedAt: -1 },
//         },
//         { $skip: skip },
//         { $limit: limit },
//       ]),
//     ]);
//     const totalPages = Math.ceil(total / limit);
//     return res.json({
//       code: 0,
//       data: toProductListDTO(products),
//       pagination: { page, limit, total, totalPages },
//       message: "Success",
//     });
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message });
//   }
// };
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { order } = req.body;
        const currentItem = await CategoryProductEntity.findById(id);
        if (!currentItem) {
            return res.status(404).json({ code: 1, message: "Item không tồn tại" });
        }
        const existingItem = await CategoryProductEntity.findOne({ order: order });
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
        const item = await CategoryProductEntity.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "Banner không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toCategoryProductDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=categories-product.controller.js.map