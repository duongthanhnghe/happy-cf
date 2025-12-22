<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';

const props = defineProps<{
  getTotalPoint: number;
  userId: string;
}>();
</script>
<template>
  <Card border class="rd-xl flex justify-between mt-sm cart-point-info-label">
    <template v-if="userId">
      Được hoàn điểm thưởng
      <span  class="flex gap-xs weight-semibold">
        <Button tag="span" size="xs" color="secondary" icon="diamond_shine"/>
        {{ props.getTotalPoint }}
      </span>
    </template>
    <template v-else>
      Hoàn điểm thưởng
      <NuxtLink  :to="{ path: ROUTES.PUBLIC.LOGIN.path }">
        <Text color="primary" text="Đăng nhập" weight="semibold" class="text-underline" />
      </NuxtLink>
    </template>
  </Card>
</template>