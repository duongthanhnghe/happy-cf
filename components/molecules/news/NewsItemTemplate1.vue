<script lang="ts" setup>
import '@/styles/molecules/news/news-item-template1.scss'
import {
  defineProps
} from 'vue'
import {
  formatDateTime
} from '~/utils/global'

const props = defineProps({
  item: {
    type: Object,
  }
})

</script>
<template>
  <div class="news-template1-item gap-sm flex mb-sm">
    <div class="news-template1-item-image">
      <img :src="props.item?.image" :alt="props.item?.title" />
    </div>
    <div class="news-template1-item-info flex justify-between">
      <Heading tag="div" size="sm" weight="semibold" class="news-template1-item-title black text-limit text-limit-2 mb-sm">
        {{ props.item?.title }}
      </Heading>
      <div class="flex justify-between text-size-xs">
        <div class="news-template1-item-date text-color-black flex gap-xs align-center">
          <MaterialIcon name="calendar_today" size="14"/>
          <span class="text-color-gray5">
            {{ formatDateTime(props.item?.time,'vi-VN', false) }}
          </span>
        </div>
        <router-link to="" class="text-color-gray5">
          Chi tiet
        </router-link>
      </div>
    </div>
  </div>
</template>