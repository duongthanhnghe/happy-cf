<script lang="ts" setup>
import { formatCurrency } from '@/utils/global';
import { ROUTES } from '@/shared/constants/routes';

const props = defineProps<{
  balancePoint: number;
}>();
</script>
<template>
  <div class="flex gap-sm">
    <Card size="sm" bg="white" border class="flex-1 rd-lg line-height-1 shadow-1">
      <Text text="Bạn đang có" />
      <Text :text="`${formatCurrency(props.balancePoint).replace('đ','')} Point`" weight="semibold" size="md" class="mt-sm mb-sm" />
      <Text text="Đang chờ 0 point" />
    </Card>
    <Card size="sm" bg="black2" class="flex-1 rd-lg" style="max-width: 140px">
      <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
        <Text :text="`PointClub Reward Hub`" color="white" weight="semibold" size="normal" />
      </NuxtLink>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.5303 6.53033C39.8232 6.23743 39.8232 5.76256 39.5303 5.46967L34.7574 0.696696C34.4645 0.403803 33.9896 0.403803 33.6967 0.696696C33.4038 0.98959 33.4038 1.46446 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM6.55671e-08 6.75L39 6.75L39 5.25L-6.55671e-08 5.25L6.55671e-08 6.75Z" fill="white"></path>
      </svg>
    </Card>
  </div>
</template>