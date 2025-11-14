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
    const selectedOptions = storeCart.selectedOptionsData;

    if (product.options && product.options.length > 0) {
      const isAllRequiredSelected = product.options.every(group => {
        const selectedVariant = selectedOptions[group.id as any]  as any;
        
        return selectedVariant && group.variants.some(variant => 
          variant.id === selectedVariant
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

  const setCheckedRadioEdit = (idVariant: string) => {
    const result = storeCart.selectedOptionsDataEdit.value.includes(idVariant);
    storeCart.calcTotalPrice("order");
    return result;
  }

  watch(getDetailProduct, (newValue) => {
    if(newValue) {
      storeCart.calcTotalPrice("order");
    }
  }, { immediate: true })

  return {
    handleAddToCart,
    setCheckedRadioEdit,
  };
};