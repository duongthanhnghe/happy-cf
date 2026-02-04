import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { Loading } from "@/utils/global";
import { ordersAPI } from "@/services/v1/orders.service";
import { PAYMENT_STATUS } from "@/shared/constants/payment-status";
import { ROUTES } from '@/shared/constants/routes';
import type { CreateOrderBody, cartItems, GiftItemDTO } from '@/server/types/dto/v1/order.dto';
import type { Ref } from 'vue';
import type { CartDTO } from '@/server/types/dto/v1/product.dto';
import type { ApplyVoucherResponse } from "@/server/types/dto/v1/voucher.dto";
import { useValidate } from "../validate/useValidate";
import { createOrderSchema } from "@/shared/validate/schemas/order.schema";
import { usePayment } from "../order/usePayment";

export const useCartOrder = (
  cartListItem: Ref<CartDTO[]>,
  informationOrder: any,
  paymentSelected: Ref<string>,
  totalPriceDiscount: Ref<number>,
  totalPriceSave: Ref<number>,
  totalPriceCurrent: Ref<number>,
  orderPriceDiscount: Ref<number>,
  shippingFee: Ref<number>,
  shippingEnabled: Ref<boolean>,
  usedPointOrder: any,
  Config_EnableUsePoint: Ref<boolean>,
  totalDiscountRateMembership: Ref<number>,
  voucherUsage: Ref<ApplyVoucherResponse[]>,
  discountVoucherFreeship: Ref<number>,
  giftItems: Ref<GiftItemDTO[]>,
  deleteCartAll: () => void,
  router: any,
  storeLocation: any,
) => {

  const { validate, formErrors } = useValidate(createOrderSchema)
  const { payWithVnpay, payWithMomo } = usePayment()

  const submitOrder = async () => {
    const confirm = await showConfirm('Xác nhận đặt hàng?');
    if (!confirm) return;

    if (shippingFee.value === 0 && !shippingEnabled.value) {
      showWarning('Địa chỉ không hợp lệ, vui lòng xem lại địa chỉ nhận hàng');
      return;
    }

    Loading(true);

    const newCartItems = cartListItem.value.map((item) => {
      const variantSku = item.variantCombination?.sku ?? null
      const flashSaleItem = item.flashSale?.items?.find(
        i => i.variantSku === variantSku
      )

      const quantity = item.quantity

      const normalPrice =
        (item.variantCombination?.priceModifier ??
        item.priceDiscounts) || 0

      const originalPrice =
        (item.variantCombination?.priceModifier ??
        item.price) || 0

      const salePrice =
        item.isFlashSale && flashSaleItem
          ? flashSaleItem.salePrice
          : null

      const totalPrice =
        salePrice && quantity > 0
          ? salePrice + normalPrice * Math.max(quantity - 1, 0)
          : normalPrice * quantity

      const priceDiscount =
        !item.isFlashSale && item.priceDiscounts && item.price !== item.priceDiscounts
          ? item.priceDiscounts
          : 0

      return {
        idProduct: item.id,
        note: item.note || '',
        sku: item.variantCombination ? item.variantCombination.sku : item.sku,
        price: totalPrice,
        originalPrice,
        priceDiscount: priceDiscount,
        salePrice: salePrice || 0,
        quantity: item.quantity,
        variantCombination: item.variantCombination || null,
        combinationId: item.combinationId || '',
        flashSaleId: item.flashSale?.id ?? null,
        isFlashSale: item.isFlashSale === true,
        stackableWithPromotionGift: flashSaleItem?.stackableWithPromotionGift,
        stackableWithVoucher: flashSaleItem?.stackableWithVoucher
      };
    });

    console.log(newCartItems)
    // return

    const newGiftItems = giftItems.value.map(gift => ({
      promotionGiftId: gift.promotionGiftId,
      productId: gift.productId,
      quantity: gift.quantity,
      combinationId: gift.combinationId ?? undefined,
    }))

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
      giftItems: newGiftItems,
      totalPrice: totalPriceDiscount.value,
      totalPriceSave: totalPriceSave.value,
      totalPriceCurrent: totalPriceCurrent.value,
      totalDiscountOrder: orderPriceDiscount.value,
      shippingFee: shippingFee.value,
      provinceCode: storeLocation.selectedProvince,
      districtCode: storeLocation.selectedDistrict,
      wardCode: storeLocation.selectedWard,
      provinceName: storeLocation.selectedProvinceObj.PROVINCE_NAME,
      districtName: storeLocation.selectedDistrictObj.DISTRICT_NAME,
      wardName: storeLocation.selectedWardObj.WARDS_NAME,
      voucherUsage: newVoucherUsage
    };

    // console.log(orderData)
    // return

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
          await payWithVnpay(result.data.id)
        } else if (paymentSelected.value === PAYMENT_STATUS.MOMO) {
          await payWithMomo(result.data.id)
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