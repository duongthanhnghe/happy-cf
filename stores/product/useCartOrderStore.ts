import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { defineStore } from "pinia";
import { setCookie, getCookie, getCurrentDateTime, Loading } from "@/utils/global";
import { showConfirm } from "@/utils/toast"
import { useProductStore } from "@/stores/product/useProductOrderStore";
import { showWarning, showSuccess } from "@/utils/toast";
import { ordersAPI } from "@/services/orders.service";
// import { sendOrderEmail } from '@/services/email-service';
import { useAccountStore } from '@/stores/users/useAccountStore'
import { useAddressesManageStore } from '@/stores/users/useAddressesStore'
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { PAYMENT_STATUS } from "@/shared/constants/payment-status";
import type { ProductDTO, CartDTO, SelectedOptionPushDTO, SelectedOptionDTO, SelectedOptionMap, OptionDTO } from '@/server/types/dto/product.dto';
import type { AddressDTO } from '@/server/types/dto/address.dto'
import type { CreateOrderBody, cartItems } from '@/server/types/dto/order.dto'
import { Base64 } from "js-base64";
import { ROUTES } from '@/shared/constants/routes';

export const useCartStore = defineStore("Cart", () => {
  const storeProduct = useProductStore();
  const storeAddress = useAddressesManageStore();
  const storeAccount = useAccountStore();

  const router = useRouter()
  
  const addressRules = [
    (value: string) => {
      if (value) return true
      return 'Dia chi khong duoc trong'
    },
  ]
  
  const fullnameRules = [
    (value: string) => {
      if (value) return true
      return 'Ho va ten khong duoc trong'
    },
  ]

  const phoneRules = [
    (value: string) => {
      if (value) return true
      return 'So dien thoai khong duoc trong'
    },
  ]

  const timeCurrent = getCurrentDateTime('time');
  const timeRules = [
    (value: string) => {
      if (value) return true
      return 'Thoi gian khong duoc trong'
    },
    (value: string | null) => {
      if (timeCurrent !== null && value !== null && timeCurrent < value) return true
      return 'Thoi gian khong hop le'
    },
  ]

  const informationOrder = reactive({
    time: '',
    address: '',
    phone: '',
    note: '',
    fullname: '',
  });

  const cartCount = ref(0)
  const cartListItem = ref<CartDTO[]>([])
  const totalPriceCurrent = ref(0);
  const totalPriceDiscount = ref(0);
  const totalPriceSave = ref(0);
  const isTogglePopup = ref(false);
  const paymentSelected = ref(PAYMENT_STATUS.BANK);
  const selectedOptionsData = ref<SelectedOptionPushDTO[]>([]);
  const tempSelected = reactive<Record<string, string>>({});
  const idAddressChoose = ref('')

  const addNormalProduct = (product: ProductDTO) => {
    const existingProduct = cartListItem.value?.find(
      (item) => item.id === product.id
    );
    if (existingProduct && existingProduct.quantity) {
      existingProduct.quantity++;
    } else {
      cartListItem.value?.push({
        ...product,
        quantity: 1,
      });
    }
    cartCount.value++;
  };
  
  const addProductWithOptions = (product: ProductDTO, selectedOptions: SelectedOptionPushDTO[], quantity: number, note: string) => {
    const productKey = `${product.id}_${Base64.encode(JSON.stringify(selectedOptions))}`;

    const existingProduct = cartListItem.value?.find(
      (item) => item.productKey === productKey
    );

    if (existingProduct && existingProduct.quantity) {
      existingProduct.quantity = existingProduct.quantity + quantity;
      cartCount.value = cartCount.value + quantity;
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
        ...product,
        productKey,
        quantity: quantity,
        selectedOptionsPush: [...selectedOptions],
        note: note,
        finalPrice: product.price + optionsPrice,
        finalPriceDiscounts: product.priceDiscounts + optionsPrice,
      });

      cartCount.value = cartCount.value + quantity;
    }

    resetValuePopupOrder();
  };

  const updateProductWithOptions = (product: ProductDTO, quantity: number, note: string, oldProductKey: string) => {
    const selectedOptions = selectedOptionsData.value
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

  const updateNormalProduct = (product: ProductDTO, quantity: number, note: string, oldProductKey: string) => {
    if(!product || !oldProductKey) return
    const existingProduct = cartListItem.value.findIndex(
      item => item.id === oldProductKey
    );

    if (existingProduct === -1) {
        console.error('Khong ton tai san pham');
        return;
    }
   
    const updatedProduct = {
      ...product,
      quantity: quantity,
      note: note,
    };

    const oldQuantity = cartListItem.value[existingProduct].quantity;
    cartCount.value = cartCount.value - oldQuantity + quantity;

    cartListItem.value[existingProduct] = updatedProduct;

    resetValuePopupOrder();
  };

  const addProductToCart = (product: ProductDTO,quantity: number, note: string) => {
    if (!product || product.amount <= 0) return;
    buildSelectedOptions(product.options)
    selectedOptionsData.value = buildSelectedOptions(product.options)
    if (selectedOptionsData.value.length > 0) {
      addProductWithOptions(product, selectedOptionsData.value, quantity, note);
    } else {
      addNormalProduct(product);
    }
    updateCookie();
  };

  const resetValuePopupOrder = () => {
    selectedOptionsData.value = [];
    storeProduct.productDetailEdit = null;
    storeProduct.togglePopup("edit", false);
    storeProduct.togglePopup("order", false);
    updateCookie();
  }

  const buildSelectedOptions = (productOptions: OptionDTO[]) => {
    return productOptions.map(option => {
      const selectedVariantId = selectedOptionsData.value[option.id]
      const variant = option.variants.find(v => v.id === selectedVariantId)

      return {
        optionName: option.name,
        variantName: variant?.name ?? "",
        variantPrice: variant?.priceModifier ?? 0
      }
    })
  }

  const clearTempSelected = () => {
    for (const key in tempSelected) delete tempSelected[key];
  };

  // đồng bộ tempSelected từ selectedOptionsData (khi edit sản phẩm)
  const syncTempSelectedFromSelectedOptionsData = (productOptions: OptionDTO[]) => {
    clearTempSelected();
    productOptions.forEach(option => {
      const selected = selectedOptionsData.value.find(o => o.optionName === option.name);
      if (selected) {
        const variant = option.variants.find(v => v.name === selected.variantName);
        if (variant) tempSelected[option.id] = variant.id;
      }
    });
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

  const handleCalcTotalPriceCurrent = () => {
    totalPriceCurrent.value = cartListItem.value.reduce((total, item) => {
      if (item.selectedOptionsPush && item.finalPrice) {
        return total + item.finalPrice * item.quantity;
      }
      return total + item.price * item.quantity;
    }, 0);

    totalPriceDiscount.value = cartListItem.value.reduce((total, item) => {
      if (item.selectedOptionsPush && item.finalPriceDiscounts) {
        return total + item.finalPriceDiscounts * item.quantity;
      }
      return total + item.priceDiscounts * item.quantity;
    }, 0);

    totalPriceSave.value = totalPriceCurrent.value - totalPriceDiscount.value;
  };

  const deleteCart = async (productKey: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá?')
    if (!confirm) return

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

  const deleteCartAll = async () => {
    const confirm = await showConfirm('Bạn có chắc xoá?')
    if (!confirm) return

    cartCount.value = 0;
    cartListItem.value = [];
    updateCookie();
  };

  const updateCookie = () => {
    setCookie("cartCount", cartCount.value);
    setCookie("cartListItem", cartListItem.value);
    handleCalcTotalPriceCurrent();
  };

  const handleTogglePopup = async (value: boolean) => {
    isTogglePopup.value = value
    if(!storeAccount.getDetailValue?.id) return
    if(isTogglePopup.value === true) {
      await handleGetDefaultAddress()
    }
  };

  const handleGetDefaultAddress = async () => {
    try {
      if(!storeAccount.getDetailValue?.id) return
      const data = await storeAddress.getDefaultAddress(storeAccount.getDetailValue?.id)
      if(informationOrder.address === '' && data ) handleChooseAddress(data)
    } catch (err) {
      console.error("Error:", err);
    }
  }

  const handleChooseAddress = (data: AddressDTO) => {
    informationOrder.address = data.address
    informationOrder.phone = data.phone
    informationOrder.fullname = data.fullname
    informationOrder.note = data.note ? data.note : ''
    idAddressChoose.value = data.id
  }

  const setSelectedOptionsData = (
    idOption: string,
    idVariant: string,
    optionName: string,
    variantName: string,
    variantPrice: number
  ) => {
    tempSelected[idOption] = idVariant;

    const itemOptions: SelectedOptionPushDTO = {
      optionName,
      variantName,
      variantPrice,
    };

    const existingIndex = selectedOptionsData.value.findIndex(o => o.optionName === optionName);
    if (existingIndex !== -1) {
      selectedOptionsData.value[existingIndex] = itemOptions;
    } else {
      selectedOptionsData.value.push(itemOptions);
    }
  };

  const updateSelectedOptionsData = (newData: SelectedOptionDTO[]) => {
    selectedOptionsData.value = JSON.parse(JSON.stringify(newData));
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

  const handleSubmitCancel = () => {
    router.push({ name: 'index' })
    handleTogglePopup(false);
    deleteCartAll()
  }

  const handleSubmitOk = (id: string) => {
    // router.push({ path: `/order-tracking/${idOrder}` })
    router.push({ path: `${ROUTES.PUBLIC.ORDER_TRACKING}/${id}` })
    handleTogglePopup(false);
    deleteCartAll()
  }

  //submit dat hang
  const submitOrder = async () => {
    const confirm = await showConfirm('Xác nhận đặt hàng?')
    if (!confirm) return

    Loading(true);

    const newCartItems = cartListItem.value.map((item) => {
      return {
        idProduct: item.id,
        priceDiscounts: item.priceDiscounts,
        quantity: item.quantity,
        note: item.note ? item.note : null,
        selectedOptionsPush: item.selectedOptionsPush ? item.selectedOptionsPush : null,
        finalPriceDiscounts: item.finalPriceDiscounts ? item.finalPriceDiscounts : null
      };
    });

    const userId = storeAccount.getDetailValue?.id ? storeAccount.getDetailValue?.id : null
    const point = storeAccount.getDetailValue?.id ? Math.round(totalPriceDiscount.value * 0.05) : 0

    const orderData: CreateOrderBody = {
      code: 'ORDER' + Date.now(),
      time: informationOrder.time,
      address: informationOrder.address,
      fullname: informationOrder.fullname,
      phone: informationOrder.phone,
      note: informationOrder.note,
      paymentId: paymentSelected.value,
      cartItems: newCartItems as cartItems[],
      totalPrice: totalPriceDiscount.value,
      totalPriceSave: totalPriceSave.value,
      totalPriceCurrent: totalPriceCurrent.value,
      point: point,
      status: ORDER_STATUS.PENDING,
      userId: userId,
    };

    try {
      const result = await ordersAPI.create(orderData,userId,point);
      if (result.code === 0 && result.data.id) {
        showConfirm("Đặt hàng thành công","Đơn hàng của bạn đang đuợc tiêp nhân và xử lý",'success','Theo doi don hang','Ve trang chu',() => handleSubmitOk(result.data.id),handleSubmitCancel)
        //  await sendOrderEmail('duongthanhnghe120796@gmail.com', orderData);
      }
    } catch (err: any) {
      showWarning(err.message);
      Loading(false);
    }
  };

  //getters
  const getCartCount = computed(() => cartCount.value);
  const getCartListItem = computed(() => cartListItem.value);
  const getIsTogglePopup = computed(() => isTogglePopup.value);
  const getTotalPriceCurrent = computed(() => totalPriceCurrent.value);
  const getTotalPriceDiscount = computed(() => totalPriceDiscount.value);
  const getTotalPoint = computed(() => Math.round(totalPriceDiscount.value * 0.05));
  const getTotalPriceSave = computed(() => totalPriceSave.value);
  const getPaymentSelected = computed(() => paymentSelected.value);
  const getSelectedOptionsData = computed(() => selectedOptionsData.value);
  const getIdAddressChoose = computed(() => idAddressChoose.value);
  const getNameAddressChoose = computed(() => informationOrder.address);
  
  onMounted(() => {
    if(process.client){
      cartCount.value = getCookie("cartCount") || 0
      cartListItem.value = getCookie("cartListItem") || []
      handleCalcTotalPriceCurrent()
    }
  });

  return {
    // state
    cartCount,
    cartListItem,
    paymentSelected,
    selectedOptionsData,
    isTogglePopup,
    timeRules,
    fullnameRules,
    addressRules,
    phoneRules,
    informationOrder,
    idAddressChoose,
    // actions
    addProductToCart,
    handleTogglePopup,
    updateQuantity,
    deleteCart,
    deleteCartAll,
    setSelectedOptionsData,
    getTemplate1Amount,
    updateProductWithOptions,
    updateNormalProduct,
    updateSelectedOptionsData,
    submitOrder,
    handleChooseAddress,
    syncTempSelectedFromSelectedOptionsData,
    clearTempSelected,
    // getters
    tempSelected,
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
  };
});
