<script lang="ts" setup>
import '@/styles/molecules/order/order-item-detail-template1.scss'
import { formatCurrency, formatDateTime, copyText } from '@/utils/global'
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { useAdminOrderDetailStore } from '@/stores/admin/order/useOrderDetailStore';
import { useOrderManageStore } from '@/stores/admin/order/useOrderManageStore';
import { getFilteredTransactionStatus } from '@/composables/admin/order/useFilteredTransactionStatus';
import { useAdminUserDetailStore } from '@/stores/admin/users/useUserDetailStore';
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';

const storeDetailOrder = useAdminOrderDetailStore()
const store = useOrderManageStore()
const storeDetailUser = useAdminUserDetailStore()

</script>
<template>
  <template v-if="storeDetailOrder.getDetailOrder">
    <div class="row row-sm">
      <!-- Sản phẩm -->
      <div class="col-12 col-lg-4 mb-md">
        <Card size="sm" class="rd-lg height-full" heading="Sản phẩm">
          <div class="overflow-auto scroll-hide max-height-500">
            <template v-for="(items, index) in storeDetailOrder.getDetailOrder?.cartItems" :key="index">
              <AdminOrderItemTemplate1 :item="items" class="mb-sm"/>
            </template>
          </div>
        </Card>
      </div>

      <!-- Đơn hàng -->
      <div class="col-12 col-lg-4 mb-md">
        <Card size="sm" class="rd-lg height-full" heading="Đơn hàng">
          <div class="flex flex-direction-column gap-sm">
            <div class="flex justify-between weight-medium line-height-1">
              <div class="flex align-center gap-xs">
                Tổng cộng
                <span v-if="storeDetailOrder.getDetailOrder?.totalPriceSave && storeDetailOrder.getDetailOrder?.totalPriceSave !== 0" class="text-color-green">(Giảm giá: {{ formatCurrency(storeDetailOrder.getDetailOrder?.totalPriceSave) }})</span>
              </div>
              <div class="weight-semibold text-color-danger text-right mb-xs">
                {{ formatCurrency(storeDetailOrder.getDetailOrder?.totalPrice) }}
              </div>
            </div>
            <div class="flex justify-between text-color-gray5">
              Đơn hàng
              <span>
                {{ formatCurrency(storeDetailOrder.getDetailOrder?.totalPriceCurrent) }}
              </span>
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.shippingFee" class="flex justify-between text-color-gray5">
              Phí vận chuyển
              <span>
                {{ formatCurrency(storeDetailOrder.getDetailOrder?.shippingFee) }}
              </span>
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.totalDiscountOrder && storeDetailOrder.getDetailOrder?.totalDiscountOrder !== 0" class="flex justify-between text-color-gray5">
              Giảm đơn hàng <span>-{{ formatCurrency(storeDetailOrder.getDetailOrder?.totalDiscountOrder) }}</span>
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.usedPoints !== 0" class="flex justify-between text-color-gray5">
              Điểm sử dụng
              <span>
              -{{ formatCurrency(storeDetailOrder.getDetailOrder?.usedPoints) }}
              </span>
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.membershipDiscountAmount !== 0" class="flex justify-between text-color-gray5">
              Ưu đãi thành viên
              <span>
                -{{ formatCurrency(storeDetailOrder.getDetailOrder?.membershipDiscountAmount) }}
              </span>
            </div>
            <div v-if="storeDetailOrder.totalDiscountVoucher !== 0" class="flex justify-between text-color-gray5">
              Mã giảm giá
              <span>
                -{{ formatCurrency(storeDetailOrder.totalDiscountVoucher) }} 
              </span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Thông tin -->
      <div class="col-12 col-lg-4 mb-md">
        <Card size="sm" class="rd-lg height-full" heading="Thông tin">
          <div class="flex flex-direction-column gap-sm">
            <div class="flex justify-between">
              <Text color="gray5" text="Địa chỉ:" />
              <Text 
                color="black" 
                :text="storeDetailOrder.getDetailOrder?.address
                 + ', '
                 + storeDetailOrder.getDetailOrder?.wardName 
                 + ', '
                 + storeDetailOrder.getDetailOrder?.districtName 
                 + ', '
                 + storeDetailOrder.getDetailOrder?.provinceName" />
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="Thời gian đề xuất:" />
              <Text color="black" :text="storeDetailOrder.getDetailOrder?.time" />
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="Thời gian đặt hàng:" />
              <Text color="black" :text="formatDateTime(storeDetailOrder.getDetailOrder?.createdAt)" />
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="Tên người nhận:" />
              <div class="flex gap-xs">
                <Text color="black" :text="storeDetailOrder.getDetailOrder?.fullname" />
                <Button v-if="storeDetailOrder.getDetailOrder.userId" color="gray" size="xs" icon="visibility" @click="storeDetailUser.handleTogglePopup(true,storeDetailOrder.getDetailOrder.userId)" />
              </div>
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="Số điện thoại:" />
              <Text color="black" :text="storeDetailOrder.getDetailOrder?.phone" />
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.note" class="flex justify-between">
              <Text color="gray5" text="Ghi chú:" />
              <Text color="black" :text="storeDetailOrder.getDetailOrder?.note" />
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="H/T Thanh toán:" />
              <div class="flex gap-sm">
                <v-chip v-if="storeDetailOrder.getDetailOrder.paymentId" label color="gray">
                  <img width="20" :src="storeDetailOrder.getDetailOrder?.paymentId.image" alt="icon" class="mr-xs"/>
                  {{ storeDetailOrder.getDetailOrder?.paymentId.name }}
                </v-chip>
              </div>
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="T/T Thanh toán:" />
              <div>
                <AdminOrderTransactionDropdown
                  :orderId="storeDetailOrder.getDetailOrder.id"
                  :transaction="storeDetailOrder.getDetailOrder.transaction"
                  :order-status-id="storeDetailOrder.getDetailOrder.status.id"
                  :status-list="getFilteredTransactionStatus(storeDetailOrder.getDetailOrder.status.id)"
                  :on-update-status="store.handleUpdateStatusTransactionOrder"
                />
              </div>
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.transaction?.id" class="flex justify-between">
              <Text color="gray5" text="Mã thanh toán:" />
              <Text color="black" :text="storeDetailOrder.getDetailOrder?.transaction.id" />
            </div>
            <div v-if="storeDetailOrder.getDetailOrder?.cancelRequested" class="flex justify-between">
              <Text color="gray5" text="Yêu cầu huỷ đơn:" />
              <v-chip v-if="storeDetailOrder.getDetailOrder?.cancelRequested && storeDetailOrder.getDetailOrder?.status.id === ORDER_STATUS.PENDING" label color="red">
                {{ storeDetailOrder.getDetailOrder?.cancelRequested ? 'Cần xử lý' : null }}
              </v-chip>
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="T/T đơn hàng:" />
              <div class="flex gap-sm">
                <AdminOrderStatusDropdown
                  :order="storeDetailOrder.getDetailOrder"
                  :status-list="store.statusListToShow(storeDetailOrder.getDetailOrder)"
                  :on-update-status="store.handleUpdateStatusOrder"
                />
              </div>
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="T/T vận đơn:" />
              <div>
                <v-chip v-if="!storeDetailOrder.getDetailOrder.shipping" label color="grey">
                  Chưa vận đơn
                </v-chip>
                <AdminShippingStatusDropdown 
                  v-else
                  :orderId="storeDetailOrder.getDetailOrder.id"
                  :shipping="storeDetailOrder.getDetailOrder.shipping"
                  :on-update-status="store.handleUpdateOrderShippingStatus"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Voucher -->
      <div v-if="storeDetailOrder.getDetailOrder?.voucherUsage?.length > 0" class="col-12 col-lg-4 mb-md">
        <Card size="sm" class="rd-lg height-full" heading="Voucher áp dụng">
          <div class="flex flex-direction-column gap-sm">
            <template v-for="(items, index) in storeDetailOrder.getDetailOrder?.voucherUsage" :key="index" label>
              <div class="flex justify-between">
                <Text color="gray5" :text="items.type === VOUCHER_TYPE.freeship.type ? 'Mã giảm PVC:' : 'Mã giảm giá:'" />
                  <div class="flex gap-xs">
                  <v-chip label :color="items.type === VOUCHER_TYPE.freeship.type ? 'green' : 'blue'">
                    {{ items.code }}
                  </v-chip>
                  <v-chip label>
                    Giảm {{ formatCurrency(items.discount) }}
                  </v-chip>
                  </div>
                </div>
            </template>
            <Button v-if="storeDetailOrder.getDetailOrder?.voucherRefunded" :border="false" disabled label="Đơn bị huỷ - Đã hoàn lại voucher" class="width-full" />
          </div>
        </Card>
      </div>

      <!-- Quà tặng -->
      <div v-if="storeDetailOrder.getDetailOrder?.giftItems" class="col-12 col-lg-4">
        <Card size="sm" class="rd-lg height-full" heading="Quà tặng kèm">
          
          <!-- logs -->
          <div v-if="storeDetailOrder.getDetailOrder.promotionGiftUsages?.length" class="mb-ms">
            <div
              v-for="usage in storeDetailOrder.getDetailOrder.promotionGiftUsages"
              :key="usage._id"
              class="flex flex-direction-column gap-sm"
            >
              <div class="flex justify-between">
                <Text color="gray5" :text="usage.promotionGiftId.name" />
                <v-chip
                  size="small"
                  :color="usage.reverted ? 'orange' : 'green'"
                >
                  {{ usage.reverted ? 'Đã hoàn lại' : 'Đang áp dụng' }}
                </v-chip>
              </div>

              <div class="flex justify-between">
                <Text color="gray5" text="Áp dụng lúc:" />
                {{ formatDateTime(usage.usedAt, 'vi-VN') }}
              </div>

              <div v-if="usage.revertedAt" class="flex justify-between">
                <Text color="gray5" text="Hoàn lại lúc:" />
                {{ formatDateTime(usage.revertedAt, 'vi-VN') }}
              </div>
            </div>
          </div>
          
          <!-- gift -->
          <div class="flex flex-direction-column gap-sm">
            <template v-for="(items, index) in storeDetailOrder.getDetailOrder.giftItems" :key="index">
              <AdminOrderItemTemplate1 :item="items" />
            </template>
          </div>
        </Card>
      </div>

      <!-- Điểm tích luỹ -->
      <div class="col-12 col-lg-4 mb-md">
        <Card size="sm" class="rd-lg height-full">
          <template v-if="storeDetailOrder.getDetailOrder?.usedPoints !== 0">
            <Heading text="Điểm sử dụng" />
            <div class="flex flex-direction-column gap-sm mb-sm">
              <div class="flex justify-between">
                <Text color="gray5" text="Điểm áp dụng:" />
                {{ storeDetailOrder.getDetailOrder?.usedPoints }}
              </div>
              <div class="flex justify-between">
                <Text color="gray5" text="Tình trạng:" />
                <v-chip label :color="storeDetailOrder.getDetailOrder?.pointsRefunded ? 'secondary' : 'blue'">
                  {{ !storeDetailOrder.getDetailOrder?.pointsRefunded ? 'Sử dụng' : 'Đã hoàn'}}
                </v-chip>
              </div>
            </div>
          </template>

          <template v-if="storeDetailOrder.getDetailOrder?.reward">
            <Heading text="Điểm tích luỹ" />
            <div class="flex flex-direction-column gap-sm">
              <div class="flex justify-between">
                <Text color="gray5" text="Điểm cộng từ đơn hàng:" />
                {{ storeDetailOrder.getDetailOrder?.reward.points }}
              </div>
              <div class="flex justify-between">
                <Text color="gray5" text="Tình trạng:" />
                <v-chip label :color="storeDetailOrder.getDetailOrder?.reward?.awarded ? 'green' : 'gray'">
                  {{ storeDetailOrder.getDetailOrder?.reward?.awarded ? 'Đã cộng' : 'Chưa cộng'}}
                </v-chip>
              </div>
              <div v-if="storeDetailOrder.getDetailOrder?.reward?.awardedAt" class="flex justify-between">
                <Text color="gray5" text="Thời gian cộng:" />
                <Text tag="span" :text="formatDateTime(storeDetailOrder.getDetailOrder?.reward?.awardedAt)" />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Vận đơn -->
      <div class="col-12 col-lg-4">
        <Card size="sm" class="rd-lg height-full" heading="Vận đơn">
          <div v-if="storeDetailOrder.getDetailOrder?.shipping" class="flex flex-direction-column gap-sm">
            <div class="flex justify-between" v-if="storeDetailOrder?.getDetailOrder?.shipping?.trackingCode">
              <Text color="gray5" text="Mã đơn:" />
              <div class="flex align-center">
                <Text tag="span" :text="storeDetailOrder.getDetailOrder.shipping?.trackingCode" />
                <Button :border="false" color="secondary" size="xs" icon="content_copy" @click="copyText(storeDetailOrder.getDetailOrder?.shipping?.trackingCode)" />
              </div>
            </div>
            <div class="flex justify-between" v-if="storeDetailOrder.getDetailOrder?.shipping?.shippingFee">
              <Text color="gray5" text="Phí vận chuyển:" />
               <Text tag="span" :text="formatCurrency(storeDetailOrder.getDetailOrder.shipping?.shippingFee)" color="danger"/>
            </div> 
            <div v-if="storeDetailOrder.getDetailOrder?.shipping?.shippedAt" class="flex justify-between">
              <Text color="gray5" text="Thời gian gửi hàng:" />
              <Text tag="span" :text="formatDateTime(storeDetailOrder.getDetailOrder?.shipping?.shippedAt)" />
            </div> 
            <div v-if="storeDetailOrder.getDetailOrder?.shipping?.deliveredAt" class="flex justify-between">
              <Text color="gray5" text="Thời gian giao hàng:" />
              <Text tag="span" :text="formatDateTime(storeDetailOrder.getDetailOrder?.shipping?.deliveredAt)" />
            </div>
            <div class="flex justify-between">
              <Text color="gray5" text="Đơn vị:" />
              <Text tag="span" :text="storeDetailOrder.getDetailOrder.shipping?.provider?.name" />
            </div>  
            <Button color="secondary" label="Chi tiết" @click="store.handlePopupDetailOrderShipping(storeDetailOrder.getDetailOrder.shipping.id)" />
          </div>
          <div v-else class="flex justify-center">
            <Button color="primary" label="Tạo vận đơn" @click="store.handlePopupCreateOrderShipping(storeDetailOrder.getDetailOrder.id)" />
          </div>
        </Card>
      </div>

      
    </div>

  </template>
  <NoData v-else />
</template>