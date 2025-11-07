import mongoose, { Schema, model, Types, Document } from "mongoose";

export interface MembershipBenefitDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipBenefitSchema = new Schema<MembershipBenefitDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export const MembershipBenefitModel = model<MembershipBenefitDocument>(
  "MembershipBenefit",
  MembershipBenefitSchema,
  "membership_benefits"
);