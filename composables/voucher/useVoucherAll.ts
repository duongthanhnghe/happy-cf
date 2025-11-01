import { ref, computed } from "vue";
import { vouchersAPI } from "@/services/v1/voucher.service";
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";

export const useVoucherAll = () => {
  const vouchers = ref<VoucherAvailableDTO[]>([]);
  const loading = ref(false);

  const fetchVoucherAll = async () => {
    loading.value = true;
    try {
      const res = await vouchersAPI.getAll();

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

  const getVoucherAll = computed(() => vouchers.value);
  
  const getTotalVoucherAll = computed(() => vouchers.value.length);

  return {
    fetchVoucherAll,
    getVoucherAll,
    getTotalVoucherAll,
  };
};
