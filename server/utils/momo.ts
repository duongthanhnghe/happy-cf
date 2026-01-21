import crypto from "crypto";

export const createMomoSignature = (
  rawSignature: string,
  secretKey: string
) => {
  return crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
};
