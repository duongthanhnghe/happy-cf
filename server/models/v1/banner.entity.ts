import { Schema, model, Types } from "mongoose";

export interface Banner {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<Banner>(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BannerEntity = model("Banner", BannerSchema, "banners");
