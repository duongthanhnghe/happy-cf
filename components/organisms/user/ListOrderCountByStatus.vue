

<script lang="ts" setup>
import type { OrderStatusCountDTO } from '@/server/types/dto/v1/order.dto';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { ROUTES } from '@/shared/constants/routes';

const storeDisplay = useDisplayStore()
const props = defineProps<{
  listData: OrderStatusCountDTO[]
}>()
</script>
<template>
  <Card size="sm" class="rd-xs shadow-1">
    <Heading text="Đơn hàng" size="normal" :slug="ROUTES.PUBLIC.ACCOUNT.children?.ORDERS.path"/>
    <div class="flex overflow-auto scroll-hide gap-sm">
    <Card v-for="item in listData" :size="storeDisplay.isLaptop ? 'sm':'ms'" bg="gray6" class="rd-lg flex-1 min-width-150">
      <div class="mb-md flex justify-between">
        <MaterialIcon :name="item.icon" :size="storeDisplay.isLaptop ? 'xl':'lg'" weight="light"/>
        <Text size="xl" :text="item.count" color="black" weight="semibold" class="line-height-1"/>
      </div>
      <Text :text="item.name" color="primary" limit="1" class="line-height-1d2"/>
    </Card>
    </div>
  </Card>
</template>

