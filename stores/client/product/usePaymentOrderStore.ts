import { ref } from "vue";
import { defineStore } from "pinia";
import { usePaymentOrderUtils } from "@/composables/order/usePaymentOrderUtils";

export const usePaymentOrderStore = defineStore("PaymentOrderStore", () => {

  const qrCodeUrl = ref('')
  const isCheckingPayment = ref(false);
  const paymentCheckInterval = ref<any>(null);
  const checkPaymentAttempts = ref(0);
  const MAX_CHECK_ATTEMPTS = 60; //5 phút

  const utils = usePaymentOrderUtils(
    qrCodeUrl,
    isCheckingPayment,
    paymentCheckInterval,
    checkPaymentAttempts,
    MAX_CHECK_ATTEMPTS,
  );

  return {
    qrCodeUrl,
    ...utils,
  };
});
