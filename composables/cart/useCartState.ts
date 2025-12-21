import { ref, reactive } from "vue";
import { getCurrentDateTime } from "@/utils/global";
import { PAYMENT_STATUS } from "@/shared/constants/payment-status";
import type { CartDTO, SelectedOptionPushDTO } from '@/server/types/dto/v1/product.dto';
import type { ApplyVoucherResponse } from "@/server/types/dto/v1/voucher.dto";

export const useCartState = () => {
  const timeCurrent = getCurrentDateTime('time');
  
  const timeRules = [
    (value: string) => {
      if (value) return true
      return 'Thời gian lấy hàng không được trống!'
    },
    (value: string | null) => {
      if (timeCurrent !== null && value !== null && timeCurrent < value) return true
      return 'Thời gian lấy hàng không hợp lệ!'
    },
  ];

  const informationOrder = reactive({
    time: '',
    address: '',
    phone: '',
    fullname: '',
    note: '',
  });

  const cartCount = ref(0);
  const cartListItem = ref<CartDTO[]>([]);
  const newCartListItem = ref<CartDTO[]>([]);
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
  const idAddressChoose = ref('');
  
  const usedPointOrder = reactive({
    pointInput: 0,
    usedPoint: 0,
    checkBalancePoint: false
  });

  const discountVoucher = ref(0);
  const discountVoucherFreeship = ref(0);
  const messageVoucher = ref('');
  const voucherUsage = ref<ApplyVoucherResponse[]>([]);
  const loadingAllVouchers = ref(false);
  const isCalculating = ref(false);
  const activeFreeshipVoucher = ref<string | null>(null);
  const popups = ref({
    order: false,
    edit: false,
  });
  const productDetailEdit = ref<CartDTO|null|undefined>(null);
  const quantityEdit = ref(0);
  const quantity = ref(1);
  const note = ref<string>('');
  const isTogglePopupVoucher = ref<boolean>(false);
  const isTogglePopupPoint = ref<boolean>(false);
  const selectedFreeship = ref<string | null>(null);
  const selectedVoucher = ref<string | null>(null);
  const voucherCode = ref<string>('');
  const needAutoSelect = ref(0)

  return {
    informationOrder,
    timeRules,
    cartCount,
    cartListItem,
    newCartListItem,
    totalPriceCurrent,
    totalPriceDiscount,
    orderPriceDiscount,
    totalPriceSave,
    shippingFee,
    totalDiscountRateMembership,
    isTogglePopup,
    paymentSelected,
    selectedOptionsData,
    tempSelected,
    idAddressChoose,
    usedPointOrder,
    discountVoucher,
    discountVoucherFreeship,
    messageVoucher,
    voucherUsage,
    loadingAllVouchers,
    isCalculating,
    activeFreeshipVoucher,
    popups,
    productDetailEdit,
    quantityEdit,
    quantity,
    note,
    isTogglePopupVoucher,
    isTogglePopupPoint,
    selectedFreeship,
    selectedVoucher,
    voucherCode,
    needAutoSelect,
  };
};