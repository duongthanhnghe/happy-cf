import type { cartItems } from '@/server/types/dto/v1/order.dto';

export const useOrderHelpers = () => {

  const remainingProductNames = (cartItems: cartItems[]) => {
    if (!cartItems) return "";

    return cartItems
      .slice(2)
      .map(item => ` ${item.idProduct.productName},`)
      .join("");
  }

  return { remainingProductNames }
}
