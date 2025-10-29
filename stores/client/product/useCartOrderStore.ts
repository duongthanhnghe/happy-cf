import { ref, reactive, computed, nextTick } from "vue";
import { useRouter } from 'vue-router'
import { useRoute } from 'nuxt/app'
import { defineStore } from "pinia";
import { setCookie, getCookie, getCurrentDateTime, Loading } from "@/utils/global";
import { showConfirm } from "@/utils/toast"
import { useProductDetailStore } from "@/stores/client/product/useProductDetailStore";
import { showWarning, showSuccess } from "@/utils/toast";
import { ordersAPI } from "@/services/v1/orders.service";
// import { sendOrderEmail } from '@/services/email-service';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { PAYMENT_STATUS } from "@/shared/constants/payment-status";
import type { ProductDTO, CartDTO, SelectedOptionPushDTO, SelectedOptionDTO, OptionDTO } from '@/server/types/dto/v1/product.dto';
import type { AddressDTO } from '@/server/types/dto/v1/address.dto'
import type { CreateOrderBody, cartItems } from '@/server/types/dto/v1/order.dto'
import { Base64 } from "js-base64";
import { ROUTES } from '@/shared/constants/routes';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useSettingStore } from '@/stores/shared/setting/useSettingStore';
import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";
import { vouchersAPI } from "@/services/v1/voucher.service";
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import type { ApplyVoucherResponse, ApplyVoucherProduct } from "@/server/types/dto/v1/voucher.dto"; 
import { useEventBus } from "@/composables/voucher/useEventBus";
import { useProductCartDetail } from '@/composables/product/useProductCartDetail';

