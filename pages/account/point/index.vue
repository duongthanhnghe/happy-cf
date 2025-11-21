<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useHistoryRewardByUserStore();

if(!store.getItems) await store.getDataInit()
</script>
<template>
  <ListHistoryReward />
</template>