import { watch } from 'vue';
import { showSuccess, showWarning } from '@/utils/toast';
import { useProductDetail } from '@/composables/product/useProductDetail'

export const useProductDetailOperations = (
  storeCart: any,
) => {

  const { getDetailProduct } = useProductDetail()

  const handleAddToCart = () => {
    if(!getDetailProduct.value) return

    const product = getDetailProduct.value;
    const selectedOptions = storeCart.tempSelected;

    if (product.variantGroups && product.variantGroups.length > 0) {
      const isAllRequiredSelected = product.variantGroups.every(group => {
        const selectedVariant = selectedOptions[group.groupId as any]  as any;
        
        return selectedVariant && group.selectedVariants.some(variant => 
          variant.variantId === selectedVariant
        );
      });

      if (!isAllRequiredSelected) {
        return showWarning("Vui lòng chọn đầy đủ các tùy chọn bắt buộc!");
      }
    }
    const res = storeCart.addProductToCart(getDetailProduct.value, storeCart.quantity, storeCart.note)
    if(res){
      showSuccess('Dat hang thanh cong')
      storeCart.resetFormCart()
    }
  }

  // const setCheckedRadioEdit = (idVariant: string) => {
  //   const result = storeCart.selectedOptionsDataEdit.value.includes(idVariant);
  //   storeCart.calcTotalPrice("order");
  //   return result;
  // }

  watch(getDetailProduct, (newValue) => {
    if(newValue) {
      storeCart.calcTotalPrice("order");
    }
  }, { immediate: true })

  return {
    handleAddToCart,
    // setCheckedRadioEdit,
  };
};