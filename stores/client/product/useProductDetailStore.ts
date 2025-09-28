import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetail } from '@/composables/product/useProductDetail'
import { useProductDetailHandle } from '@/composables/product/useProductDetailHandle'
import { useProductRelated } from '@/composables/product/useProductRelated'
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct'
import { useProductSEO } from '@/composables/seo/useProductSEO'
import { usePagination } from '@/utils/paginationHandle'
import { Loading} from '@/utils/global'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { showSuccess } from "@/utils/toast";
import type { ProductDTO, CartDTO, SelectedOptionDTO } from "@/server/types/dto/product.dto";

export const useProductDetailStore = defineStore("ProductDetailStore", () => {
  const { getDetailProduct, fetchDetailProduct } = useProductDetail()
  const { getListProductRelated } = useProductRelated()
  const { getListReview, fetchListReview } = useProductReviewByProduct()
  const { setProductSEO } = useProductSEO()
  
  const storeCart = useCartStore();

  const limitRelated = 12
  const limitReview = 1
  const pageReview = ref('1')
  const paginationReview = computed(() => getListReview.value?.pagination)
  const routePath = ROUTES.PUBLIC.PRODUCT.children?.DETAIL?.path ?? '/product'

  //handle order
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
        if(productDetailEdit.value) priceTotalEdit.value = productDetailEdit.value.priceDiscounts * quantityEdit.value;
      }
    }
  };

  const handleAddToCart = () => {
    if(!getDetailProduct.value) return
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
      setProductSEO(newValue, routePath)
      fetchListReview(newValue.id, 1, limitReview)
      calcTotalPrice("order");
    }
  }, { immediate: true })

  watch(pageReview, async (newValue) => {
    if(newValue && getListReview.value && getDetailProduct.value?.id) {
      Loading(true)
      try {
        await fetchListReview(getDetailProduct.value?.id,Number(newValue), limitReview)
      } catch (error) {
        console.error('category-news error:', error)
      }
      Loading(false)
    }
  })

  const { handleChangePage, getTotalPages } = usePagination(pageReview, computed(() => paginationReview.value?.totalPages ?? 0))
  const { percentDiscount, getSummaryReview, isFavorite, toggleLike } = useProductDetailHandle(getDetailProduct,getListReview)

  const getDetail = computed(() => getDetailProduct.value);
  const getListItems = computed(() => getListProductRelated.value);
  const getListReviewProduct = computed(() => getListReview.value?.data);
  const getSelectedOptionsDataEdit = computed(() =>  selectedOptionsDataEdit.value)
  const getProductDetailDataEdit = computed(() => productDetailEdit.value);

  return {
    getDetailProduct,
    getDetail,
    getListItems,
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
    getTotalPages,
    percentDiscount,
    getSummaryReview,
    getSelectedOptionsDataEdit,
    getProductDetailDataEdit,
  };
});
