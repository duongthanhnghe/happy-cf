import { ref } from "vue";
import { useRouter } from 'vue-router'
import { defineStore } from "pinia";
import { showWarning, showSuccess } from "@/utils/toast";
import { ordersAPI } from "@/services/orders.service";
import { ROUTES } from '@/shared/constants/routes';
import { PAYMENT_TRANSACTION_STATUS } from "@/shared/constants/payment-transaction-status";

export const usePaymentOrderStore = defineStore("OrderStore", () => {

  const config = useRuntimeConfig()
  const router = useRouter()
  const qrCodeUrl = ref('')
  const isCheckingPayment = ref(false);
  const paymentCheckInterval = ref<any>(null);
  const checkPaymentAttempts = ref(0);
  const MAX_CHECK_ATTEMPTS = 60; //5 phút

  const handleSepayPayment = (orderId: string, orderCode: string ,amount: string) => {
    try {
      const qrUrl = generateQRCodeUrl(orderCode, amount);
      qrCodeUrl.value = qrUrl;
   
      // const orderId = order.id
      // const amount = order.totalPrice
      // router.replace({
      //   path: '/cart',
      //   query: { orderId, amount }
      // })
      setTimeout(() => {
        startPaymentCheck(orderId)
      }, 2000)
    } catch (err: any) {
      console.error("Error:", err);
      showWarning("Lỗi khi tạo mã QR");
    }
  };

  const generateQRCodeUrl = (orderCode: string, amount: string) => {
    const accountNo = config.public.sepayAccountNo;
    const bankId = config.public.sepayBankId;
    const accountName = config.public.sepayAccountName;
    const template = 'compact2';
    
    const description = `Thanh toan don hang: ${orderCode}`;
    
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const result = await ordersAPI.getDetail(orderId);
      
      if (result.code === 0 && result.data) {
        const order = result.data;
        
        if (order.transaction && order.transaction.status === PAYMENT_TRANSACTION_STATUS.paid.status) {
          clearPaymentCheck();
          showSuccess('Thanh toán thành công! Đơn hàng đang được xử lý.');
          
          setTimeout(() => {
            router.push({ path: `${ROUTES.PUBLIC.ORDER_TRACKING.path}/${orderId}` })
            qrCodeUrl.value = ''
          }, 2000);
          
          return true;
        }
        
        checkPaymentAttempts.value++;
        if (checkPaymentAttempts.value >= MAX_CHECK_ATTEMPTS) {
          clearPaymentCheck();
          showWarning('Chưa phát hiện thanh toán. Vui lòng kiểm tra lại đơn hàng.');
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
    return false;
  };

  const startPaymentCheck = (orderId: string) => {
    clearPaymentCheck(); // Clear interval cũ nếu có
    checkPaymentAttempts.value = 0;
    isCheckingPayment.value = true;
    
    checkPaymentStatus(orderId);
    
    paymentCheckInterval.value = setInterval(() => {
      checkPaymentStatus(orderId);
    }, 5000);
  };

  const clearPaymentCheck = () => {
    if (paymentCheckInterval.value) {
      clearInterval(paymentCheckInterval.value);
      paymentCheckInterval.value = null;
    }
    isCheckingPayment.value = false;
    checkPaymentAttempts.value = 0;
  };

  return {
    qrCodeUrl,
    startPaymentCheck,
    clearPaymentCheck,
    handleSepayPayment,
  };
});
