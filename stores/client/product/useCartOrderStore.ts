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

import { useCartSharedUtils } from "@/composables/cart/useCartSharedUtils";
import { useCartVoucherHandlers } from "@/composables/cart/useCartVoucherHandlers";
import type { CartDTO, ProductVariantCombinationDTO, VariantGroupUI } from "@/server/types/dto/v1/product.dto";

export const useCartStore = defineStore("Cart", () => {
  const storeProduct = useProductDetailStore();
  const storeAddress = useAddressesManageStore();
  const storeAccount = useAccountStore();
  const storeLocation = useLocationStore();
  const storeSetting = useBaseInformationStore();
  
  const { fetchAvailableVouchers, allVouchers } = useAvailableVouchersForOrder();
  const eventBus = useEventBus();
  const { fetchCartProducts, getCartProducts, loadingData: loadingCartProduct } = useProductCartDetail();
  const router = useRouter();
  const route = useRoute();

  const state = useCartState();
  
  const fetchProductCart = async () => {
    const productIds = state.cartListItem.value.map((item: any) => item.product);
    await fetchCartProducts(productIds);

    if (!getCartProducts.value) return;

    state.cartListItem.value = state.cartListItem.value.map(item => {
      const productDetail = getCartProducts.value!.find(
        p => p.id === item.product
      );

      if (!productDetail) return item;

      let variantCombination: ProductVariantCombinationDTO | undefined;

      if (item.combinationId && productDetail.variantCombinations?.length) {
        variantCombination = productDetail.variantCombinations.find(
          vc => vc.id === item.combinationId
        );
      }

      const cartItem: CartDTO = {
        ...item,
        id: productDetail.id,
        productName: productDetail.productName,
        image: productDetail.image,
        variantCombinations: productDetail.variantCombinations,
        categoryId: productDetail.categoryId,
        weight: productDetail.weight,
        price: productDetail.price,
        priceDiscounts: productDetail.priceDiscounts,
        sku: variantCombination?.sku ?? productDetail.sku,
        variantCombination,
      };

      return cartItem;
    });

    pricing.handleCalcTotalPriceCurrent(
      storeAccount.getDetailValue?.membership?.discountRate
    );
  };

  const variantGroupsUI = computed(
    () => (variantCombinations?: ProductVariantCombinationDTO[]): VariantGroupUI[] => {

      if (!Array.isArray(variantCombinations) || variantCombinations.length === 0) {
        return []
      }

      const map = new Map<string, VariantGroupUI>()

      const validCombos = variantCombinations.filter(c => c?.inStock)

      validCombos.forEach(combo => {
        combo.variants?.forEach(v => {
          if (!map.has(v.groupId)) {
            map.set(v.groupId, {
              groupId: v.groupId,
              groupName: v.groupName,
              variants: []
            })
          }

          const group = map.get(v.groupId)!

          const selected = state.tempSelected ?? {}

          const hasStock = validCombos.some(c => {
            if (c.stock <= 0) return false

            const matchSelected = Object.entries(selected).every(
              ([gId, vId]) =>
                gId === v.groupId ||
                c.variants?.some(
                  x => x.groupId === gId && x.variantId === vId
                )
            )

            return (
              matchSelected &&
              c.variants?.some(
                x => x.groupId === v.groupId && x.variantId === v.variantId
              )
            )
          })

          if (!group.variants.some(x => x.variantId === v.variantId)) {
            group.variants.push({
              variantId: v.variantId,
              variantName: v.variantName,
              hasStock
            })
          }
        })
      })

      return Array.from(map.values())
    }
  )

  const getMatchedCombination = (
    variantCombinations: ProductVariantCombinationDTO[]
  ): ProductVariantCombinationDTO | undefined => {
    return variantCombinations.find(combo =>
      combo.variants.every(
        v => state.tempSelected[v.groupId] === v.variantId
      )
    )
  }

  const getSelectedVariantPrice = (
    variantCombinations: ProductVariantCombinationDTO[]
  ): number => {
    const matched = getMatchedCombination(variantCombinations)
    return matched?.priceModifier ?? 0
  }

  const getSelectedVariantName = computed(
    () =>
      (
        groupId: string,
        variantCombinations: ProductVariantCombinationDTO[]
      ): string => {
        const selectedVariantId = state.tempSelected[groupId]
        if (!selectedVariantId) return ''

        for (const combo of variantCombinations) {
          const found = combo.variants.find(
            v =>
              v.groupId === groupId &&
              v.variantId === selectedVariantId
          )
          if (found) return found.variantName
        }

        return ''
      }
  )

  const getSelectedVariantStock = (
    variantCombinations: ProductVariantCombinationDTO[]
  ): number => {
    if (!variantCombinations?.length) return 0

    const matched = variantCombinations.find(combo =>
      combo.variants.every(
        v => state.tempSelected[v.groupId] === v.variantId
      )
    )

    return matched?.stock ?? 0
  }

  const autoSelectFirstVariants = (groups: VariantGroupUI[]) => {
    groups.forEach(group => {
      if (state.tempSelected[group.groupId]) return

      const firstAvailable = group.variants.find(v => v.hasStock)

      if (!firstAvailable) return

      options.handleSelectVariant(
        group.groupId,
        firstAvailable.variantId,
        group.groupName,
        firstAvailable.variantName,
        0
      )
    })
  }

  const getSelectedCombinationId = (
    variantCombinations: ProductVariantCombinationDTO[]
  ): string | undefined => {
    if (!variantCombinations?.length) return undefined

    const matched = variantCombinations.find(combo =>
      combo.variants.every(
        v => state.tempSelected[v.groupId] === v.variantId
      )
    )

    return matched?.id
  }

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
    
    if (categoryIds && state.totalPriceCurrent.value) {
      voucher.listVoucher(userId, categoryIds);
    }
  };

  const options = useCartOptions(
    state.selectedOptionsData,
    state.tempSelected,
    state.needAutoSelect,
  );

  const utilShared = useCartSharedUtils(
    state.quantity,
    state.note,
    state.productDetailEdit,
    state.selectedOptionsData,
    state.quantityEdit,
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
    state.productDetailEdit,
    state.quantityEdit,
    state.quantity,
    utils.updateCookie,
    utils.resetValuePopupOrder,
    options.syncTempSelectedFromCombination,
    utilShared.togglePopup as (popupId: string, value: boolean) => void,
    getSelectedCombinationId,
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
    () => route.path   
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
      state.tempSelected,
      storeProduct.popups.order
    );
  };

  const submitOrder = async () => {
    await order.submitOrder(
      storeAccount.getDetailValue?.id
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
  const getOrderPriceDiscount = computed(() => state.orderPriceDiscount.value);
  const getTotalPriceOrder = computed(() => state.totalPriceDiscount.value);
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
    loadingCartProduct,
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
    findMatchedCombination: productOps.findMatchedCombination,

    // Options
    setSelectedOptionsData: options.setSelectedOptionsData,
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
    resetPoint: utils.resetPoint,
    
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
    getTotalPriceOrder,
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
    variantGroupsUI,
    getSelectedVariantName,
    getMatchedCombination,
    getSelectedVariantPrice,
    autoSelectFirstVariants,
    getSelectedVariantStock,
  };
});