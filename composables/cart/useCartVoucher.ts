import { showWarning, showSuccess } from "@/utils/toast";
import { vouchersAPI } from "@/services/v1/voucher.service";
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import type { ApplyVoucherResponse, ApplyVoucherProduct } from "@/server/types/dto/v1/voucher.dto";
import type { Ref } from 'vue';
import type { CartDTO } from '@/server/types/dto/v1/product.dto';

export const useCartVoucher = (
  cartListItem: Ref<CartDTO[]>,
  totalPriceCurrent: Ref<number>,
  totalPriceDiscount: Ref<number>,
  shippingFee: Ref<number>,
  discountVoucher: Ref<number>,
  discountVoucherFreeship: Ref<number>,
  messageVoucher: Ref<string>,
  voucherUsage: Ref<ApplyVoucherResponse[]>,
  loadingAllVouchers: Ref<boolean>,
  activeFreeshipVoucher: Ref<string | null>,
  handleCalcTotalPriceCurrent: () => void,
  allVouchers: any,
  eventBus: any,
  fetchAvailableVouchers: any,
  route: any
) => {

  const applyVoucher = async (code: string, userId?: string) => {
    const orderTotal = totalPriceDiscount.value;
    const products: ApplyVoucherProduct[] = cartListItem.value.map(item => ({
      productId: item.id || '',
      name: item.productName || '',
      categoryId: item.categoryId || '',
      price: item.finalPriceDiscounts ? item.finalPriceDiscounts : item.priceDiscounts || 0,
      quantity: item.quantity,
    }));
    const orderCreatedAt = new Date().toISOString();

    if (!userId) {
      return showWarning("Vui long dang nhap de su dung voucher");
    }

    const existingVoucher = voucherUsage.value.find(v => v.code === code);
    if (existingVoucher) {
      showWarning(`Voucher đã được áp dụng: ${code}`);
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
        
        if (appliedVoucher.type === VOUCHER_TYPE.freeship.type) {
          discountVoucherFreeship.value = 0;
          discountVoucherFreeship.value = appliedVoucher.discount;
          
          if (discountVoucherFreeship.value > shippingFee.value) {
            discountVoucherFreeship.value = shippingFee.value;
          }

          activeFreeshipVoucher.value = code;
        } else {
          discountVoucher.value = appliedVoucher.discount;
          if (appliedVoucher.type === VOUCHER_TYPE.product.type) {
            messageVoucher.value = res.message || '';
          }
        }

        voucherUsage.value.push(appliedVoucher);
        showSuccess("Áp dụng voucher thành công");
        handleCalcTotalPriceCurrent();
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
    
    const code = activeFreeshipVoucher.value;
    await applyVoucher(code);

    if (discountVoucherFreeship.value === 0) {
      eventBus.emit('voucher:reset', {
        resetFreeship: true,
        resetVoucher: false,
      });
      activeFreeshipVoucher.value = null;
      showWarning("Voucher freeship không còn hợp lệ với đơn hàng hiện tại.");
    }
  };

  const listVoucher = async (userId: string, categoryIds: string[]) => {
    loadingAllVouchers.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await fetchAvailableVouchers({
      userId,
      categoryIds,
      orderTotal: totalPriceCurrent.value
    });
    
    const invalidVouchers = voucherUsage.value.filter(v => {
      const found = allVouchers.value.find((av: any) => av.code === v.code);
      return !found || found.isDisabled === true;
    });

    if (invalidVouchers.length > 0) {
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
        const found = allVouchers.value.find((av: any) => av.code === v.code);
        return found && found.isDisabled === false;
      });

      eventBus.emit('voucher:reset', {
        resetFreeship: hasInvalidFreeship,
        resetVoucher: hasInvalidVoucher,
      });
      
      showWarning("Voucher đã bị gỡ bỏ vì không còn hợp lệ.");
    }

    loadingAllVouchers.value = false;
  };

  return {
    applyVoucher,
    reapplyFreeshippVoucher,
    listVoucher,
  };
};