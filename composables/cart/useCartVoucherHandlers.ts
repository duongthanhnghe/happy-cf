import type { ApplyVoucherResponse } from '@/server/types/dto/v1/voucher.dto';
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { type Ref } from 'vue';

export const useCartVoucherHandlers = (
  selectedFreeship: Ref<string | null>,
  selectedVoucher: Ref<string | null>,
  voucherCode: Ref<string>,
  discountVoucher: Ref<number>,
  discountVoucherFreeship: Ref<number>,
  activeFreeshipVoucher: Ref<String | null>,
  voucherUsage: Ref<ApplyVoucherResponse[]>,
  messageVoucher: Ref<String>,
  applyVoucher: (code: string) => Promise<void>,
  handleCalcTotalPriceCurrent: () => void,
) => {

  const removeVoucher = (code: string | null, type: any) => {
    if (type === VOUCHER_TYPE.freeship.type) {
      selectedFreeship.value = null;
      discountVoucherFreeship.value = 0;
      activeFreeshipVoucher.value = null;
    } else {
      selectedVoucher.value = null;
      discountVoucher.value = 0;
      messageVoucher.value = '';
    }

    voucherUsage.value = voucherUsage.value.filter((v: any) => v.code !== code);
    handleCalcTotalPriceCurrent();
  };

  // const handleVoucherReset = (data: { resetFreeship: boolean; resetVoucher: boolean }) => {
  //   if (data.resetFreeship) selectedFreeship.value = null;
  //   if (data.resetVoucher) selectedVoucher.value = null;
  // };

  const handleVoucherReset = () => {
    if (selectedFreeship.value) selectedFreeship.value = null;
    if (selectedFreeship.value) selectedVoucher.value = null;
  };

  const handleApplyVoucherInput = async () => {
    if (!voucherCode.value) return;

    await applyVoucher(voucherCode.value);

    const appliedVoucher = voucherUsage.value.find((v: any) => v.code === voucherCode.value);
    if (appliedVoucher) {
      if (appliedVoucher.type === VOUCHER_TYPE.freeship.type) {
        selectedFreeship.value = appliedVoucher.code;
      } else {
        selectedVoucher.value = appliedVoucher.code;
      }
    }

    voucherCode.value = '';
  };
  
  const handleSelectVoucher = async (voucher: any) => {
    const type = voucher.type;
    const code = voucher.code;

    // Xóa voucher cũ cùng loại nếu có
    if (type === VOUCHER_TYPE.freeship.type && selectedFreeship.value) {
      removeVoucher(selectedFreeship.value, type);
    } 
    if (type !== VOUCHER_TYPE.freeship.type && selectedVoucher.value) {
      removeVoucher(selectedVoucher.value, type);
    }

    // Set voucher mới
    if (type === VOUCHER_TYPE.freeship.type) {
      selectedFreeship.value = code;
    } else {
      selectedVoucher.value = code;
    }

    // Áp dụng voucher
    await applyVoucher(code);
  };

//   watch(
//   () => [selectedVoucher.value, selectedFreeship.value],
//   async ([newVoucher, newFreeship], [oldVoucher, oldFreeship]) => {
//     console.log('isApplying',isApplying.value);
//     if (isApplying.value) return;

//     if (newVoucher && newVoucher !== oldVoucher) {
//       messageVoucher.value = '';
//       if (oldVoucher) {
//         voucherUsage.value = voucherUsage.value.filter(v => v.code !== oldVoucher);
//       }
//       applyVoucher(newVoucher);
//     }

//     if (newFreeship && newFreeship !== oldFreeship) {
//       if (oldFreeship) {
//         voucherUsage.value = voucherUsage.value.filter(v => v.code !== oldFreeship);
//       }
//       applyVoucher(newFreeship);
//     }
//   }
// );

// watch(selectedVoucher, async (newVal, oldVal) => {
//   if (isApplyingFromInput.value || isApplyingFromWatch.value) return;

//   if (newVal && newVal !== oldVal) {
//     isApplyingFromWatch.value = true;
//     if (oldVal) voucherUsage.value = voucherUsage.value.filter(v => v.code !== oldVal);
//     await applyVoucher(newVal);
//     isApplyingFromWatch.value = false;
//   }
// });

// watch(selectedFreeship, async (newVal, oldVal) => {
//   if (isApplyingFromInput.value || isApplyingFromWatch.value) return;

//   if (newVal && newVal !== oldVal) {
//     isApplyingFromWatch.value = true;
//     if (oldVal) voucherUsage.value = voucherUsage.value.filter(v => v.code !== oldVal);
//     await applyVoucher(newVal);
//     isApplyingFromWatch.value = false;
//   }
// });



  return {
    removeVoucher,
    handleVoucherReset,
    handleApplyVoucherInput,
    handleSelectVoucher,
  };
};