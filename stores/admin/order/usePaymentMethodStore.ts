import { defineStore } from "pinia";
import { usePaymentMethodOperations } from "@/composables/admin/order/usePaymentMethodOperations";
import { usePaymentMethodState } from "@/composables/admin/order/usePaymentMethodState";

export const usePaymentMethodStore = defineStore("PaymentMethodStore", () => {

  const state = usePaymentMethodState()

  const operation = usePaymentMethodOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
  )
  
  return {
    ...state,
    ...operation,
  };
});
