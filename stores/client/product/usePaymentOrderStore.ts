import { ref } from "vue";
import { defineStore } from "pinia";
import { usePaymentOrderUtils } from "@/composables/order/usePaymentOrderUtils";

export const usePaymentOrderStore = defineStore("PaymentOrderStore", () => {

  const qrCodeUrl = ref('')
  const isCheckingPayment = ref(false);
  const paymentCheckInterval = ref<any>(null);
  const checkPaymentAttempts = ref(0);
  const MAX_CHECK_ATTEMPTS = 6; //1 minute
  const paymentStartTimeout = ref<any>(null);

  const utils = usePaymentOrderUtils(
    qrCodeUrl,
    isCheckingPayment,
    paymentCheckInterval,
    checkPaymentAttempts,
    MAX_CHECK_ATTEMPTS,
    paymentStartTimeout,
  );

  return {
    qrCodeUrl,
    ...utils,
  };
});
