<script lang="ts" setup>
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
const store = useHistoryRewardByUserStore();

</script>
<template>
  <Popup v-model="store.isTogglePopup" popupHeading="Lịch sử tích điểm" align="right" bodyClass="bg-gray2 pd-0 pb-md">
    <template #body>
      <div class="container pt-ms">
        <ListHistoryReward />
      </div>
    </template>
  </Popup>
</template>

