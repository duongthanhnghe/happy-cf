import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { Loading } from "@/utils/global";
import { ordersAPI } from "@/services/v1/orders.service";
import { ORDER_STATUS } from "@/shared/constants/order-status";
import { PAYMENT_STATUS } from "@/shared/constants/payment-status";
import { ROUTES } from '@/shared/constants/routes';
import type { CreateOrderBody, cartItems } from '@/server/types/dto/v1/order.dto';
import type { Ref } from 'vue';
import type { CartDTO } from '@/server/types/dto/v1/product.dto';
import type { ApplyVoucherResponse } from "@/server/types/dto/v1/voucher.dto";

export const useCartOrder = (
  cartListItem: Ref<CartDTO[]>,
  informationOrder: any,
  paymentSelected: Ref<string>,
  totalPriceDiscount: Ref<number>,
  totalPriceSave: Ref<number>,
  totalPriceCurrent: Ref<number>,
  orderPriceDiscount: Ref<number>,
  shippingFee: Ref<number>,
  usedPointOrder: any,
  totalDiscountRateMembership: Ref<number>,
  voucherUsage: Ref<ApplyVoucherResponse[]>,
  discountVoucherFreeship: Ref<number>,
  deleteCartAll: () => void,
  router: any,
  storeLocation: any
) => {

  const submitOrder = async (userId?: string, membershipDiscountRate?: number) => {
    const confirm = await showConfirm('Xác nhận đặt hàng?');
    if (!confirm) return;

    if (shippingFee.value === 0) {
      showWarning('Khong tinh duoc phi van chuyen');
      return;
    }

    Loading(true);

    const newCartItems = cartListItem.value.map((item) => {
      return {
        idProduct: item.id,
        priceDiscounts: item.priceDiscounts,
        quantity: item.quantity,
        note: item.note ? item.note : null,
        selectedOptionsPush: item.selectedOptionsPush ? item.selectedOptionsPush : null,
        finalPriceDiscounts: item.finalPriceDiscounts ? item.finalPriceDiscounts : null
      };
    });

    const point = userId ? Math.round(totalPriceDiscount.value * 0.05) : 0;
    const newUsedPoint = usedPointOrder.checkBalancePoint ? usedPointOrder.usedPoint : 0;

    const newVoucherUsage = voucherUsage.value.map(v => {
      const updated = { ...v };
      if (v.type === "freeship") {
        updated.discount = discountVoucherFreeship.value;
      }
      return updated;
    });

    const orderData: CreateOrderBody = {
      code: 'ORDER' + Date.now(),
      time: informationOrder.time,
      address: informationOrder.address,
      fullname: informationOrder.fullname,
      phone: informationOrder.phone,
      note: informationOrder.note,
      paymentId: paymentSelected.value,
      cartItems: newCartItems as cartItems[],
      totalPrice: totalPriceDiscount.value,
      totalPriceSave: totalPriceSave.value,
      totalPriceCurrent: totalPriceCurrent.value,
      totalDiscountOrder: totalPriceCurrent.value - orderPriceDiscount.value,
      shippingFee: shippingFee.value,
      status: ORDER_STATUS.PENDING,
      userId: userId || null,
      provinceCode: storeLocation.selectedProvince || 0,
      districtCode: storeLocation.selectedDistrict || 0,
      wardCode: storeLocation.selectedWard || 0,
      voucherUsage: newVoucherUsage
    };

    try {
      const result = await ordersAPI.create(orderData, userId || null, point, newUsedPoint);
      
      if (result.code === 0 && result.data.id) {
        if (paymentSelected.value === PAYMENT_STATUS.BANK) {
          showSuccess('Đặt hàng thành công, vui long thanh toan!');
          router.push({
            path: ROUTES.PUBLIC.PAYMENT.path,
            query: {
              orderId: result.data.id,
              orderCode: result.data.code,
              amount: result.data.totalPrice
            }
          });
        } else {
          const handleSubmitOk = (id: string) => {
            router.push({ path: `${ROUTES.PUBLIC.ORDER_TRACKING.path}/${id}` });
          };
          
          const handleSubmitCancel = () => {
            router.push({ path: '/' });
          };

          showConfirm(
            "Đặt hàng thành công",
            "Đơn hàng của bạn đang đuợc tiêp nhân và xử lý",
            'success',
            'Theo doi don hang',
            'Ve trang chu',
            () => handleSubmitOk(result.data.id),
            handleSubmitCancel
          );
        }

        handleResetForm();
      }
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      Loading(false);
    }
  };

  const handleResetForm = () => {
    deleteCartAll();
    usedPointOrder.pointInput = 0;
    usedPointOrder.usedPoint = 0;
    usedPointOrder.checkBalancePoint = false;
    totalDiscountRateMembership.value = 0;
  };

  return {
    submitOrder,
    handleResetForm,
  };
};