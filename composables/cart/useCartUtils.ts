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
  totalPriceCurrent: Ref<number>,
  isTogglePopup: Ref<boolean>,
  fetchProductCart: () => Promise<void>,
  handleCalcTotalPriceCurrent: () => void,
  resetFormCart: () => void,
  storeLocation: any,
  storeAddress: any,
  isTogglePopupVoucher: Ref<boolean>,
  isTogglePopupPoint: Ref<boolean>,
  clearTempSelected: () => void,
) => {

  const updateCookie = () => {
    const cookieData = cartListItem.value.map(item => ({
      product: item.product,
      productKey: item.productKey,
      quantity: item.quantity,
      note: item.note || '',
      combinationId: item.variantCombination?.id || null,
    }));

    setCookie("cartListItem", cookieData);
    setCookie("cartCount", cartCount.value);

    handleCalcTotalPriceCurrent();
    fetchProductCart();
  };

  const syncCartCookie = async () => {
    const cookieCount = Number(getCookie('cartCount') || 0);
    const cookieList = getCookie('cartListItem');

    cartCount.value = cookieCount;

    cartListItem.value = Array.isArray(cookieList)
      ? cookieList.map(c => ({
          product: c.product,
          productKey: c.productKey,
          quantity: Number(c.quantity) || 1,
          note: c.note || '',
          combinationId: c.combinationId || null,
        }))
      : [];

    if (cartListItem.value.length > 0) {
      await fetchProductCart();
      handleCalcTotalPriceCurrent();
    }
  };

  const resetValuePopupOrder = () => {
    selectedOptionsData.value = [];
    clearTempSelected();
    resetFormCart();
    updateCookie();
  };

  const handleTogglePopup = async (value: boolean) => {
    if (cartListItem.value.length > 0) await fetchProductCart();
    isTogglePopup.value = value;
  };

  const handleGetDefaultAddress = async () => {
    try {
      const data = await storeAddress.getDefaultAddress();
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

  const handleCheckPoint = async (userId: string) => {
    if (!userId || usedPointOrder.pointInput == 0 || totalPriceCurrent.value === 0) {
      showWarning('Vui lòng kiểm tra lại thông tin!')
      return
    }

    if (usedPointOrder.pointInput > Math.floor(totalPriceCurrent.value * 0.1)) {
      showWarning(`Chỉ được dùng tối đa ${Math.floor(totalPriceCurrent.value * 0.1)} điểm`)
      resetPoint()
      return
    }

    Loading(true);
    try {
      const res = await ordersAPI.checkPoint(userId, usedPointOrder.pointInput, totalPriceCurrent.value);
      if (res.code === 0) {
        usedPointOrder.checkBalancePoint = true;
        usedPointOrder.usedPoint = Number(res.data.appliedPoint);
      } else {
        usedPointOrder.checkBalancePoint = false;
        usedPointOrder.usedPoint = 0;
        showWarning(res.message ?? '');
      }
      handleCalcTotalPriceCurrent();
      showSuccess('Áp dụng điểm thành công');
    } catch (err: any) {
      showWarning(err.message);
    } finally {
      Loading(false);
    }
  };

  const resetPoint = () => {
    usedPointOrder.usedPoint = 0
    usedPointOrder.pointInput = 0
  }

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
    resetPoint,
  };
};