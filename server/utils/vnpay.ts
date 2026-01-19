import crypto from "crypto";
import qs from "qs";

export function sortObject(obj: any) {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();

  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });

  return sorted;
}


export function createSecureHash(vnp_Params: any, secretKey: string) {
  const signData = qs.stringify(vnp_Params, { encode: false });
  return crypto
    .createHmac("sha512", secretKey)
    .update(signData, "utf-8")
    .digest("hex");
}