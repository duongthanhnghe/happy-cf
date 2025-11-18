<script lang="ts" setup>
import { formatCurrency } from '@/utils/global';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { ROUTES } from '@/shared/constants/routes';

const store = useCartStore();
const props = defineProps<{
  userId: string;
  balancePoint: number;
}>();
</script>
<template>
  <Popup v-model="store.isTogglePopupPoint" popupHeading="Su dung Point" bodyClass="bg-gray6" footerFixed align="right">
    <template #body >
      <template v-if="props.userId">
        <div class="flex gap-sm mb-lg">
          <Card size="sm" bg="white" border class="flex-1 rd-lg line-height-1 shadow-1">
            <Text text="Bạn đang có" />
            <Text :text="`${formatCurrency(props.balancePoint).replace('đ','')} Point`" weight="semibold" size="md" class="mt-sm mb-sm" />
            <Text text="Đang chờ 0 point" />
          </Card>
          <Card size="sm" bg="black" class="flex-1 rd-lg" style="max-width: 140px">
            <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
              <Text :text="`PointClub Reward Hub`" color="white" weight="semibold" size="normal" />
            </NuxtLink>
            <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5303 6.53033C39.8232 6.23743 39.8232 5.76256 39.5303 5.46967L34.7574 0.696696C34.4645 0.403803 33.9896 0.403803 33.6967 0.696696C33.4038 0.98959 33.4038 1.46446 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM6.55671e-08 6.75L39 6.75L39 5.25L-6.55671e-08 5.25L6.55671e-08 6.75Z" fill="white"></path>
            </svg>
          </Card>
        </div>

        <div class="mb-xl">
          <CartPointInput classEl="flex flex-direction-column gap-sm" :balancePoint="props.balancePoint"/>
        </div>

        <div class="mb-md">
          <Text weight="semibold" color="black" class="text-uppercase" text="Lưu ý" />
          <ul class="list-disc pl-lg">
            <li class="mt-xs">Point bạn áp dụng cho đơn hàng sẽ được khấu trừ từ tài khoản của bạn sau khi bạn nhấp vào <span class="weight-bold">"Thanh toán"</span>.</li>
            <li class="mt-xs">Bạn có thể hủy đơn hàng trong <span class="weight-bold">"Lịch sử đơn hàng"</span> số Point bạn đã áp dụng sẽ hoàn lại tài khoản của bạn.</li>
            <li class="mt-xs">Point có thể được sử dụng lên tới <span class="weight-bold">0% tổng giá trị thanh toán</span>.</li>
          </ul>
        </div>

        <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
          <Button color="primary" label="Hướng dẫn Point" />
        </NuxtLink>
      </template>
      <NoData v-else text="Vui long dang nhap de su dung"/>
    </template>
  </Popup>
</template>