import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "@/stores/product/useCartOrderStore";
import { useProductDetail } from "@/composables/product/useProductDetail";
import type { ProductDTO, CartDTO, SelectedOptionDTO } from "@/server/types/dto/product.dto";

export const useProductStore = defineStore("Product", () => {
  //store
  const storeCart = useCartStore();
  const { getDetailProduct, fetchDetailProduct } = useProductDetail();

  // state
  const popups = ref({
    order: false,
    edit: false,
  });
  const productDetail = ref<ProductDTO|null>(null);
  const productDetailEdit = ref<CartDTO|null|undefined>(null);
  const isTogglePopup = ref(false);
  const isTogglePopupEdit = ref(false);
  const quantity = ref(1);
  const priceOptions = ref(0);
  const priceTotal = ref(0);
  const note = ref("");
  const quantityEdit = ref(0);
  const selectedOptionsDataEdit = ref<(string | number | boolean)[]>([]);

  //actions
  const getProductDetailApi = async (id: string) => {
    await fetchDetailProduct(id);
    if(getDetailProduct.value) productDetail.value = getDetailProduct.value
    togglePopup("order", true);
    calcTotalPrice("order");
    storeCart.selectedOptionsData = [];
  };

  const getProductDetailEdit = (id: string) => {
    productDetailEdit.value = storeCart.getCartListItem.find((item) => {
      if (item.productKey && id.includes("_")) {
        return item.productKey === id;
      }
      return item.id === id;
    });

    if (!productDetailEdit.value) return;

    quantityEdit.value = productDetailEdit.value.quantity;

    if (productDetailEdit.value.productKey && productDetailEdit.value.selectedOptionsPush) {
      // map lại selectedOptionsDataEdit nếu bạn còn dùng
      selectedOptionsDataEdit.value = productDetailEdit.value.selectedOptionsPush.map(
        (obj) => Object.values(obj)[0]
      );

      const newOptions = productDetailEdit.value.selectedOptionsPush;

      // 1. Cập nhật selectedOptionsData (dùng để tính giá, thêm giỏ hàng...)
      storeCart.updateSelectedOptionsData(newOptions as SelectedOptionDTO[]);

      // 2. Đồng bộ tempSelected để v-radio-group tự checked
      if (productDetailEdit.value.options) {
        storeCart.syncTempSelectedFromSelectedOptionsData(productDetailEdit.value.options);
      }
    }

    togglePopup("edit", true);
    calcTotalPrice("edit");
  };


  const calcTotalPrice = (formId: string) => {
    if(formId === "order") {
      if(productDetail.value) {
        priceTotal.value = (productDetail.value.priceDiscounts + priceOptions.value) * quantity.value;
      }
    }
    else if(formId === "edit") {
      if(productDetailEdit.value?.finalPriceDiscounts){
        priceTotal.value = productDetailEdit.value.finalPriceDiscounts * quantityEdit.value;
      } else {
        if(productDetailEdit.value) priceTotal.value = productDetailEdit.value.priceDiscounts * quantityEdit.value;
      }
    }
  };

  const inDecrement = (type: boolean) => {
    if (type === false) {
      if (quantity.value == 1) return;
      quantity.value--;
    } else {
      quantity.value++;
    }

    calcTotalPrice("order");
  };

  const inDecrementEdit = (type: boolean) => {
    if (type === false) {
      if (quantityEdit.value == 1) return;
      quantityEdit.value--;
    } else {
      quantityEdit.value++;
    }

    calcTotalPrice("edit");
  };

  const setQuantity = (value: number) => {
    quantity.value = value;
  };

  const setPriceTotal = (value: number) => {
    priceTotal.value = value;
  };

   const setNote = (value: string) => {
    note.value = value;
  };

  const togglePopup = (popupId: keyof typeof popups.value, value: any) => {
    if (popups.value[popupId] !== undefined) popups.value[popupId] = value;
  };

  const getPopupState = (popupId: keyof typeof popups.value) => {
    return popups.value[popupId] || false;
  };

  const setCheckedRadioEdit = (idVariant: string) => {
    const result = selectedOptionsDataEdit.value.includes(idVariant);
    return result;
  }


  //getters
  const getProductDetailData = computed(() => productDetail.value);
  const getProductDetailDataEdit = computed(() => productDetailEdit.value);
  const getQuantity = computed(() => quantity.value);
  const getPriceTotal = computed(() => priceTotal.value);
  const getPriceOptions = computed(() => priceOptions.value);
  const getNote = computed(() => note.value);
  const getQuantityEdit = computed(() => quantityEdit.value);
  const getSelectedOptionsDataEdit = computed(() =>  selectedOptionsDataEdit.value)
  
  return {
    // state
    popups,
    productDetail,
    productDetailEdit,
    isTogglePopup,
    isTogglePopupEdit,
    priceOptions,
    quantity,
    quantityEdit,
    selectedOptionsDataEdit,
    // actions
    getProductDetailApi,
    calcTotalPrice,
    inDecrement,
    inDecrementEdit,
    setQuantity,
    setPriceTotal,
    setNote,
    getProductDetailEdit,
    togglePopup,
    getPopupState,
    setCheckedRadioEdit,

    //getters
    getProductDetailData,
    getProductDetailDataEdit,
    getQuantity,
    getNote,
    getPriceTotal,
    getPriceOptions,
    getQuantityEdit,
    getSelectedOptionsDataEdit
  };
});
