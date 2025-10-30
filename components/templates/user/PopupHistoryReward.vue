<script lang="ts" setup>
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
const store = useHistoryRewardByUserStore();

</script>
<template>
  <Popup popupId="popup-list-review-by-user" v-model="store.isTogglePopup" popupHeading="Lich su tich diem" align="right" bodyClass="bg-gray2 pd-0 pb-md">
    <template #body>
      <div class="container pt-ms">
        <ListHistoryReward />
      </div>
    </template>
  </Popup>
</template>

