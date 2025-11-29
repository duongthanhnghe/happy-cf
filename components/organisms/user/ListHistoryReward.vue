<script lang="ts" setup>
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
const store = useHistoryRewardByUserStore();
</script>
<template>
  <LoadingData v-if="store.loadingData && !store.getItems" />
  <v-infinite-scroll
    v-else-if="store.getItems && store.getItems.length > 0"
    height="auto"
    mode="manual"
    @load="store.load"
  >
    <div v-for="item in store.getItems" :key="item.orderId" class="mb-ms">
      <RewardItemTemplate1 :item="item"/>
    </div>
    <template #load-more="{ props }">
      <Button color="secondary" label="Xem thêm" @click="props.onClick" />
    </template>
  </v-infinite-scroll>
  <NoData v-else />
</template>

