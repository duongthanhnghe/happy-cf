<script lang="ts" setup>
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
        <CardPointInfo :balancePoint="props.balancePoint" class="mb-lg"/>

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