import mongoose, { Schema, model, Types } from "mongoose";

export interface MembershipLevelsDocument extends Document {
  _id: Types.ObjectId
  name: string
  minPoint: number
  icon: string
  image: string
}

const MembershipLevelSchema = new Schema<MembershipLevelsDocument>(
  {
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String },
  },
  { timestamps: false }
);

export const MembershipLevelModel = model(
  "MembershipLevel",
  MembershipLevelSchema,
  "membership_levels"
);
