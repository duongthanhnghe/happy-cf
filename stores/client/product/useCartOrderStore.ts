import { computed } from "vue";
import { useRouter, useRoute } from 'nuxt/app';
import { defineStore } from "pinia";

import { useProductDetailStore } from "@/stores/client/product/useProductDetailStore";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';

import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";
import { useEventBus } from "@/composables/voucher/useEventBus";
import { useProductCartDetail } from '@/composables/product/useProductCartDetail';

import { useCartState } from '@/composables/cart/useCartState';
import { useCartProductOperations } from '@/composables/cart/useCartProductOperations';
import { useCartPricing } from '@/composables/cart/useCartPricing';
import { useCartVoucher } from '@/composables/cart/useCartVoucher';
import { useCartOrder } from '@/composables/cart/useCartOrder'
import { useCartShipping } from '@/composables/cart/useCartShipping';
import { useCartOptions } from '@/composables/cart/useCartOptions';
import { useCartUtils } from '@/composables/cart/useCartUtils';

import { ROUTES } from '@/shared/constants/routes';
import { useCartSharedUtils } from "@/composables/cart/useCartSharedUtils";
import { useCartVoucherHandlers } from "@/composables/cart/useCartVoucherHandlers";

export const useCartStore = defineStore("Cart", () => {
  const storeProduct = useProductDetailStore();
  const storeAddress = useAddressesManageStore();
  const storeAccount = useAccountStore();
  const storeLocation = useLocationStore();
  const storeSetting = useBaseInformationStore();
  
  const { fetchAvailableVouchers, allVouchers } = useAvailableVouchersForOrder();
  const eventBus = useEventBus();
  const { fetchCartProducts, getCartProducts } = useProductCartDetail();
  const router = useRouter();
  const route = useRoute();

  const state = useCartState();

  const fetchProductCart = async () => {
    const productIds = state.cartListItem.value.map((item: any) => item.product);
    await fetchCartProducts(productIds);

    if (getCartProducts) {
      state.cartListItem.value = state.cartListItem.value.map(item => {
        const productDetail = getCartProducts.value.find(p => p.id === item.product);
        return { ...item, ...productDetail };
      });

      pricing.handleCalcTotalPriceCurrent(storeAccount.getDetailValue?.membership?.discountRate);
    }
  };

  const pricing = useCartPricing(
    state.cartListItem,
    state.totalPriceCurrent,
    state.totalPriceDiscount,
    state.orderPriceDiscount,
    state.totalPriceSave,
    state.shippingFee,
    state.totalDiscountRateMembership,
    state.discountVoucher,
    state.discountVoucherFreeship,
    state.usedPointOrder,
    state.isCalculating
  );

  const handleCalcTotalPriceCurrent = () => {
    pricing.handleCalcTotalPriceCurrent(storeAccount.getDetailValue?.membership?.discountRate);
    
    const userId = storeAccount.getDetailValue?.id || '';
    const categoryIds = [...new Set(state.cartListItem.value.map(item => item.categoryId || ''))];
    
    if (categoryIds && state.totalPriceCurrent.value && route.path === ROUTES.PUBLIC.CART.path) {
      voucher.listVoucher(userId, categoryIds);
    }
  };

  const options = useCartOptions(
    state.selectedOptionsData,
    state.tempSelected,
    state.priceOptions,
  );

  const utilShared = useCartSharedUtils(
    state.quantity,
    state.priceTotal,
    state.note,
    state.productDetailEdit,
    state.selectedOptionsData,
    state.quantityEdit,
    state.priceTotalEdit,
    state.popups,
    options.clearTempSelected,
  );

  const utils = useCartUtils(
    state.cartCount,
    state.cartListItem,
    state.informationOrder,
    state.idAddressChoose,
    state.selectedOptionsData,
    state.usedPointOrder,
    state.totalPriceDiscount,
    state.isTogglePopup,
    fetchProductCart,
    handleCalcTotalPriceCurrent,
    utilShared.resetFormCart,
    storeLocation,
    storeAddress,
    state.isTogglePopupVoucher,
    state.isTogglePopupPoint,
    options.clearTempSelected,
  );

  const productOps = useCartProductOperations(
    state.cartListItem,
    state.cartCount,
    state.selectedOptionsData,
    state.productDetailEdit,
    state.quantityEdit,
    state.priceTotalEdit,
    state.selectedOptionsDataEdit,
    state.priceTotal,
    state.priceOptions,
    state.quantity,
    utils.updateCookie,
    utils.resetValuePopupOrder,
    options.updateSelectedOptionsData,
    options.syncTempSelectedFromSelectedOptionsData,
    utilShared.togglePopup as (popupId: string, value: boolean) => void,
  );

  const voucher = useCartVoucher(
    state.cartListItem,
    state.totalPriceCurrent,
    state.totalPriceDiscount,
    state.shippingFee,
    state.discountVoucher,
    state.discountVoucherFreeship,
    state.messageVoucher,
    state.voucherUsage,
    state.loadingAllVouchers,
    state.activeFreeshipVoucher,
    handleCalcTotalPriceCurrent,
    allVouchers,
    eventBus,
    fetchAvailableVouchers,
    route
  );

  const shipping = useCartShipping(
    state.cartListItem,
    state.totalPriceDiscount,
    state.shippingFee,
    handleCalcTotalPriceCurrent,
    voucher.reapplyFreeshippVoucher,
    storeLocation,
    storeSetting,
    storeAccount.getDetailValue?.id,
    state.activeFreeshipVoucher
  );

  const order = useCartOrder(
    state.cartListItem,
    state.informationOrder,
    state.paymentSelected,
    state.totalPriceDiscount,
    state.totalPriceSave,
    state.totalPriceCurrent,
    state.orderPriceDiscount,
    state.shippingFee,
    state.usedPointOrder,
    state.totalDiscountRateMembership,
    state.voucherUsage,
    state.discountVoucherFreeship,
    productOps.deleteCartAll,
    router,
    storeLocation
  );

  const addProductToCart = (product: any, quantity: number, note: string) => {
    return productOps.addProductToCart(
      product,
      quantity,
      note,
      options.buildSelectedOptions,
      storeProduct.popups.order
    );
  };
  
  const submitOrder = async () => {
    await order.submitOrder(
      storeAccount.getDetailValue?.id,
      storeAccount.getDetailValue?.membership?.discountRate
    );
  };

  const applyVoucher = async (code: string) => {
    await voucher.applyVoucher(code, storeAccount.getDetailValue?.id);
  };

  const handlesVoucher = useCartVoucherHandlers(
    state.selectedFreeship,
    state.selectedVoucher,
    state.voucherCode,
    state.discountVoucher,
    state.discountVoucherFreeship,
    state.activeFreeshipVoucher,
    state.voucherUsage,
    state.messageVoucher,
    applyVoucher,
    handleCalcTotalPriceCurrent,
  );

  const handleCheckPoint = async () => {
    await utils.handleCheckPoint(storeAccount.getDetailValue?.id);
  };

  const handleGetDefaultAddress = async () => {
    await utils.handleGetDefaultAddress(storeAccount.getDetailValue?.id);
  };

  const getCartCount = computed(() => state.cartCount.value);
  const getCartListItem = computed(() => state.cartListItem.value);
  const getIsTogglePopup = computed(() => state.isTogglePopup.value);
  const getTotalPriceCurrent = computed(() => state.totalPriceCurrent.value);
  const getTotalPriceDiscount = computed(() => state.totalPriceDiscount.value);
  const getTotalPoint = computed(() => storeAccount.getDetailValue?.membership.pointRate ? 
    Math.round(state.totalPriceCurrent.value * (storeAccount.getDetailValue.membership.pointRate / 100)) : 0
  );
  const getTotalPriceSave = computed(() => state.totalPriceSave.value);
  const getOrderPriceDiscount = computed(() => state.totalPriceCurrent.value - state.orderPriceDiscount.value);
  const getShippingFee = computed(() => state.shippingFee.value);
  const getPaymentSelected = computed(() => state.paymentSelected.value);
  const getSelectedOptionsData = computed(() => state.selectedOptionsData.value);
  const getIdAddressChoose = computed(() => state.idAddressChoose.value);
  const getNameAddressChoose = computed(() => state.informationOrder.address);
  const getProductDetailDataEdit = computed(() => state.productDetailEdit.value);
  const getMaxPointCanUse = computed(() =>  Math.floor(state.totalPriceDiscount.value * 0.1));
  
  return {
    ...state,
    ...utilShared,
    // Product operations
    addProductToCart,
    updateQuantity: productOps.updateQuantity,
    deleteCart: productOps.deleteCart,
    deleteCartAll: productOps.deleteCartAll,
    handleDeleteCartAll: productOps.handleDeleteCartAll,
    getTemplate1Amount: productOps.getTemplate1Amount,
    updateProductWithOptions: productOps.updateProductWithOptions,
    updateNormalProduct: productOps.updateNormalProduct,
    getProductDetailEdit: productOps.getProductDetailEdit,
    inDecrementEdit: productOps.inDecrementEdit,
    inDecrement: productOps.inDecrement,
    calcTotalPrice: productOps.calcTotalPrice,

    // Options
    setSelectedOptionsData: options.setSelectedOptionsData,
    updateSelectedOptionsData: options.updateSelectedOptionsData,
    syncTempSelectedFromSelectedOptionsData: options.syncTempSelectedFromSelectedOptionsData,
    clearTempSelected: options.clearTempSelected,
    handleSelectVariant: options.handleSelectVariant,

    // Order
    submitOrder,
    
    // Utils
    handleTogglePopup: utils.handleTogglePopup,
    handleChooseAddress: utils.handleChooseAddress,
    syncCartCookie: utils.syncCartCookie,
    handleTogglePopupVoucher: utils.handleTogglePopupVoucher,
    handleTogglePopupPoint: utils.handleTogglePopupPoint,
    handleGetDefaultAddress,
    handleCheckPoint,
    
    // Shipping
    handleGetFee: shipping.handleGetFee,
    
    // Voucher
    applyVoucher,
    reapplyFreeshippVoucher: voucher.reapplyFreeshippVoucher,
    
    // Pricing
    handleCalcTotalPriceCurrent,
    fetchProductCart,

    //voucher handle
    ...handlesVoucher,
    
    // Getters
    getCartCount,
    getCartListItem,
    getIsTogglePopup,
    getTotalPriceCurrent,
    getTotalPriceDiscount,
    getTotalPriceSave,
    getPaymentSelected,
    getSelectedOptionsData,
    getIdAddressChoose,
    getNameAddressChoose,
    getTotalPoint,
    getShippingFee,
    getOrderPriceDiscount,
    allVouchers,
    getProductDetailDataEdit,
    getMaxPointCanUse,
  };
});