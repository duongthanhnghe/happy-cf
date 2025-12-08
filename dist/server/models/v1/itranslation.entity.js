import { Schema, model } from "mongoose";
const ITranslationSchema = new Schema({
    key: { type: String, required: true, unique: true },
    type: { type: String, enum: ["text", "html"], default: "text" },
    translations: { type: Schema.Types.Mixed, default: {} },
});
export const ITranslationModel = model("ITranslation", ITranslationSchema);
//# sourceMappingURL=itranslation.entity.js.map