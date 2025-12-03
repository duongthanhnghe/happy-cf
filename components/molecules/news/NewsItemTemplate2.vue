<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

const storeDisplay = useDisplayStore()

const props = withDefaults(defineProps<{
  item: PostNewsDTO;
  listView?: boolean;
}>(), {
  listView: false
})

</script>
<template>
  <div :class="[listView && storeDisplay.isLaptop ? 'flex':'' ,'rd-xl overflow-hidden shadow-2 border-default bg-white']">
    <div :class="listView && storeDisplay.isLaptop ? 'max-width-per50':''">
      <NuxtLink :to="ROUTE_HELPERS.newsDetail(item.slug)">
        <img :src="props.item?.image" :alt="props.item?.title" />
      </NuxtLink>
    </div>
    <div :class="[listView && storeDisplay.isLaptop ? 'flex-1 pd-md':'pd-ms']">
      <Text :text="props.item?.categoryName" color="gray5" style="margin-bottom: 4px"/>
      <NuxtLink :to="ROUTE_HELPERS.newsDetail(item.slug)">
        <Text :text="props.item?.title" :size="listView && storeDisplay.isLaptop ? 'xl':'normal'" limit="2" weight="semibold" class="min-height-50 mb-sm" />
      </NuxtLink>
      <Text v-if="listView" :text="props.item?.summaryContent" limit="3" class="mb-sm" />
      <div class="flex justify-between">
        <div class="text-color-black flex gap-xs align-center">
          <MaterialIcon name="calendar_today" size="normal" />
          <Text :text="formatDateTime(props.item?.createdAt,'vi-VN', false)" color="gray5" />
        </div>
        <Text :text="`${props.item.views} lượt xem`" color="gray5" />
      </div>
    </div>
  </div>
</template>