import { type Ref } from 'vue';
import { showSuccess, showWarning } from '@/utils/toast';
import { ordersAPI } from '@/services/v1/orders.service';
import { PAYMENT_TRANSACTION_STATUS } from '@/shared/constants/payment-transaction-status';
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from "nuxt/app";
import { ROUTES } from '@/shared/constants/routes';

export const usePaymentOrderUtils = (
  qrCodeUrl: Ref<string>,
  isCheckingPayment: Ref<boolean>,
  paymentCheckInterval: Ref<any>,
  checkPaymentAttempts: Ref<number>,
  MAX_CHECK_ATTEMPTS: number,
  paymentStartTimeout: Ref<any>,
  ) => {

  const config = useRuntimeConfig()
  const router = useRouter()
    
  const handleSepayPayment = (orderId: string, orderCode: string, amount: string) => {
    try {
      const qrUrl = generateQRCodeUrl(orderCode, amount);
      qrCodeUrl.value = qrUrl;

      if (paymentStartTimeout.value) {
        clearTimeout(paymentStartTimeout.value);
        paymentStartTimeout.value = null;
      }

      paymentStartTimeout.value = setTimeout(() => {
        startPaymentCheck(orderId);
      }, 2000);
    } catch (err: any) {
      console.error("Error:", err);
      showWarning("Lỗi khi tạo mã QR");
    }
  };

  const generateQRCodeUrl = (orderCode: string, amount: string) => {
    const accountNo = config.public.sepayAccountNo;
    const bankId = config.public.sepayBankId;
    const accountName = config.public.sepayAccountName as any;
    const template = 'compact2';
    
    const description = `Thanh toan don hang: ${orderCode}`;
    
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  };

  const checkPaymentStatus = async (orderId: string) => {
    if (!isCheckingPayment.value) return false;

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
    }, 10000);
  };

  const clearPaymentCheck = () => {
    if (paymentCheckInterval.value) {
      clearInterval(paymentCheckInterval.value);
      paymentCheckInterval.value = null;
    }

    if (paymentStartTimeout.value) {
      clearTimeout(paymentStartTimeout.value);
      paymentStartTimeout.value = null;
    }

    isCheckingPayment.value = false;
    checkPaymentAttempts.value = 0;
  };

  return {
    handleSepayPayment,
    generateQRCodeUrl,
    checkPaymentStatus,
    startPaymentCheck,
    clearPaymentCheck,
  };
};