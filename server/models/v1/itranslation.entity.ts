import { Types, Schema, model, Document } from "mongoose";

export interface ITranslation extends Document {
  _id: Types.ObjectId;
  key: string;
  type: "text" | "html";
  translations: Record<string, string>;
}

const ITranslationSchema = new Schema<ITranslation>({
  key: { type: String, required: true, unique: true },
  type: { type: String, enum: ["text", "html"], default: "text" },
  translations: { type: Schema.Types.Mixed, default: {} },
});

export const ITranslationModel = model<ITranslation>("ITranslation", ITranslationSchema);
