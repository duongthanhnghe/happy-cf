<script lang="ts" setup>
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore.ts'
import { formatDateTime } from '@/utils/global'

const store = useHistoryRewardByUserStore();

</script>
<template>
  <Popup popupId="popup-list-review-by-user" v-model="store.isTogglePopup" popupHeading="Lich su tich diem" align="right" bodyClass="bg-gray2 pd-0 pb-md">
    <template #body>
      <div class="container pt-ms">
        <v-infinite-scroll
          v-if="store.getItems && store.getItems.length > 0"
          height="auto"
          mode="manual"
          @load="store.load"
        >
          <div v-for="item in store.getItems" :key="item.id" class="mb-sm">
            <div class="bg-white card card-sm">
              <div class="flex justify-between align-center">
                <span class="flex gap-sm align-center weight-semibold">
                  <Button tag="span" color="secondary" icon="diamond_shine" size="sm" />
                  {{ item.reward.points }}
                </span>
                <span>
                  {{ formatDateTime(item.reward.awardedAt) }}
                </span>
              </div>
            </div>
          </div>
          <template #load-more="{ props }">
            <Button color="secondary" label="Tải thêm" @click="props.onClick" />
          </template>
        </v-infinite-scroll>
        <div v-else>
          <NoData />
        </div>
      </div>
    </template>
  </Popup>

</template>

