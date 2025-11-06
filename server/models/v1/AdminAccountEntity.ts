import mongoose, { Schema, Document, Types } from "mongoose";

export interface AdminAccountDocument extends Document {
  _id: Types.ObjectId;
  avatar: string;
  fullname: string;
  email: string;
  password: string;
  role: "superadmin" | "editor";
  active: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminAccountSchema = new Schema<AdminAccountDocument>(
  {
    avatar: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "editor"], default: "editor" },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const AdminAccountModel = mongoose.model<AdminAccountDocument>(
  "AdminAccount",
  AdminAccountSchema,
  "admin_accounts"
);
