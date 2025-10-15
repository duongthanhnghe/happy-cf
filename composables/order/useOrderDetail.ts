import { ref, computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import { ordersAPI } from "@/services/v1/orders.service";
import type { OrderDTO, OrderMappingNew } from '@/server/types/dto/v1/order.dto'

export const useOrderDetail = () => {
  
  const detailOrder = ref<OrderMappingNew|null>(null);

  const fetchOrderDetail = async (id: string) => {
    try {
      const data = await ordersAPI.getDetail(id)
      if(data.code === 0 && data.data.cartItems?.length > 0){
        const detail = await orderDetail(data.data)
        detailOrder.value = detail
      } 
    } catch (err) {
      console.error('Error status', err)
    }
  }

  const orderDetail = async (data: OrderDTO) => {
    const productList = await Promise.all(
      data.cartItems.map(async (cartItem) => {
        const detail = await productsAPI.getDetail(cartItem.idProduct.toString())
        if(detail.code === 0){
          return {
            data: detail.data,
            note: cartItem.note,
            quantity: cartItem.quantity,
            priceDiscounts: cartItem.priceDiscounts,
            selectedOptionsPush: cartItem.selectedOptionsPush,
            finalPriceDiscounts: cartItem.finalPriceDiscounts
          }
        } else {
          return {
            data: {},
            note: cartItem.note,
            quantity: cartItem.quantity,
            priceDiscounts: cartItem.priceDiscounts,
            selectedOptionsPush: cartItem.selectedOptionsPush,
            finalPriceDiscounts: cartItem.finalPriceDiscounts
          }
        }
      })
    )
    return {
      ...data,
      productList,
    } as OrderMappingNew
  }

  const getDetailOrder = computed(() => detailOrder.value);
  
  return {
    detailOrder,
    fetchOrderDetail,
    orderDetail,
    getDetailOrder
  }
}