export const useCartStore = defineStore("Cart", () => {
  const storeProduct = useProductDetailStore();
  const storeAddress = useAddressesManageStore();
  const storeAccount = useAccountStore();
  const storeLocation = useLocationStore();
  const storeSetting = useSettingStore();
  const { fetchAvailableVouchers, allVouchers } = useAvailableVouchersForOrder();
  const eventBus = useEventBus();
  const { fetchCartProducts, getCartProducts } = useProductCartDetail()

  const router = useRouter()
  const route = useRoute()
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
  const newCartListItem = ref<CartDTO[]>([])
  const totalPriceCurrent = ref(0);
  const totalPriceDiscount = ref(0);
  const orderPriceDiscount = ref(0);
  const totalPriceSave = ref(0);
  const shippingFee = ref(0);
  const totalDiscountRateMembership = ref(0);
  const isTogglePopup = ref(false);
  const paymentSelected = ref(PAYMENT_STATUS.BANK);
  const selectedOptionsData = ref<SelectedOptionPushDTO[]>([]);
  const tempSelected = reactive<Record<string, string>>({});
  const idAddressChoose = ref('')
  const usedPointOrder = reactive({
    pointInput: 0,
    usedPoint: 0,
    checkBalancePoint: false
  });
  const discountVoucher = ref(0);
  const discountVoucherFreeship = ref(0);
  const messageVoucher = ref('');
  const voucherUsage = ref<ApplyVoucherResponse[]>([])
  const loadingAllVouchers = ref(false);
  const isCalculating = ref(false);
  const activeFreeshipVoucher = ref<string | null>(null);

  const addNormalProduct = (product: ProductDTO) => {
    const existingProduct = cartListItem.value?.find(
      (item) => item.id === product.id
    );
    if (existingProduct && existingProduct.quantity) {
      existingProduct.quantity++;
    } else {
      cartListItem.value?.push({
        // ...product,
        product: product.id,
        quantity: 1,
      });
    }
    cartCount.value++;
    console.log(cartListItem.value)
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
        // ...product,
        product: product.id,
        productKey,
        quantity: quantity,
        selectedOptionsPush: [...selectedOptions],
        note: note,
        finalPrice: product.price + optionsPrice,
        finalPriceDiscounts: product.priceDiscounts + optionsPrice,
      });

      cartCount.value = cartCount.value + quantity;
      if(!storeProduct.popups.order) showSuccess('Dat hang thanh cong')
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
      product: product.id,
      quantity: quantity,
      note: note,
    };

    const oldQuantity = cartListItem.value[existingProduct].quantity;
    cartCount.value = cartCount.value - oldQuantity + quantity;

    cartListItem.value[existingProduct] = updatedProduct;

    resetValuePopupOrder();
  };

  const addProductToCart = (product: ProductDTO,quantity: number, note: string) => {
    if (!product || product.amount <= 0) return false;
    buildSelectedOptions(product.options)
    selectedOptionsData.value = buildSelectedOptions(product.options)
    if (product.options.length > 0) {
      addProductWithOptions(product, selectedOptionsData.value, quantity, note);
    } else {
      addNormalProduct(product);
    }
    updateCookie();
    return true;
  };

  const fetchProductCart = async () => {
    const productIds = cartListItem.value.map((item: any) => item.product)
    await fetchCartProducts(productIds)

    if (getCartProducts) {
      cartListItem.value = cartListItem.value.map(item => {
        const productDetail = getCartProducts.value.find(p => p.id === item.product)
        return {
          ...item,
          ...productDetail
        }
      })

      handleCalcTotalPriceCurrent()
    }
  }

  const resetValuePopupOrder = () => {
    selectedOptionsData.value = [];
    storeProduct.resetFormCart();
    updateCookie();
  }

  const buildSelectedOptions = (productOptions: OptionDTO[]) => {
    return productOptions.map(option => {
      const selectedVariantId = selectedOptionsData.value[option.id]
      const variant = option.variants.find(v => v.id === selectedVariantId)

      if (!variant) return null; // chưa chọn thì bỏ qua

      return {
        optionName: option.name,
        variantName: variant?.name ?? "",
        variantPrice: variant?.priceModifier ?? 0
      }
    })
    .filter((opt): opt is SelectedOptionPushDTO => opt !== null);
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
    if (isCalculating.value) return;
    
    isCalculating.value = true;

    totalPriceCurrent.value = cartListItem.value.reduce((total, item) => {
      
      if (item.selectedOptionsPush && item.finalPrice) {
        return total + item.finalPrice * item.quantity;
      }
      return total + (item.price || 0) * item.quantity;
    }, 0);

    totalPriceDiscount.value = cartListItem.value.reduce((total, item) => {
      if (item.selectedOptionsPush && item.finalPriceDiscounts) {
        return total + item.finalPriceDiscounts * item.quantity;
      }
      return total + (item.priceDiscounts||0) * item.quantity;
    }, 0);

    orderPriceDiscount.value = totalPriceDiscount.value;

    if(usedPointOrder.usedPoint && usedPointOrder.usedPoint !== 0) { //su dung diem
      totalPriceDiscount.value = totalPriceDiscount.value - usedPointOrder.usedPoint
    }

    if(storeAccount.getDetailValue?.membership && storeAccount.getDetailValue?.membership.discountRate !== 0){ //uu dai thanh vien
      totalDiscountRateMembership.value = totalPriceCurrent.value * (storeAccount.getDetailValue?.membership.discountRate / 100)
      totalPriceDiscount.value = totalPriceDiscount.value - totalDiscountRateMembership.value
    } 

    totalPriceDiscount.value = totalPriceDiscount.value + shippingFee.value - discountVoucher.value - discountVoucherFreeship.value

    totalPriceSave.value = totalPriceCurrent.value - totalPriceDiscount.value + shippingFee.value
    
    //list voucher
    const userId = storeAccount.getDetailValue?.id
    const categoryIds = [
      ...new Set(cartListItem.value.map(item => item.categoryId || ''))
    ]
    
    if (categoryIds && totalPriceCurrent.value && route.path === ROUTES.PUBLIC.CART.path) {
      listVoucher(userId, categoryIds);
    }

    isCalculating.value = false;
  };

  const listVoucher = async (userId: string, categoryIds: string[]) => {
    loadingAllVouchers.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Debounce để tránh gọi quá nhiều
    
    await fetchAvailableVouchers({ // hien thi listVoucher
      userId,
      categoryIds,
      orderTotal: totalPriceCurrent.value
    })
    
    const invalidVouchers = voucherUsage.value.filter(v => { // lay danh sach voucher kh hop le trong listVoucher
      const found = allVouchers.value.find(av => av.code === v.code);
      return !found || found.isDisabled === true;
    });

    if (invalidVouchers.length > 0) { // xu ly remove voucher khong hop le
     
      let hasInvalidFreeship = false;
      let hasInvalidVoucher = false;

      invalidVouchers.forEach(iv => {
        if (iv.type === VOUCHER_TYPE.freeship.type) {
          discountVoucherFreeship.value = 0;
          activeFreeshipVoucher.value = null;
          hasInvalidFreeship = true;
        } else {
          discountVoucher.value = 0;
          messageVoucher.value = '';
          hasInvalidVoucher = true;
        }
      });

      voucherUsage.value = voucherUsage.value.filter(v => {
        const found = allVouchers.value.find(av => av.code === v.code);
        return found && found.isDisabled === false;
      });

      eventBus.emit('voucher:reset', {
        resetFreeship: hasInvalidFreeship,
        resetVoucher: hasInvalidVoucher,
      });
      
      showWarning("Voucher đã bị gỡ bỏ vì không còn hợp lệ.");
      // totalPriceDiscount.value = totalPriceDiscount.value + discountVoucher.value + discountVoucherFreeship.value;
    }

    loadingAllVouchers.value = false;
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

  const handleDeleteCartAll = async () => {
    const confirm = await showConfirm('Bạn có chắc xoá?')
    if (!confirm) return
    
    deleteCartAll()
    isTogglePopup.value = false
  };

  const deleteCartAll = async () => {
    cartCount.value = 0;
    cartListItem.value = [];
    newCartListItem.value = [];
    updateCookie();
  };

  const updateCookie = () => {
    setCookie("cartCount", cartCount.value);
    setCookie("cartListItem", cartListItem.value);
    fetchProductCart()
    handleCalcTotalPriceCurrent();
  };

  const handleTogglePopup = async (value: boolean) => {
    if(cartListItem.value.length > 0) await fetchProductCart()
    isTogglePopup.value = value
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
    storeLocation.setLocationProgrammatically(
      data.provinceCode,
      data.districtCode,
      data.wardCode
    )
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
    router.push({ path: '/' })
    handleTogglePopup(false);
  }

  const handleSubmitOk = (id: string) => {
    router.push({ path: `${ROUTES.PUBLIC.ORDER_TRACKING.path}/${id}` })
    handleTogglePopup(false);
  }

  const submitOrder = async () => {
    const confirm = await showConfirm('Xác nhận đặt hàng?')
    if (!confirm) return

    if(shippingFee.value === 0) {
      showWarning('Khong tinh duoc phi van chuyen')
      return
    }

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
    const newUsedPoint = usedPointOrder.checkBalancePoint ? usedPointOrder.usedPoint : 0

    const newVoucherUsage = voucherUsage.value.map(v => {
      const updated = { ...v }
      if (v.type === "freeship") {
        updated.discount = discountVoucherFreeship.value
      }
      return updated
    })

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
      totalDiscountOrder: totalPriceCurrent.value - orderPriceDiscount.value,
      shippingFee: shippingFee.value,
      status: ORDER_STATUS.PENDING,
      userId: userId,
      provinceCode: storeLocation.selectedProvince || 0,
      districtCode: storeLocation.selectedDistrict || 0,
      wardCode: storeLocation.selectedWard || 0,
      voucherUsage: newVoucherUsage
    };

    try {
      const result = await ordersAPI.create(orderData,userId,point,newUsedPoint);
      if (result.code === 0 && result.data.id) {
        if (paymentSelected.value === PAYMENT_STATUS.BANK) {
          showSuccess('Đặt hàng thành công, vui long thanh toan!')
          router.push({
            path: ROUTES.PUBLIC.PAYMENT.path,
            query: {
              orderId: result.data.id,
              orderCode: result.data.code,
              amount: result.data.totalPrice
            }
          })
        } else {
          showConfirm("Đặt hàng thành công","Đơn hàng của bạn đang đuợc tiêp nhân và xử lý",'success','Theo doi don hang','Ve trang chu',() => handleSubmitOk(result.data.id),handleSubmitCancel)
          //  await sendOrderEmail('duongthanhnghe120796@gmail.com', orderData);
        }

        handleResetForm()
      }
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      Loading(false);
    }
  };

  const handleGetFee = async () => {
    try {
      const productWeight = cartListItem.value.reduce((total, item) => {
        return total + (item.weight||0) * item.quantity
      }, 0)

      if(!productWeight) return;

      const data = await ordersAPI.getFee({
        PRODUCT_WEIGHT: productWeight,
        PRODUCT_PRICE: totalPriceDiscount.value,
        MONEY_COLLECTION: totalPriceDiscount.value,
        SENDER_PROVINCE: storeSetting.getSettings?.provinceCode || 1,
        SENDER_DISTRICT: storeSetting.getSettings?.districtCode || 12,
        RECEIVER_PROVINCE: storeLocation.selectedProvince || 1,
        RECEIVER_DISTRICT: storeLocation.selectedDistrict || 1,
      })
      if(data.code === 0){
        shippingFee.value = data.data.MONEY_TOTAL

        if (storeAccount.getDetailValue?.id && activeFreeshipVoucher.value) await reapplyFreeshippVoucher() // xu ly reapply voucher freeship khi thay doi PVC

        handleCalcTotalPriceCurrent()
      } 
      else {
        shippingFee.value = 0
        showWarning('Khong tinh duoc phi van chuyen')
      }
    } catch (err: any) {
      showWarning(err.message)
    }
  }

  const handleResetForm = () => {
    deleteCartAll()

    //point
    usedPointOrder.pointInput = 0,
    usedPointOrder.usedPoint = 0,
    usedPointOrder.checkBalancePoint = false
    totalDiscountRateMembership.value = 0;
  }

  const applyVoucher = async (code: string) => {
    const userId = storeAccount.getDetailValue?.id;
    const orderTotal = totalPriceDiscount.value;
    const products: ApplyVoucherProduct[] = cartListItem.value.map(item => ({
      productId: item.id || '',
      name: item.productName || '',
      categoryId: item.categoryId || '',
      price: item.finalPriceDiscounts ? item.finalPriceDiscounts : item.priceDiscounts || 0,
      quantity: item.quantity,
    }));
    const orderCreatedAt = new Date().toISOString();

    if(!userId) return showWarning("Vui long dang nhap de su dung voucher");

    const existingVoucher = voucherUsage.value.find(v => v.code === code);
    if (existingVoucher) {
      console.log('Voucher đã được áp dụng:', code);
      return;
    }

    try {
      const res = await vouchersAPI.apply({
        code,
        orderTotal,
        products,
        orderCreatedAt,
        userId,
      });

      if (res.code === 0) {
        const appliedVoucher = res.data;
        // if(isFreeship) {
        if(appliedVoucher.type === VOUCHER_TYPE.freeship.type) {
          discountVoucherFreeship.value = 0;

          discountVoucherFreeship.value = appliedVoucher.discount;
          if(discountVoucherFreeship.value > shippingFee.value) discountVoucherFreeship.value = shippingFee.value;

          activeFreeshipVoucher.value = code;
        }
        else {
          discountVoucher.value = appliedVoucher.discount;
          if(appliedVoucher.type === VOUCHER_TYPE.product.type) messageVoucher.value = res.message || '';
        }

        voucherUsage.value.push(appliedVoucher);
        showSuccess("Áp dụng voucher thành công");
        handleCalcTotalPriceCurrent()
      } else {
        showWarning(res.message ?? "Không thể áp dụng voucher");
      }
    } catch (err) {
      console.error("Error applying voucher:", err);
    }
  };

  const reapplyFreeshippVoucher = async () => {
    if (!activeFreeshipVoucher.value || shippingFee.value <= 0) return;
    
    voucherUsage.value = voucherUsage.value.filter(
      v => v.code !== activeFreeshipVoucher.value
    );
    
    discountVoucherFreeship.value = 0;
    
    await applyVoucher(activeFreeshipVoucher.value);

    if(discountVoucherFreeship.value === 0) {
      eventBus.emit('voucher:reset', {
        resetFreeship: true,
        resetVoucher: false,
      });
      activeFreeshipVoucher.value = null;
      showWarning("Voucher freeship không còn hợp lệ với đơn hàng hiện tại.");
    } 

  };

  const handleCheckPoint = async () => {
    if(!storeAccount.getDetailValue?.id || usedPointOrder.pointInput == 0 || totalPriceDiscount.value === 0) {
      showWarning('Vui long kiem tra lai thong tin!')
      return
    }

    if(usedPointOrder.pointInput >= Math.floor(totalPriceCurrent.value * 0.1)) {
      showWarning(`Chỉ được dùng tối đa ${Math.floor(totalPriceCurrent.value * 0.1)} điểm`)
      return
    }

    Loading(true);
    try {
      const res = await ordersAPI.checkPoint(storeAccount.getDetailValue?.id,usedPointOrder.pointInput,totalPriceDiscount.value);
      if (res.code === 0) {
        usedPointOrder.checkBalancePoint = true
        usedPointOrder.usedPoint = Number(res.data.appliedPoint)
      } else {
        usedPointOrder.checkBalancePoint = false
        usedPointOrder.usedPoint = 0
        showWarning(res.message ?? '')
      }
      handleCalcTotalPriceCurrent()
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      Loading(false);
    }
  }

  const syncCartCookie = () => {
    cartCount.value = getCookie("cartCount") || 0
    cartListItem.value = getCookie("cartListItem") || []
    handleCalcTotalPriceCurrent()
  };

  //getters
  const getCartCount = computed(() => cartCount.value);
  const getCartListItem = computed(() => cartListItem.value);
  const getIsTogglePopup = computed(() => isTogglePopup.value);
  const getTotalPriceCurrent = computed(() => totalPriceCurrent.value);
  const getTotalPriceDiscount = computed(() => totalPriceDiscount.value);
  const getTotalPoint = computed(() => Math.round(totalPriceCurrent.value * 0.05));
  const getTotalPriceSave = computed(() => totalPriceSave.value);
  const getOrderPriceDiscount = computed(() => totalPriceCurrent.value - orderPriceDiscount.value);
  const getShippingFee = computed(() => shippingFee.value);
  const getPaymentSelected = computed(() => paymentSelected.value);
  const getSelectedOptionsData = computed(() => selectedOptionsData.value);
  const getIdAddressChoose = computed(() => idAddressChoose.value);
  const getNameAddressChoose = computed(() => informationOrder.address);
  return {
    // state
    cartCount,
    cartListItem,
    paymentSelected,
    selectedOptionsData,
    isTogglePopup,
    timeRules,
    informationOrder,
    idAddressChoose,
    usedPointOrder,
    totalDiscountRateMembership,
    shippingFee,
    getOrderPriceDiscount,
    discountVoucherFreeship,
    discountVoucher,
    messageVoucher,
    voucherUsage,
    loadingAllVouchers,
    activeFreeshipVoucher,
    reapplyFreeshippVoucher,
    // actions
    addProductToCart,
    handleTogglePopup,
    updateQuantity,
    deleteCart,
    deleteCartAll,
    handleDeleteCartAll,
    setSelectedOptionsData,
    getTemplate1Amount,
    updateProductWithOptions,
    updateNormalProduct,
    updateSelectedOptionsData,
    submitOrder,
    handleChooseAddress,
    syncTempSelectedFromSelectedOptionsData,
    clearTempSelected,
    syncCartCookie,
    handleGetDefaultAddress,
    handleCheckPoint,
    handleGetFee,
    applyVoucher,
    handleCalcTotalPriceCurrent,
    fetchProductCart,
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
    getShippingFee,
    allVouchers,
  };
});
