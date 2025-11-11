import { showWarning, showSuccess, showConfirm } from "@/utils/toast";
import { Base64 } from "js-base64";
import type { ProductDTO, CartDTO, SelectedOptionPushDTO, OptionDTO } from '@/server/types/dto/v1/product.dto';
import type { Ref } from 'vue';

export const useCartProductOperations = (
  cartListItem: Ref<CartDTO[]>,
  cartCount: Ref<number>,
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  updateCookie: () => void,
  resetValuePopupOrder: () => void
) => {
  
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
    const productKey = `${product.id}_${Base64.encode(JSON.stringify(selectedOptions))}`;

    const existingProduct = cartListItem.value?.find(
      (item) => item.productKey === productKey
    );

    if (existingProduct && existingProduct.quantity) {
      existingProduct.quantity = existingProduct.quantity + quantity;
      cartCount.value += quantity;
    } else {
      if (product.options.length > selectedOptions.length) {
        showWarning("Vui lòng chọn đầy đủ options!");
        return;
      }

      const optionsPrice = product.options?.reduce((total, option) => {
        const selectedOption = selectedOptions.find(
          (so) => so.optionName === option.name
        );

        const selectedVariant = option.variants?.find(
          (v) => v.name === selectedOption?.variantName
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
      // if(!popupOrderState) showSuccess('Dat hang thanh cong')
    }

    resetValuePopupOrder();
  };

  const updateProductWithOptions = (
    product: ProductDTO, 
    quantity: number, 
    note: string, 
    oldProductKey: string
  ) => {
    const selectedOptions = selectedOptionsData.value;
    try {
      const newProductKey = `${product.id}_${Base64.encode(JSON.stringify(selectedOptions))}`;
      
      const existingProductIndex = cartListItem.value?.findIndex(
        item => item.productKey === oldProductKey
      );

      if (existingProductIndex === -1) {
        console.error('Khong ton tai san pham');
        return;
      }

      const optionsPrice = product.options?.reduce((total, option) => {
        const selectedOption = selectedOptions.find(
          (so) => so.optionName === option.name
        );

        const selectedVariant = option.variants?.find(
          (v) => v.name === selectedOption?.variantName
        );

        return total + (selectedVariant?.priceModifier || 0);
      }, 0) ?? 0;

      const updatedProduct = {
        ...product,
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

      resetValuePopupOrder();

    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const updateNormalProduct = (
    product: ProductDTO, 
    quantity: number, 
    note: string, 
    oldProductKey: string
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
    buildSelectedOptions: (options: OptionDTO[]) => SelectedOptionPushDTO[],
    popupOrderState: boolean
  ) => {
    if (!product || product.amount <= 0) return false;
    
    selectedOptionsData.value = buildSelectedOptions(product.options);
    
    if (product.options.length > 0) {
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
      showSuccess("Đã xóa sản phẩm khỏi giỏ hàng!");
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
  };
};