import { Schema, model, Types } from "mongoose";

export interface Image {
  desk: string;
  mobile: string;
}

export interface Banner {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  image: Image;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<Image>(
  {
    desk: { type: String, required: true },
    mobile: { type: String, required: true },
  }
);

const BannerSchema = new Schema<Banner>(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: ImageSchema, required: true, default: {
      desk: '',
      mobile: '',
    }},
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BannerEntity = model("Banner", BannerSchema, "banners");
