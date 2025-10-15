import mongoose, { Schema, model, Types } from "mongoose";

export interface ListImage {
  id: string;
  src: string;
}

export interface About {
  _id: Types.ObjectId;
  title: string;
  summaryContent?: string;
  description?: string;
  image: string;
  listImage: ListImage[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListImageSchema = new Schema<ListImage>(
  {
    id: { type: String, required: true },
    src: { type: String, required: true },
  },
  { _id: false }
);

const AboutSchema = new Schema<About>(
  {
    title: { type: String, required: true },
    summaryContent: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    listImage: { type: [ListImageSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AboutEntity = model("About", AboutSchema, "about");
