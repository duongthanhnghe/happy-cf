export function buildVietQR(order: any) {
  const bankId = process.env.SEPAY_BANK_ID
  const accountNo = process.env.SEPAY_ACCOUNT_NO
  const accountName: any = process.env.SEPAY_ACCOUNT_NAME

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png` +
    `?amount=${order.totalPrice}` +
    `&addInfo=${encodeURIComponent(`Thanh toan don ${order.code}`)}` +
    `&accountName=${encodeURIComponent(accountName)}`
}