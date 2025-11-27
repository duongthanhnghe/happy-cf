<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

const props = defineProps<{
  item: PostNewsDTO
}>()

</script>
<template>
  <div class="rd-xl overflow-hidden shadow-2 border-default">
    <NuxtLink :to="`${ROUTES.PUBLIC.NEWS.children?.DETAIL?.path}/${item.slug}`">
      <img :src="props.item?.image" :alt="props.item?.title" />
    </NuxtLink>
    <div class="pd-ms">
      <Text :text="props.item?.categoryName" color="gray5" style="margin-bottom: 4px"/>
      <NuxtLink :to="`${ROUTES.PUBLIC.NEWS.children?.DETAIL?.path}/${item.slug}`">
        <Text :text="props.item?.title" size="normal" limit="2" weight="semibold" class="min-height-50 mb-sm" />
      </NuxtLink>
      <div class="flex justify-between">
        <div class="text-color-black flex gap-xs align-center">
          <MaterialIcon name="calendar_today" size="normal" />
          <Text :text="formatDateTime(props.item?.createdAt,'vi-VN', false)" color="gray5" />
        </div>
        <NuxtLink :to="`${ROUTES.PUBLIC.NEWS.children?.DETAIL?.path}/${item.slug}`">
          Chi tiet
        </NuxtLink>
      </div>
    </div>
  </div>
</template>