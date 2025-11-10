<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useVoucherAll } from "@/composables/voucher/useVoucherAll";

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const { fetchVoucherAll, getVoucherAll, loadingData } = useVoucherAll();
if(getVoucherAll.value.length === 0) await fetchVoucherAll()
</script>
<template>
  <LoadingData v-if="loadingData" />
  <div v-else-if="getVoucherAll.length > 0" class="flex gap-sm flex-column">
    <VoucherItemTemplate1
      v-for="voucher in getVoucherAll"
      :key="voucher.code"
      :item="voucher"
    />
  </div>
  <NoData v-else />
</template>