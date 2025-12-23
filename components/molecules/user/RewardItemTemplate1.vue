<script lang="ts" setup>
import { formatCurrency, formatDateTime } from '@/utils/global'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { REWARD_HISTORY_TYPE } from '@/shared/constants/history-reward-type'
import type { RewardHistoryDTO } from '@/server/types/dto/v1/reward-history.dto';

const storeDisplay = useDisplayStore()
const props = defineProps<{
  item: RewardHistoryDTO
}>();

</script>
<template>
  <Card :bg="storeDisplay.isLaptop ? 'gray6':'white'" class="rd-lg shadow-1">
    <div class="flex justify-between line-height-1">
      <div class="flex gap-xs align-center weight-semibold">
        <Button tag="span" size="xs" color="secondary" icon="package_2" :disable="true"/>
        {{ props.item?.code }}
      </div>
      <Text :text="formatDateTime(props.item?.createdAt, 'vi-VN',false)" color="gray5" />
    </div>
    <div class="flex justify-between align-end">
      <div>
         <Text size="xl" color="black" weight="medium" class="mt-md mb-xs line-height-1" :text="`${item.historyType === REWARD_HISTORY_TYPE.used.type ? '-':'+'  } ${formatCurrency(item.points).replace('đ','')}`" />
        <Text size="xs" color="gray5" :text="` ${item.historyType === REWARD_HISTORY_TYPE.used.type ? 'Bạn đã sử dụng':'Bạn được cộng thêm'  }`" />
      </div>
      <v-chip label :color="REWARD_HISTORY_TYPE[item.historyType]?.color || 'grey'"> {{ REWARD_HISTORY_TYPE[item.historyType]?.name || '' }} </v-chip>
    </div>
  </Card>
</template>