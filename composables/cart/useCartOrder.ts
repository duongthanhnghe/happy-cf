import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { Loading } from "@/utils/global";
import { ordersAPI } from "@/services/v1/orders.service";
import { ORDER_STATUS } from "@/shared/constants/order-status";
import { PAYMENT_STATUS } from "@/shared/constants/payment-status";
import { ROUTES } from '@/shared/constants/routes';
import type { CreateOrderBody, cartItems } from '@/server/types/dto/v1/order.dto';
import type { MaybeRef, Ref } from 'vue';
import type { CartDTO } from '@/server/types/dto/v1/product.dto';
import type { ApplyVoucherResponse } from "@/server/types/dto/v1/voucher.dto";
import { useValidate } from "../validate/useValidate";
import { createOrderSchema } from "@/shared/validate/schemas/order.schema";
import { unref } from "vue";

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
  Config_EnableUsePoint: Ref<boolean>,
  totalDiscountRateMembership: Ref<number>,
  voucherUsage: Ref<ApplyVoucherResponse[]>,
  discountVoucherFreeship: Ref<number>,
  userId: MaybeRef<string | null>,
  deleteCartAll: () => void,
  router: any,
  storeLocation: any
) => {

  const { validate, formErrors } = useValidate(createOrderSchema)

  const submitOrder = async () => {
    const confirm = await showConfirm('Xác nhận đặt hàng?');
    if (!confirm) return;

    if (shippingFee.value === 0) {
      showWarning('Vui lòng điền thông tin nhận hàng');
      return;
    }

    Loading(true);

    const newCartItems = cartListItem.value.map((item) => {
      return {
        idProduct: item.id,
        sku: item.variantCombination ? item.variantCombination.sku : item.sku,
        price: item.variantCombination ? item.variantCombination.priceModifier : item.priceDiscounts,
        quantity: item.quantity,
        note: item.note || null,
        variantCombination: item.variantCombination || null,
        combinationId: item.combinationId || ''
      };
    });

    const newUsedPoint = usedPointOrder.checkBalancePoint && Config_EnableUsePoint.value ? usedPointOrder.usedPoint : 0;

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
      totalDiscountOrder: orderPriceDiscount.value,
      shippingFee: shippingFee.value,
      status: ORDER_STATUS.PENDING,
      userId: unref(userId) || null,
      provinceCode: storeLocation.selectedProvince,
      districtCode: storeLocation.selectedDistrict,
      wardCode: storeLocation.selectedWard,
      provinceName: storeLocation.selectedProvinceObj.PROVINCE_NAME,
      districtName: storeLocation.selectedDistrictObj.DISTRICT_NAME,
      wardName: storeLocation.selectedWardObj.WARDS_NAME,
      voucherUsage: newVoucherUsage
    };

    if (!validate({
      data: orderData,
      usedPoint: newUsedPoint,
    })) {
      showWarning('Vui lòng nhập đầy đủ thông tin đặt hàng hợp lệ')
      Loading(false)
      return
    }

    try {
      const result = await ordersAPI.create(orderData, newUsedPoint);
      
      if (result.code === 0 && result.data.id) {
        if (paymentSelected.value === PAYMENT_STATUS.BANK) {
          showSuccess('Đặt hàng thành công, vui lòng thanh toán đơn hàng!');
          router.push({
            path: ROUTES.PUBLIC.PAYMENT.path,
            query: {
              orderId: result.data.id,
              orderCode: result.data.code,
              amount: result.data.totalPrice
            }
          });
        } else if (paymentSelected.value === PAYMENT_STATUS.VNPAY) {
          const res = await ordersAPI.createVnpayPayment(result.data.id)
          if (res.code === 0 && res.data.paymentUrl) {
            window.location.href = res.data.paymentUrl
          } else {
            showWarning('Không thể tạo thanh toán VNPay!')
          }
        } else {
          const handleSubmitOk = (id: string) => {
            router.push({ path: `${ROUTES.PUBLIC.ORDER_TRACKING.path}/${id}` });
          };
          
          const handleSubmitCancel = () => {
            router.push({ path: '/' });
          };

          showConfirm(
            "Đặt hàng thành công",
            "Đơn hàng của bạn đang đuợc tiếp nhận và xử lý",
            'success',
            'Theo dõi đơn hàng',
            'Về trang chủ',
            () => handleSubmitOk(result.data.id),
            handleSubmitCancel
          );
        }

        handleResetForm();
      } else {
        showWarning(result.message ?? '')
        console.log('result.message',result.message)
      }
    } catch (err: any) {
      showWarning(err.message);
    } finally {
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