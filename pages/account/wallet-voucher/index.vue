<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useVoucherAll } from "@/composables/voucher/useVoucherAll";

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const { fetchVoucherAll, getVoucherAll, loadingData } = useVoucherAll();
if(getVoucherAll.value.length === 0) await fetchVoucherAll()
</script>
<template>
  <Card size="md" :heading="ROUTES.PUBLIC.ACCOUNT.children?.WALLET_VOUCHER.label" class="rd-xl">
    <LoadingData v-if="loadingData" />
    <div v-else-if="getVoucherAll.length > 0" class="row row-xs has-control">
      <VoucherItemTemplate1
        v-for="voucher in getVoucherAll"
        :key="voucher.code"
        :item="voucher"
        class="col-12 col-md-4"
      />
    </div>
    <NoData v-else />
  </Card>
</template>