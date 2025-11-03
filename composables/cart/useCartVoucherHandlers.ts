import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import type { Ref } from 'vue';

export const useCartVoucherHandlers = (
  store: any,
  selectedFreeship: Ref<string | null>,
  selectedVoucher: Ref<string | null>,
  voucherCode: Ref<string>
) => {
  
  const removeVoucher = (code: string, type: any) => {
    if (type === VOUCHER_TYPE.freeship.type) {
      selectedFreeship.value = null;
      store.discountVoucherFreeship = 0;
      store.activeFreeshipVoucher = null;
    } else {
      selectedVoucher.value = null;
      store.discountVoucher = 0;
      store.messageVoucher = '';
    }

    store.voucherUsage = store.voucherUsage.filter((v: any) => v.code !== code);
    store.handleCalcTotalPriceCurrent();
  };

  const handleVoucherReset = (data: { resetFreeship: boolean; resetVoucher: boolean }) => {
    if (data.resetFreeship) selectedFreeship.value = null;
    if (data.resetVoucher) selectedVoucher.value = null;
  };

  const handleApplyVoucherInput = async () => {
    if (!voucherCode.value) return;

    await store.applyVoucher(voucherCode.value);

    const appliedVoucher = store.voucherUsage.find((v: any) => v.code === voucherCode.value);
    if (appliedVoucher) {
      if (appliedVoucher.type === VOUCHER_TYPE.freeship.type) {
        selectedFreeship.value = appliedVoucher.code;
      } else {
        selectedVoucher.value = appliedVoucher.code;
      }
    }

    voucherCode.value = '';
  };

  return {
    removeVoucher,
    handleVoucherReset,
    handleApplyVoucherInput,
  };
};