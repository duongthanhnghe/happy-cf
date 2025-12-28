<script lang="ts" setup>
import '@/styles/molecules/news/news-item-template1.scss'
import { formatDateTime } from '@/utils/global'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

const props = defineProps<{
  item: PostNewsDTO
}>()

</script>
<template>
  <div class="news-template1-item gap-sm flex mb-sm">
    <div class="news-template1-item-image">
      <img :src="props.item?.image" :alt="props.item?.title" />
    </div>
    <div class="news-template1-item-info flex justify-between">
      <Text :text="props.item?.categoryName" color="gray5" />
      <Text size="sm" weight="semibold" color="black" limit="2" class="mb-sm news-template1-item-title" :text="props.item?.title" />

      <div class="flex justify-between text-size-xs">
        <div class="news-template1-item-date text-color-black flex gap-xs align-center">
          <MaterialIcon name="calendar_today" size="14"/>
          <span class="text-color-gray5">
            {{ formatDateTime(props.item?.createdAt,'vi-VN', false) }}
          </span>
        </div>
        <router-link to="" class="text-color-gray5">
          Chi tiet
        </router-link>
      </div>
    </div>
  </div>
</template>