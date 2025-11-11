import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetail } from '@/composables/product/useProductDetail'
import { useProductDetailHandle } from '@/composables/product/useProductDetailHandle'
import { useProductRelated } from '@/composables/product/useProductRelated'
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct'
import { usePagination } from '@/utils/paginationHandle'
import { Loading} from '@/utils/global'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { showSuccess, showWarning } from "@/utils/toast";
import type { CartDTO, SelectedOptionDTO } from "@/server/types/dto/v1/product.dto";
import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";

export const useProductDetailStore = defineStore("ProductDetailStore", () => {
  const { getDetailProduct, fetchDetailProduct } = useProductDetail()
  const { getListProductRelated, loading: loadingListRelated } = useProductRelated()
  const { getListReview, fetchListReview, loading: loadingListReviews } = useProductReviewByProduct()
  const { getVoucherProduct, loading: loadingListVoucher } = useAvailableVouchersForOrder();
  const storeCart = useCartStore();

  const limitRelated = 12
  const limitReview = 1
  const pageReview = ref('1')
  const paginationReview = computed(() => getListReview.value?.pagination)
  const quantity = ref(1);
  const priceTotal = ref(0);
  const priceOptions = ref(0);
  const note = ref("");
  const productDetailEdit = ref<CartDTO|null|undefined>(null);
  const quantityEdit = ref(0);
  const priceTotalEdit = ref(0);
  const selectedOptionsDataEdit = ref<(string | number | boolean)[]>([]);
  const popups = ref({
    order: false,
    edit: false,
  });

  const getProductDetailApi = async (id: string) => {
    await fetchDetailProduct(id);
    togglePopup("order", true);
    calcTotalPrice("order");
    storeCart.selectedOptionsData = [];
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

  const calcTotalPrice = (formId: string) => {
    if(formId === "order") {
      if(getDetailProduct.value) {
        priceTotal.value = (getDetailProduct.value.priceDiscounts + priceOptions.value) * quantity.value;
      }
    }
    else if(formId === "edit") {
      if(productDetailEdit.value?.finalPriceDiscounts){
        priceTotalEdit.value = productDetailEdit.value.finalPriceDiscounts * quantityEdit.value;
      } else {
        if(productDetailEdit.value && productDetailEdit.value.priceDiscounts) priceTotalEdit.value = productDetailEdit.value.priceDiscounts * quantityEdit.value;
      }
    }
  };

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

    const res = storeCart.addProductToCart(getDetailProduct.value, quantity.value, note.value)
    if(res){
      showSuccess('Dat hang thanh cong')
      resetFormCart()
    }
  }

  const resetFormCart = () => {
    quantity.value = 1;
    note.value = '';
    priceTotal.value = getDetailProduct.value?.priceDiscounts || 0;
    productDetailEdit.value = null;
    storeCart.selectedOptionsData = [];
    quantityEdit.value = 0;
    priceTotalEdit.value = 0;
    togglePopup("edit", false);
    togglePopup("order", false);
  }

  const inDecrementEdit = (type: boolean) => {
    if (type === false) {
      if (quantityEdit.value == 1) return;
      quantityEdit.value--;
    } else {
      quantityEdit.value++;
    }

    calcTotalPrice("edit");
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
  //end

  watch(getDetailProduct, (newValue) => {
    if(newValue) {
      calcTotalPrice("order");
    }
  }, { immediate: true })

  watch(pageReview, async (newValue) => {
    if(newValue && getListReview.value && getDetailProduct.value?.id) {
      console.log("truoc"+loadingListReviews.value)
      Loading(true)
      try {
        await fetchListReview(getDetailProduct.value?.id,Number(newValue), limitReview)
      } catch (error) {
        console.error('category-news error:', error)
      }
      Loading(false)
      console.log("sau"+loadingListReviews.value)
    }
  })

  const { handleChangePage, getTotalPages } = usePagination(pageReview, computed(() => paginationReview.value?.totalPages ?? 0))
  const { percentDiscount, getSummaryReview, isFavorite, toggleLike } = useProductDetailHandle(getDetailProduct,getListReview)

  const getDetail = computed(() => getDetailProduct.value);
  const getListReviewProduct = computed(() => getListReview.value?.data);
  const getSelectedOptionsDataEdit = computed(() =>  selectedOptionsDataEdit.value)
  const getProductDetailDataEdit = computed(() => productDetailEdit.value);

  return {
    getDetailProduct,
    getDetail,
    limitRelated,
    getListReviewProduct,
    pageReview,
    isFavorite,
    note,
    quantity,
    priceTotal,
    productDetailEdit,
    priceTotalEdit,
    quantityEdit,
    popups,
    loadingListRelated,
    loadingListReviews,
    loadingListVoucher,
    getVoucherProduct,
    limitReview,
    handleChangePage,
    toggleLike,
    inDecrement,
    handleAddToCart,
    getPopupState,
    setCheckedRadioEdit,
    getProductDetailEdit,
    inDecrementEdit,
    getProductDetailApi,
    togglePopup,
    resetFormCart,
    calcTotalPrice,
    getListProductRelated,
    getTotalPages,
    percentDiscount,
    getSummaryReview,
    getSelectedOptionsDataEdit,
    getProductDetailDataEdit,
  };
});
