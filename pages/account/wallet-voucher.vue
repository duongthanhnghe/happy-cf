<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useVoucherAll } from "@/composables/voucher/useVoucherAll";

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const { fetchVoucherAll, getVoucherAll } = useVoucherAll();
if(getVoucherAll.value.length === 0) fetchVoucherAll()

</script>
<template>
  <div class="flex gap-sm flex-column" v-if="getVoucherAll.length > 0">
    <VoucherItemTemplate1
      v-for="voucher in getVoucherAll"
      :key="voucher.code"
      :item="voucher"
    />
  </div>
</template>