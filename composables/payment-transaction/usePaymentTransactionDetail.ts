import { ref, computed } from "vue";
import type { PaymentTransactionDTO } from "@/server/types/dto/v1/payment-transaction.dto"; 
import { paymentTransactionsAPI } from "@/services/v1/payment-transaction.service";

export const usePaymentTransactionDetail = () => {
  
  const detailData = ref<PaymentTransactionDTO|null>(null);

  const fetchDetailTransaction = async (id: string) => {
    try {
      const data = await paymentTransactionsAPI.getDetail(id)
      if(data.code === 0) {
        detailData.value = data.data
      } 
    } catch (err) {
      console.error('Error detail transaction', err)
    }
  }

  const getDetail = computed(() => detailData.value);
  
  return {
    detailData,
    fetchDetailTransaction,
    getDetail
  }
}