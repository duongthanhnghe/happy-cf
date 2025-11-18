import { setCookie, getCookie } from "@/utils/global";
import { showSuccess, showWarning } from "@/utils/toast";
import { Loading } from "@/utils/global";
import { ordersAPI } from "@/services/v1/orders.service";
import type { Ref } from 'vue';
import type { CartDTO, SelectedOptionPushDTO } from '@/server/types/dto/v1/product.dto';
import type { AddressDTO } from '@/server/types/dto/v1/address.dto';

export const useCartUtils = (
  cartCount: Ref<number>,
  cartListItem: Ref<CartDTO[]>,
  informationOrder: any,
  idAddressChoose: Ref<string>,
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  usedPointOrder: any,
  totalPriceDiscount: Ref<number>,
  isTogglePopup: Ref<boolean>,
  fetchProductCart: () => Promise<void>,
  handleCalcTotalPriceCurrent: () => void,
  resetFormCart: () => void,
  storeLocation: any,
  storeAddress: any,
  isTogglePopupVoucher: Ref<boolean>,
  isTogglePopupPoint: Ref<boolean>,
) => {

  const updateCookie = () => {
    setCookie("cartCount", cartCount.value);
    setCookie("cartListItem", cartListItem.value);
    handleCalcTotalPriceCurrent();
    fetchProductCart();
  };

  const syncCartCookie = () => {
    cartCount.value = getCookie("cartCount") || 0;
    cartListItem.value = getCookie("cartListItem") || [];
    handleCalcTotalPriceCurrent();
  };

  const resetValuePopupOrder = () => {
    selectedOptionsData.value = [];
    resetFormCart();
    updateCookie();
  };

  const handleTogglePopup = async (value: boolean) => {
    if (cartListItem.value.length > 0) await fetchProductCart();
    isTogglePopup.value = value;
  };

  const handleGetDefaultAddress = async (userId?: string) => {
    try {
      if (!userId) return;
      const data = await storeAddress.getDefaultAddress(userId);
      if (informationOrder.address === '' && data) {
        handleChooseAddress(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleChooseAddress = (data: AddressDTO) => {
    informationOrder.address = data.address;
    informationOrder.phone = data.phone;
    informationOrder.fullname = data.fullname;
    informationOrder.note = data.note ? data.note : '';
    idAddressChoose.value = data.id;
    storeLocation.setLocationProgrammatically(
      data.provinceCode,
      data.districtCode,
      data.wardCode
    );
  };

  const handleCheckPoint = async (userId?: string) => {
    if (!userId || usedPointOrder.pointInput == 0 || totalPriceDiscount.value === 0) {
      showWarning('Vui long kiem tra lai thong tin!');
      return;
    }

    if (usedPointOrder.pointInput >= Math.floor(totalPriceDiscount.value * 0.1)) {
      showWarning(`Chỉ được dùng tối đa ${Math.floor(totalPriceDiscount.value * 0.1)} điểm`);
      return;
    }

    Loading(true);
    try {
      const res = await ordersAPI.checkPoint(userId, usedPointOrder.pointInput, totalPriceDiscount.value);
      if (res.code === 0) {
        usedPointOrder.checkBalancePoint = true;
        usedPointOrder.usedPoint = Number(res.data.appliedPoint);
      } else {
        usedPointOrder.checkBalancePoint = false;
        usedPointOrder.usedPoint = 0;
        showWarning(res.message ?? '');
      }
      handleCalcTotalPriceCurrent();
      showSuccess('Ap dung thanh cong');
    } catch (err: any) {
      showWarning(err.message);
    } finally {
      Loading(false);
    }
  };

  const handleTogglePopupVoucher = (value: boolean) => {
    isTogglePopupVoucher.value = value;
  };

  const handleTogglePopupPoint = (value: boolean) => {
    isTogglePopupPoint.value = value;
  };

  return {
    updateCookie,
    syncCartCookie,
    resetValuePopupOrder,
    handleTogglePopup,
    handleGetDefaultAddress,
    handleChooseAddress,
    handleCheckPoint,
    handleTogglePopupVoucher,
    handleTogglePopupPoint,
  };
};