import { Types } from "mongoose";
import type { Request, Response } from "express";
import { CategoryProductEntity, ProductEntity } from "../../../models/v1/product.entity";
import type { CreateCategoryProductBody, UpdateCategoryProductBody, CategoryProductDTO } from "@/server/types/dto/v1/product.dto";
import {
  toCategoryProductDTO,
  toCategoryProductListDTO,
} from "../../../mappers/v1/product.mapper"

function buildCategoryTree(list: CategoryProductDTO[]): (CategoryProductDTO & { children: CategoryProductDTO[] })[] {
  const map = new Map<string, CategoryProductDTO & { children: CategoryProductDTO[] }>();

  list.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  const tree: (CategoryProductDTO & { children: CategoryProductDTO[] })[] = [];

  map.forEach(cat => {
    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      if (parent) {
        parent.children.push(cat);
      } else {
        tree.push(cat); 
      }
    } else {
      tree.push(cat);
    }
  });

  return tree;
}

export const getAllCategoriesTree = async (_: Request, res: Response) => {
  try {
    const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
    const dtoList = toCategoryProductListDTO(categories);

    const tree = buildCategoryTree(dtoList);

    return res.json({ code: 0, data: tree });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";

    const filter: any = {};

    if (search.trim()) {
      filter.categoryName = { $regex: search.trim(), $options: "i" };
    }

    const categories = await CategoryProductEntity.find(filter)
      .lean()
      .sort({ order: 1 });

    return res.json({
      code: 0,
      data: toCategoryProductListDTO(categories),
    });

  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message,
    });
  }
};

export const getCategoriesById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    const category = await CategoryProductEntity.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
    }
   
    return res.json({ code: 0, data: toCategoryProductDTO(category) })
    
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const createCategories = async (req: Request<{}, {}, CreateCategoryProductBody>, res: Response) => {
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

    const lastItem = await CategoryProductEntity.findOne().sort({ order: -1 })
    const maxOrder = lastItem ? lastItem.order : 0

    const newItem = new CategoryProductEntity({
      ...req.body,
      parentId: parentId || null,
      order: maxOrder + 1,
    })
    await newItem.save()

    return res.status(201).json({ code: 0, message: "Tạo thành công", data: toCategoryProductDTO(newItem) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const updateCategories = async (req: Request<{ id: string }, {}, Partial<UpdateCategoryProductBody>>, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    if (req.body.parentId === "") {
      delete req.body.parentId
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

    const updatedCategory = await CategoryProductEntity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!updatedCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
    }

    return res.json({ code: 0, message: "Cập nhật thành công", data: toCategoryProductDTO(updatedCategory) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const deleteCategories = async (req: Request<{ id: string }>, res: Response) => {
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
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { order } = req.body

    const currentItem = await CategoryProductEntity.findById(id)
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item không tồn tại" })
    }

    const existingItem = await CategoryProductEntity.findOne({ order: order })

    if (existingItem) {
      const oldOrder = currentItem.order
      existingItem.order = oldOrder
      await existingItem.save()
    }

    currentItem.order = order
    await currentItem.save()

    return res.json({ code: 0, message: "Cập nhật thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await CategoryProductEntity.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "Banner không tồn tại" })
    }

    item.isActive = !item.isActive
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toCategoryProductDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}