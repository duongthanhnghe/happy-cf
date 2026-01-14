<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { onMounted } from 'vue';
import { useOrderCountByStatus } from '@/composables/order/useOrderCountByStatus';

definePageMeta({
  middleware: ROUTES.PUBLIC.MENU_ACCOUNT.middleware,
  showHeaderSub: ROUTES.PUBLIC.ACCOUNT.showHeaderSub,
})
const storeDisplay = useDisplayStore()
const store = useAccountStore();
const { getOrderStatusCounts, fetchOrderCountByStatus } = useOrderCountByStatus()

const listMenu = [
  ...store.accountMenu,
];
onMounted(async () => {
  if(!getOrderStatusCounts.value || getOrderStatusCounts.value.length === 0) await fetchOrderCountByStatus()
})
</script>
<template>
  <div :class="['min-height-dvh',storeDisplay.isLaptop ? 'bg-gray2':'bg-gray6']">
    <SectionAccount showLevel/>
    <div class="container">
      <ListOrderCountByStatus v-if="getOrderStatusCounts" :listData="getOrderStatusCounts" class="mb-sm"/>
      <div class="pt-ms">
        <MenuAccount :menu="listMenu" heading="Tài khoản"/>
        <div class="flex justify-center">
          <Button @click.prevent="store.handleLogout()" color="danger" class="bg-gray6 mt-sm" icon="logout" label="Đăng xuất" />
        </div>
      </div>
    </div>
  </div>
</template>