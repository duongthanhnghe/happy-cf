<script lang="ts" setup>
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
import { formatDateTime } from '@/utils/global'
import { REWARD_HISTORY_TYPE } from '@/shared/constants/history-reward-type'
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
          <div v-for="item in store.getItems" :key="item.orderId" class="mb-sm">
            <div class="bg-white card card-sm">
              <div class="flex gap-xs mb-sm">
                <v-chip label> {{ item.code }} </v-chip>
                <v-chip label :color="REWARD_HISTORY_TYPE[item.historyType]?.color || 'grey'"> {{ REWARD_HISTORY_TYPE[item.historyType]?.name || '' }} </v-chip>
              </div>
              <div class="flex justify-between align-center">
                <span class="flex gap-sm align-center weight-semibold">
                  <Button tag="span" color="secondary" icon="diamond_shine" size="sm" />
                  {{ item.historyType === REWARD_HISTORY_TYPE.used.type ? '-':'+'  }} {{ item.points }}
                </span>
                <span>
                  {{ formatDateTime(item.createdAt) }}
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

