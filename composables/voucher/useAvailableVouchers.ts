import { ref, computed } from "vue";
import { vouchersAPI } from "@/services/v1/voucher.service";
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { useState } from "nuxt/app";

export const useAvailableVouchersForOrder = () => {
  const vouchers = useState<VoucherAvailableDTO[]>(
      'vouchers-product',
      () => []
    )
  const loading = ref(false);

  const fetchAvailableVouchers = async ({
    orderTotal,
    categoryIds = [],
    userId,
  }: {
    orderTotal: number;
    categoryIds?: string[];
    userId?: string;
  }) => {
    loading.value = true;
    try {
      const res = await vouchersAPI.getAvailable({
        orderTotal,
        categoryIds,
        userId,
      });

      if (res.code === 0) {
        vouchers.value = res.data;
      } else {
        console.warn(res.message ?? "Không thể tải danh sách voucher");
      }
    } catch (err) {
      console.error("Error fetching available vouchers:", err);
    } finally {
      loading.value = false;
    }
  };

  const allVouchers = computed(() => vouchers.value);

  // const getVoucherProduct = computed(() => vouchers.value?.filter((item) => item.type !== VOUCHER_TYPE.freeship.type && item.disabledReason === null))
  const getVoucherProduct = computed(() => vouchers.value?.filter((item) => item.disabledReason === null))

  return {
    loading,
    fetchAvailableVouchers,
    allVouchers,
    getVoucherProduct,
  };
};
