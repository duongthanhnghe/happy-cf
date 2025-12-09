import { Schema, model, models, Types, Document } from "mongoose";

export interface VariantItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface VariantGroup {
  _id: Types.ObjectId;
  groupName: string;
  groupType?: string;
  description?: string;
  icon?: string;
  hasImage: boolean;
  variants: VariantItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantItemSchema = new Schema<VariantItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const VariantGroupSchema = new Schema<VariantGroup>(
  {
    groupName: { type: String, required: true, trim: true },
    groupType: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    variants: { type: [VariantItemSchema], default: [] },
    hasImage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const VariantGroupEntity = model(
  "VariantGroup",
  VariantGroupSchema,
  "variant_groups"
);