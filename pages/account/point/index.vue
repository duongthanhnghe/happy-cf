<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
  showHeaderSub: ROUTES.PUBLIC.ACCOUNT.showHeaderSub,
})

const store = useHistoryRewardByUserStore();
const storeDisplay = useDisplayStore()

if(!store.getItems) await store.getDataInit()
</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.POINT.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <ListHistoryReward />
  </Card>
</template>