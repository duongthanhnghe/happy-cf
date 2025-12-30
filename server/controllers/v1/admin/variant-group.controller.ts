import type { Request, Response } from "express";
import { VariantGroupEntity } from "../../../models/v1/variant-group.entity";
import {
  toVariantGroupDTO,
  toVariantGroupListDTO,
} from "../../../mappers/v1/variant-group.mapper";
import type { CreateVariantGroupDTO, UpdateVariantGroupDTO } from "../../../types/dto/v1/product.dto";
import { ProductEntity } from "../../../models/v1/product.entity";

export const getAllVariantGroups = async (req: Request, res: Response) => {
  try {
    const groups = await VariantGroupEntity.find().sort({ createdAt: -1 }).lean();
    
    return res.json({
      code: 0,
      data: toVariantGroupListDTO(groups),
      message: "Success"
    });
  } catch (err: any) {
    console.error("Get all variant groups error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getActiveVariantGroups = async (req: Request, res: Response) => {
  try {
    const groups = await VariantGroupEntity.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    return res.json({
      code: 0,
      data: toVariantGroupListDTO(groups),
      message: "Success"
    });
  } catch (err: any) {
    console.error("Get active variant groups error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getVariantGroupById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const group = await VariantGroupEntity.findById(req.params.id).lean();

    if (!group) {
      return res.status(404).json({ code: 1, message: "Nhóm biến thể không tồn tại" });
    }

    return res.json({ code: 0, data: toVariantGroupDTO(group) });
  } catch (err: any) {
    console.error("Get variant group by ID error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const createVariantGroup = async (
  req: Request<{}, {}, CreateVariantGroupDTO>,
  res: Response
) => {
  try {
    const { groupName, variants } = req.body;

    // Check duplicate variant
    const variantNames = variants.map(v => v.name.trim().toLowerCase());
    const uniqueNames = new Set(variantNames);
    if (variantNames.length !== uniqueNames.size) {
      return res.status(400).json({ code: 1, message: "Tên biến thể không được trùng lặp" });
    }

    // Check duplicate
    const existingGroup = await VariantGroupEntity.findOne({
      groupName: { $regex: new RegExp(`^${groupName.trim()}$`, 'i') }
    });

    if (existingGroup) {
      return res.status(400).json({ code: 1, message: "Tên nhóm biến thể đã tồn tại" });
    }

    const newGroup = await VariantGroupEntity.create(req.body);

    return res.status(201).json({
      code: 0,
      data: toVariantGroupDTO(newGroup.toObject()),
      message: "Tạo nhóm biến thể thành công"
    });
  } catch (err: any) {
    console.error("Create variant group error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const updateVariantGroup = async (
  req: Request<{ id: string }, {}, UpdateVariantGroupDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const group = await VariantGroupEntity.findById(id);

    if (!group) {
      return res.status(404).json({ code: 1, message: "Nhóm biến thể không tồn tại" });
    }

    const { groupName, variants } = req.body;

    if (groupName !== undefined) {
      if (!groupName.trim()) {
        return res.status(400).json({ code: 1, message: "Tên nhóm biến thể không được để trống" });
      }

      // Check duplicate
      const existingGroup = await VariantGroupEntity.findOne({
        _id: { $ne: id },
        groupName: { $regex: new RegExp(`^${groupName.trim()}$`, 'i') }
      });

      if (existingGroup) {
        return res.status(400).json({ code: 1, message: "Tên nhóm biến thể đã tồn tại" });
      }

      group.groupName = groupName.trim();
    }

    if (variants !== undefined) {
      // Check duplicate
      const variantNames = variants.map(v => v.name.trim().toLowerCase());
      const uniqueNames = new Set(variantNames);
      if (variantNames.length !== uniqueNames.size) {
        return res.status(400).json({ code: 1, message: "Tên biến thể không được trùng lặp" });
      }

      group.variants = variants.map(v => ({
        id: v.id,
        name: v.name.trim(),
        isActive: v.isActive ?? true
      }));
    }

    await group.save();

    return res.json({
      code: 0,
      data: toVariantGroupDTO(group.toObject()),
      message: "Cập nhật nhóm biến thể thành công"
    });
  } catch (err: any) {
    console.error("Update variant group error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const deleteVariantGroup = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const group = await VariantGroupEntity.findById(id);

    if (!group) {
      return res.status(404).json({ code: 1, message: "Nhóm biến thể không tồn tại" });
    }

    // TODO: Check if group is being used by any products
    const productsUsingGroup = await ProductEntity.findOne({
      'variantGroups.groupId': id
    });
    if (productsUsingGroup) {
      return res.status(400).json({ 
        code: 1, 
        message: "Không thể xóa nhóm biến thể đang được sử dụng bởi sản phẩm" 
      });
    }

    await VariantGroupEntity.findByIdAndDelete(id);

    return res.json({
      code: 0,
      message: "Xóa nhóm biến thể thành công"
    });
  } catch (err: any) {
    console.error("Delete variant group error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const toggleVariantGroupActive = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const group = await VariantGroupEntity.findById(id);

    if (!group) {
      return res.status(404).json({ code: 1, message: "Nhóm biến thể không tồn tại" });
    }

    group.isActive = !group.isActive;
    await group.save();

    return res.json({
      code: 0,
      data: toVariantGroupDTO(group.toObject()),
      message: `${group.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} nhóm biến thể thành công`
    });
  } catch (err: any) {
    console.error("Toggle variant group active error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getVariantGroupsByType = async (
  req: Request<{ type: string }>,
  res: Response
) => {
  try {
    const { type } = req.params;

    const groups = await VariantGroupEntity.find({
      groupType: type,
      isActive: true
    }).sort({ createdAt: -1 }).lean();

    return res.json({
      code: 0,
      data: toVariantGroupListDTO(groups),
      message: "Success"
    });
  } catch (err: any) {
    console.error("Get variant groups by type error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};