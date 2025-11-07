import mongoose, { Schema, model, Types, Document } from "mongoose";
import "./membership-benefit.entity.js";

export interface MembershipLevelsDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  minPoint: number;
  icon: string;
  image: string;
  discountRate: number;
  pointRate: number;
  benefits: Types.ObjectId[];
}

const MembershipLevelSchema = new Schema<MembershipLevelsDocument>(
  {
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String },
    discountRate: { type: Number },
    pointRate: { type: Number, default: 2 },
    benefits: [{ type: Schema.Types.ObjectId, ref: "MembershipBenefit" }]
  },
  { timestamps: false }
);

export const MembershipLevelModel = model<MembershipLevelsDocument>(
  "MembershipLevel",
  MembershipLevelSchema,
  "membership_levels"
);