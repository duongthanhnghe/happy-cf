// const SEPAY_API_URL = process.env.SEPAY_API_URL || "https://my.sepay.vn/userapi";
// const SEPAY_API_KEY = process.env.SEPAY_API_KEY || "";

// export interface SepayPaymentParams {
//   amount: number
//   description: string
//   orderCode: string
//   returnUrl: string
//   cancelUrl: string
//   callbackUrl: string
// }

// // ✅ Sepay không có API tạo payment link
// // Thay vào đó, bạn cần tạo QR code với VietQR
// export const createSepayPayment = async ({
//   amount,
//   description,
//   orderCode,
//   returnUrl,
//   cancelUrl,
//   callbackUrl,
// }: SepayPaymentParams) => {
//   try {
//     // Sepay sử dụng VietQR để tạo QR code
//     // Format: Số tài khoản + Ngân hàng + Số tiền + Nội dung
    
//     const accountNo = process.env.SEPAY_ACCOUNT_NO || "";
//     const bankId = process.env.SEPAY_BANK_ID || "970422"; // VCB
//     const accountName = process.env.SEPAY_ACCOUNT_NAME || "";
//     const template = "compact2"; // hoặc "compact", "print", "qr_only"
    
//     // VietQR URL
//     const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
    
//     // Tạo payment URL với QR code
//     const paymentUrl = `${process.env.DOMAIN}/payment?qr=${encodeURIComponent(qrUrl)}&amount=${amount}&content=${encodeURIComponent(description)}&orderId=${orderCode}`;
    
//     return {
//       code: 0,
//       message: "Create payment link successfully",
//       data: {
//         paymentUrl: paymentUrl,
//         qrUrl: qrUrl,
//         raw: {
//           accountNo,
//           bankId,
//           amount,
//           description,
//         }
//       }
//     }
//   } catch (error: any) {
//     console.error("Error creating payment:", error)
//     return {
//       code: 1,
//       message: error?.message || "Unexpected error",
//       data: { paymentUrl: "" }
//     }
//   }
// }

// ✅ Hàm xác thực webhook từ Sepay
export const verifySepayWebhook = (body: any, signature: string): boolean => {
  // Sepay gửi signature trong header
  // Bạn cần verify signature này với secret key
  const crypto = require('crypto');
  const secret = process.env.SEPAY_WEBHOOK_SECRET || "";
  
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return computedSignature === signature;
}