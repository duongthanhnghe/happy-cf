import { formatCurrency } from "./global"


export const useShippingHelpers = () => {

  const checkFreeShip = (shippingFee: number, minOrderAmount: number, enabled: boolean) => {
    return shippingFee >= minOrderAmount && enabled ? true : false
  }

  const getDesFreeShip = (minOrderAmount: number) => {
    return `Miễn phí đơn hàng từ ${formatCurrency(minOrderAmount)}`
  }

  return { checkFreeShip, getDesFreeShip }
}
