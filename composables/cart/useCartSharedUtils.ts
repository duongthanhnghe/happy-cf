import type { SelectedOptionPushDTO } from '@/server/types/dto/v1/product.dto';
import { type Ref } from 'vue';
import { useProductDetail } from '@/composables/product/useProductDetail'

export const useCartSharedUtils = (
  quantity: Ref<number>,
  note: Ref<string>,
  productDetailEdit: Ref<any>,
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  quantityEdit: Ref<number>,
  popups: Ref<{order:boolean,edit:boolean}>,
  clearTempSelected: () => void,
) => {

  const { getDetailProduct, fetchDetailProduct } = useProductDetail()

  const resetFormCart = () => {
    quantity.value = 1;
    note.value = '';
    productDetailEdit.value = null;
    selectedOptionsData.value = [];
    quantityEdit.value = 0;
    togglePopup("edit", false);
    togglePopup("order", false);
  };

  const getProductDetailApi = async (id: string) => {
    await fetchDetailProduct(id);
    if(!getDetailProduct) return
    togglePopup("order", true);
    selectedOptionsData.value = [];
  };

  const togglePopup = (popupId: keyof typeof popups.value, value: any) => {
    if(popupId === 'order' && popups.value[popupId] === false) clearTempSelected();
    if(popups.value[popupId] !== undefined) popups.value[popupId] = value;
  };

  const getPopupState = (popupId: keyof typeof popups.value) => {
    return popups.value[popupId] || false;
  };

  return {
    getProductDetailApi,
    resetFormCart,
    togglePopup,
    getPopupState,
  };
};
