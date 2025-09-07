import mongoose, { Schema, model } from "mongoose";

export interface Membership {
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  point: number;
  discountRate: number;
  joinedAt: Date;
  barcode?: string;
  code?: number;
}

export interface User {
  _id?: string;
  fullname: string;
  email: string;
  password: string;
  gender: "male" | "female";
  phone?: string;
  birthday?: Date;
  avatar?: string;
  active: boolean;
  role: number;
  membership: Membership;
  resetToken?: string;
  resetTokenExpire?: number | Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const MembershipSchema = new Schema(
  {
    level: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], required: true },
    point: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    barcode: { type: String },
    code: { type: Number },
  },
  { _id: false }
);

const UserSchema = new Schema<User>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    phone: { type: String },
    birthday: { type: Date },
    avatar: { type: String },
    active: { type: Boolean, default: true },
    role: { type: Number, default: 0 },
    membership: { type: MembershipSchema, required: true },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema, "users");
