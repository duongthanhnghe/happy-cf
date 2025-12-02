import { showWarning, showConfirm } from "@/utils/toast";
import { Base64 } from "js-base64";
import type { ProductDTO, CartDTO, SelectedOptionPushDTO, SelectedOptionDTO, VariantGroupDTO, ProductVariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import type { Ref } from 'vue';
import { useProductDetail } from '@/composables/product/useProductDetail'

export const useCartProductOperations = (
  cartListItem: Ref<CartDTO[]>,
  cartCount: Ref<number>,
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  productDetailEdit: Ref<CartDTO|null|undefined>,
  quantityEdit: Ref<number>,
  priceTotalEdit: Ref<number>,
  selectedOptionsDataEdit: Ref<(string | number | boolean)[]>,
  priceTotal: Ref<number>,
  priceOptions: Ref<number>,
  quantity: Ref<number>,
  updateCookie: () => void,
  resetValuePopupOrder: () => void,
  updateSelectedOptionsData: (newOptions: SelectedOptionDTO[]) => void,
  syncTempSelectedFromSelectedOptionsData: (options: any) => void,
  togglePopup: (popupId: string, value: boolean) => void,
) => {

  const { getDetailProduct, fetchDetailProduct } = useProductDetail()
  
  const addNormalProduct = (product: ProductDTO, quantity?: number) => {
    const existingProduct = cartListItem.value?.find(
      (item) => item.id === product.id
    );
    if (existingProduct && existingProduct.quantity) {
      quantity ? existingProduct.quantity += quantity : existingProduct.quantity++;
    } else {
      cartListItem.value?.push({
        product: product.id,
        quantity: quantity ? quantity : 1,
      });
    }
    quantity ? cartCount.value += quantity : cartCount.value++;
  };
  
  const addProductWithOptions = (
    product: ProductDTO, 
    selectedOptions: SelectedOptionPushDTO[], 
    quantity: number, 
    note: string,
    popupOrderState: boolean
  ) => {

    const sortedOptions = [...selectedOptions].sort((a, b) =>
      a.optionName.localeCompare(b.optionName)
    );

    const rawEncodeData = {
      selectedOptions: sortedOptions,
      note
    };
    
    const productKey = `${product.id}_${Base64.encode(JSON.stringify(rawEncodeData))}`;
    // const productKey = `${product.id}_${Base64.encode(JSON.stringify({
    //   selectedOptions,
    //   note
    // }))}`;
    const existingProduct = cartListItem.value?.find(
      (item) => item.productKey === productKey
    );

    if (existingProduct && existingProduct.quantity) {
      existingProduct.quantity = existingProduct.quantity + quantity;
      cartCount.value += quantity;
    } else {
      if (product.variantGroups.length > selectedOptions.length) {
        showWarning("Vui lòng chọn đầy đủ options!");
        return;
      }

      const optionsPrice = product.variantGroups?.reduce((total, option) => {
        const selectedOption = selectedOptions.find(
          (so) => so.optionName === option.groupName
        );

        const selectedVariant = option.selectedVariants?.find(
          (v) => v.variantName === selectedOption?.variantName
        );

        return total + (selectedVariant?.priceModifier || 0);
      }, 0) ?? 0;

      cartListItem.value?.push({
        product: product.id,
        productKey,
        quantity: quantity,
        selectedOptionsPush: [...selectedOptions],
        note: note,
        finalPrice: product.price + optionsPrice,
        finalPriceDiscounts: product.priceDiscounts + optionsPrice,
      });

      cartCount.value += quantity;
    }

    resetValuePopupOrder();
  };

  const updateProductWithOptions = (
    product: ProductDTO | null, 
    quantity: number, 
    note?: string, 
    oldProductKey?: string
  ) => {
    if(!product) return
    const selectedOptions = selectedOptionsData.value;
    try {
      const newProductKey = `${product.id}_${Base64.encode(JSON.stringify(note ? selectedOptions+note : selectedOptions))}`;
      
      const existingProductIndex = cartListItem.value?.findIndex(
        item => item.productKey === oldProductKey
      );

      if (existingProductIndex === -1) {
        console.error('Khong ton tai san pham');
        return;
      }

      const optionsPrice = product.variantGroups?.reduce((total, option) => {
        const selectedOption = selectedOptions.find(
          (so) => so.optionName === option.groupName
        );

        const selectedVariant = option.selectedVariants?.find(
          (v) => v.variantName === selectedOption?.variantName
        );

        return total + (selectedVariant?.priceModifier || 0);
      }, 0) ?? 0;

      const updatedProduct = {
        // ...product,
        product: product.id,
        productKey: newProductKey,
        quantity: quantity,
        selectedOptionsPush: [...selectedOptions],
        note: note,
        finalPrice: product.price + optionsPrice,
        finalPriceDiscounts: product.priceDiscounts + optionsPrice,
      };

      const oldQuantity = cartListItem.value[existingProductIndex].quantity || 0;
      cartCount.value = cartCount.value - oldQuantity + quantity;

      cartListItem.value[existingProductIndex] = updatedProduct;

      if (product.variantGroups) {
        syncTempSelectedFromSelectedOptionsData(product.variantGroups);
      }

      updateCookie();
      resetValuePopupOrder();

    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const updateNormalProduct = (
    product: ProductDTO | null, 
    quantity: number, 
    note?: string, 
    oldProductKey?: string
  ) => {
    if(!product || !oldProductKey) return;
    
    const existingProduct = cartListItem.value.findIndex(
      item => item.id === oldProductKey
    );

    if (existingProduct === -1) {
        console.error('Khong ton tai san pham');
        return;
    }
   
    const updatedProduct = {
      ...product,
      product: product.id,
      quantity: quantity,
      note: note,
    };

    const oldQuantity = cartListItem.value[existingProduct].quantity;
    cartCount.value = cartCount.value - oldQuantity + quantity;

    cartListItem.value[existingProduct] = updatedProduct;

    resetValuePopupOrder();
  };

  const addProductToCart = (
    product: ProductDTO,
    quantity: number, 
    note: string,
    buildSelectedOptions: (options: ProductVariantGroupDTO[]) => SelectedOptionPushDTO[],
    popupOrderState: boolean
  ) => {
    if (!product || product.amount <= 0) return false;

    selectedOptionsData.value = buildSelectedOptions(product.variantGroups);
    
    if (product.variantGroups.length > 0) {
      addProductWithOptions(product, selectedOptionsData.value, quantity, note, popupOrderState);
    } else {
      addNormalProduct(product, quantity);
    }
    updateCookie();
    return true;
  };

  const updateQuantity = (productKey: string, type: boolean) => {
    const elProduct = cartListItem.value.find((item) => {
      if (item.productKey && productKey.includes("_")) {
        return item.productKey === productKey;
      } else {
        return item.id === productKey;
      }
    });
    
    if (elProduct) {
      if (type === false) {
        if (elProduct.quantity == 1) return;
        cartCount.value--;
        elProduct.quantity--;
      } else {
        cartCount.value++;
        elProduct.quantity++;
      }
      updateCookie();
    }
  };

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

  const calcTotalPrice = (formId: 'order'|'edit') => {
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

  const getProductDetailEdit = async (id: string) => {
    productDetailEdit.value = cartListItem.value.find((item: CartDTO) => {
      if (item.productKey && id.includes("_")) return item.productKey === id;
      return item.id === id;
    });
    if (!productDetailEdit.value) return;

    quantityEdit.value = productDetailEdit.value.quantity;

    if (productDetailEdit.value.selectedOptionsPush) {
      const newOptions = JSON.parse(JSON.stringify(productDetailEdit.value.selectedOptionsPush));
      updateSelectedOptionsData(newOptions as SelectedOptionDTO[]);
    }

    if (productDetailEdit.value.id) {
      await fetchDetailProduct(productDetailEdit.value.id);

      const productDetailFromServer = getDetailProduct.value;
      if (productDetailFromServer && productDetailFromServer.variantGroups) {
        syncTempSelectedFromSelectedOptionsData(productDetailFromServer.variantGroups);
      }
    }

    togglePopup("edit", true);
    calcTotalPrice("edit");
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

  const inDecrement = (type: boolean) => {
    if (type === false) {
      if (quantity.value == 1) return;
      quantity.value--;
    } else {
      quantity.value++;
    }

    calcTotalPrice("order");
  };

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
    calcTotalPrice,
  };
};