import { showSuccess, showWarning } from '@/utils/toast';
import { useProductDetail } from '@/composables/product/useProductDetail'

export const useProductDetailOperations = (
  storeCart: any,
) => {

  const { getDetailProduct } = useProductDetail()

  const handleAddToCart = () => {
    if (!getDetailProduct.value) return

    const product = getDetailProduct.value
    const tempSelected = storeCart.tempSelected

    if (product.variantCombinations?.length > 0) {

      const requiredGroupIds = new Set(
        product.variantCombinations.flatMap(c =>
          c.variants.map(v => v.groupId)
        )
      )

      const isAllSelected = [...requiredGroupIds].every(
        groupId => !!tempSelected[groupId]
      )

      if (!isAllSelected) {
        return showWarning('Vui lòng chọn đầy đủ các tùy chọn!')
      }

      const matchedCombo = storeCart.findMatchedCombination(
        product.variantCombinations,
        tempSelected
      )

      if (!matchedCombo) {
        return showWarning('Tùy chọn không hợp lệ!')
      }

      storeCart.selectedCombination = matchedCombo
    }

    const res = storeCart.addProductToCart(
      product,
      storeCart.quantity,
      storeCart.note
    )

    if (res) {
      showSuccess('Thêm giỏ hàng thành công')
      storeCart.resetFormCart()
    }
  }

  return {
    handleAddToCart,
  };
};