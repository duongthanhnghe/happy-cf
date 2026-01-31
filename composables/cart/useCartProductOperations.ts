import { showWarning, showConfirm } from "@/utils/toast";
import { Base64 } from "js-base64";
import type { ProductDTO, CartDTO } from '@/server/types/dto/v1/product.dto';
import { type Ref } from 'vue';
import { useProductDetail } from '@/composables/product/useProductDetail'
import type { ProductVariantCombinationDTO } from "@/server/types/dto/v1/product.dto"; 
import { useProductCheckStock } from "../product/useProductCheckStock";
import { showAddToCartToast } from "@/utils/toast";
import { formatCurrency } from "@/utils/global";

export const useCartProductOperations = (
  cartListItem: Ref<CartDTO[]>,
  cartCount: Ref<number>,
  productDetailEdit: Ref<CartDTO|null|undefined>,
  quantityEdit: Ref<number>,
  quantity: Ref<number>,
  updateCookie: () => void,
  resetValuePopupOrder: () => void,
  syncTempSelectedFromCombination: (options: any) => void,
  togglePopup: (popupId: string, value: boolean) => void,
  getSelectedCombinationId: (variantCombinations: ProductVariantCombinationDTO[]) => string | undefined,
  handleTogglePopup: (value: boolean) => Promise<void>,
) => {

  const { getDetailProduct, fetchDetailProduct } = useProductDetail()
  const { checkStock, availableStock } = useProductCheckStock()

  const checkAvailableStock = async ({productId,nextQty,combinationId}: {
    productId: string
    nextQty: number
    combinationId?: string
  }) => {
    await checkStock({
      productId,
      quantity: nextQty,
      combinationId
    })

    if (!availableStock.value || availableStock.value === 0) {
      showWarning('Sản phẩm đã hết hàng')
      return false
    }

    if (nextQty > availableStock.value) {
      showWarning(`Chỉ còn ${availableStock.value} sản phẩm trong kho`)
      return false
    }

    return true
  }

  const findMatchedCombination = (
    combinations: ProductVariantCombinationDTO[],
    tempSelected: Record<string, string>
  ) => {
    return combinations.find(combo =>
      combo.variants.every(v => tempSelected[v.groupId] === v.variantId)
    )
  }

  const addNormalProduct = async (
    product: ProductDTO,
    quantity = 1
  ) => {
    const existingProduct = cartListItem.value.find(
      item => item.id === product.id
    )

    const currentQty = existingProduct?.quantity ?? 0
    const nextQty = currentQty + quantity

    const ok = await checkAvailableStock({
      productId: product.id,
      nextQty
    })
    if (!ok) return

    if (existingProduct) {
      existingProduct.quantity = nextQty
    } else {
      cartListItem.value.push({
        product: product.id,
        sku: product.sku,
        quantity
      })
    }

    cartCount.value += quantity
    updateCookie()

    showAddToCartToast({
      image: product.image,
      name: product.productName,
      price: formatCurrency(product.price),
      onViewCart: () => handleTogglePopup(true)
    })
  }

  const addProductWithOptions = async (
    product: ProductDTO,
    quantity: number,
    note: string,
    tempSelected: Record<string, string>,
    popupOrderState: boolean
  ) => {
    const matchedCombination = findMatchedCombination(
      product.variantCombinations,
      tempSelected
    )

    if (!matchedCombination) {
      showWarning('Vui lòng chọn đầy đủ phân loại')
      return
    }

    const rawKeyData = {
      combinationId: matchedCombination.id,
      note
    }

    const productKey = `${product.id}_${Base64.encode(
      JSON.stringify(rawKeyData)
    )}`

    const existingProduct = cartListItem.value.find(
      item => item.productKey === productKey
    )

    const currentQty = existingProduct?.quantity ?? 0
    const nextQty = currentQty + quantity

    // alert(matchedCombination.id)
    // return

    const ok = await checkAvailableStock({
      productId: product.id,
      nextQty,
      combinationId: matchedCombination.id
    })
    if (!ok) return

    if (existingProduct) {
      existingProduct.quantity = nextQty
    } else {
      cartListItem.value.push({
        product: product.id,
        productKey,
        combinationId: matchedCombination.id,
        quantity,
        sku: matchedCombination.sku,
        note,
        variantCombination: {
          id: matchedCombination.id,
          sku: matchedCombination.sku,
          priceModifier: matchedCombination.priceModifier,
          variants: matchedCombination.variants
        }
      })
    }

    cartCount.value += quantity
    updateCookie()
    resetValuePopupOrder()


    const variantText = matchedCombination.variants
    .map(v => v.variantName)
    .join(' / ')

    showAddToCartToast({
      image: product.image,
      name: product.productName,
      variant: `${variantText}`,
      price: formatCurrency(matchedCombination.priceModifier),
      onViewCart: () => handleTogglePopup(true)
    })
  }

  const updateProductWithOptions = async (
    product: CartDTO | null,
    quantity: number,
    note: string | undefined,
    oldProductKey: string | undefined,
    tempSelected: Record<string, string>
  ) => {
    const index = cartListItem.value.findIndex(
      item => item.productKey === oldProductKey
    )
    if (index === -1 || !product || !product.variantCombinations) return

    const matchedCombination = findMatchedCombination(
      product.variantCombinations,
      tempSelected
    )

    if (!matchedCombination) {
      showWarning('Vui lòng chọn đầy đủ phân loại')
      return
    }

    const newKey = `${product.id}_${Base64.encode(
      JSON.stringify({ combinationId: matchedCombination.id, note })
    )}`

    const oldQty = cartListItem.value[index].quantity

    //key không đổi → chỉ update
    if (newKey === oldProductKey) {
      cartListItem.value[index] = {
        ...cartListItem.value[index],
        quantity,
        note
      }

      cartCount.value = cartCount.value - oldQty + quantity
      updateCookie()
      resetValuePopupOrder()
      return
    }

    //key đổi → check trùng
    const existedIndex = cartListItem.value.findIndex(
      item => item.productKey === newKey
    )

    if (existedIndex !== -1) {
      const existedItem = cartListItem.value[existedIndex]
      const mergedQty = existedItem.quantity + quantity

      if(!product.id) return
      const ok = await checkAvailableStock({
        productId: product.id,
        nextQty: mergedQty,
        combinationId: matchedCombination.id
      })
      if (!ok) return

      existedItem.quantity = mergedQty
      cartCount.value = cartCount.value - oldQty
      cartListItem.value.splice(index, 1)
    } else {
      cartListItem.value[index] = {
        ...cartListItem.value[index],
        productKey: newKey,
        quantity,
        combinationId: matchedCombination.id,
        sku: matchedCombination.sku,
        note,
        variantCombination: {
          id: matchedCombination.id,
          sku: matchedCombination.sku,
          priceModifier: matchedCombination.priceModifier,
          variants: matchedCombination.variants
        }
      }

      cartCount.value = cartCount.value - oldQty + quantity
    }

    updateCookie()
    resetValuePopupOrder()
  }

  const updateNormalProduct = async (
    product: CartDTO | null,
    quantity: number,
    note?: string,
    oldProductKey?: string
  ) => {
    if (!product || !oldProductKey) return

    const index = cartListItem.value.findIndex(
      item => item.id === oldProductKey
    )
    if (index === -1) return

    if(!product.id) return
    const ok = await checkAvailableStock({
      productId: product.id,
      nextQty: quantity
    })
    if (!ok) return

    const oldQty = cartListItem.value[index].quantity

    cartListItem.value[index] = {
      ...cartListItem.value[index],
      quantity,
      note
    }

    cartCount.value = cartCount.value - oldQty + quantity
    updateCookie()
    resetValuePopupOrder()
  }

  const addProductToCart = (
    product: ProductDTO,
    quantity: number,
    note: string,
    tempSelected: Record<string, string>,
    popupOrderState: boolean
  ) => {
    if (!product) return false

    if (product.variantCombinations?.length > 0) {
      addProductWithOptions(product, quantity, note, tempSelected, popupOrderState)
    } else {
      if (product.amount <= 0) return false
      addNormalProduct(product, quantity)
    }

    return true
  }

  const updateQuantity = async (productKey: string, isPlus: boolean) => {
    const item = cartListItem.value.find(i =>
      i.productKey ? i.productKey === productKey : i.id === productKey
    )
    if (!item || !item.id) return

    if (!isPlus) {
      if (item.quantity > 1) {
        item.quantity--
        cartCount.value--
        updateCookie()
      }
      return
    }

    const nextQty = item.quantity + 1

    const ok = await checkAvailableStock({
      productId: item.id,
      nextQty,
      combinationId: item.variantCombination?.id
    })
    if (!ok) return

    item.quantity++
    cartCount.value++
    updateCookie()
  }

  const deleteCart = async (productKey: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá?');
    if (!confirm) return;

    const elProduct = cartListItem.value.find((item) => {
      if (item.productKey && productKey.includes("_")) {
        return item.productKey === productKey;
      }
      return item.id === productKey;
    });

    if (elProduct) {
      cartListItem.value = cartListItem.value.filter((item) => {
        if (item.productKey && productKey.includes("_")) {
          return item.productKey !== productKey;
        }
        return item.id !== productKey;
      });

      cartCount.value = cartCount.value - elProduct.quantity;
      updateCookie();
    }
  };

  const deleteCartAll = () => {
    cartCount.value = 0;
    cartListItem.value = [];
    updateCookie();
  };

  const handleDeleteCartAll = async () => {
    const confirm = await showConfirm('Bạn có chắc xoá?');
    if (!confirm) return;
    
    deleteCartAll();
  };

  const getTemplate1Amount = (productKey: string) => {
    if (!cartListItem.value || cartListItem.value.length === 0) {
      return 0;
    }
    const totalQuantity = cartListItem.value
      .filter((item) => item.id === productKey)
      .reduce((total, item) => total + item.quantity || 0, 0);
    return totalQuantity;
  };

  const getProductDetailEdit = async (id: string) => {
    productDetailEdit.value = cartListItem.value.find(item => {
      if (item.productKey && id.includes('_')) return item.productKey === id
      return item.id === id
    })

    if (!productDetailEdit.value || !productDetailEdit.value.id ) return

    quantityEdit.value = productDetailEdit.value.quantity

    // await fetchDetailProduct(productDetailEdit.value?.id)

    // SYNC VARIANT ĐÃ CHỌN
    if (productDetailEdit.value.variantCombination?.variants) {
      syncTempSelectedFromCombination(
        productDetailEdit.value.variantCombination.variants
      )
    }

    togglePopup('edit', true)
  }

  const inDecrementEdit = async (isPlus: boolean) => {
    if (!isPlus) {
      if (quantityEdit.value > 1) quantityEdit.value--
      return
    }

    const item = productDetailEdit.value
    if (!item || !item.id) return

    const nextQty = quantityEdit.value + 1

    const ok = await checkAvailableStock({
      productId: item.id,
      nextQty,
      combinationId: item.variantCombination?.id
    })
    if (!ok) return

    quantityEdit.value = nextQty
  }
    
  const inDecrement = async (isPlus: boolean) => {
    if (!isPlus) {
      if (quantity.value > 1) quantity.value--
      return
    }
    
    const product = getDetailProduct.value

    if (!product) return

    const combinationId = getSelectedCombinationId(
      product.variantCombinations
    )

    const nextQty = quantity.value + 1

    const ok = await checkAvailableStock({
      productId: product.id,
      nextQty,
      combinationId
    })
    if (!ok) return

    quantity.value = nextQty
  }

  return {
    addNormalProduct,
    addProductWithOptions,
    updateProductWithOptions,
    updateNormalProduct,
    addProductToCart,
    updateQuantity,
    deleteCart,
    deleteCartAll,
    handleDeleteCartAll,
    getTemplate1Amount,
    getProductDetailEdit,
    inDecrementEdit,
    inDecrement,
    // calcTotalPrice,
    findMatchedCombination,
  };
};