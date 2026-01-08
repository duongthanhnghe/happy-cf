<script lang="ts" setup>
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { formatDateTime } from '@/utils/global'

const props = withDefaults(defineProps<{
  item?: PostNewsDTO
}>(), {
  
})

const storeDisplay = useDisplayStore()

</script>

<template>
  <template v-if="item">
    <div class="text-center mb-xl">
      <Text :text="item.title" :size="storeDisplay.isLaptop ? 'xxl':'xl'" color="black" weight="semibold"/>
      <div class="flex justify-center gap-md mt-ms">
        <Text :text="item.categoryName" color="primary" weight="semibold"/>
        <Text :text="formatDateTime(item.createdAt,'vi-VN', false)" color="gray5" weight="medium"/>
        <client-only>
          <Text :text="`${item.views} lượt xem`" color="gray5" weight="medium"/>
        </client-only>
      </div>
      <Image 
        v-if="item.image"
        :src="item.image" :alt="item.title"
        :width="1300"
        class="rd-lg mt-md"
      />
    </div>
    <Text v-if="item.summaryContent" :text="item.summaryContent" weight="semibold" class="mb-sm"/>
    <div v-html="item?.description"></div>

    <div class="flex flex-wrap justify-between gap-sm mt-md">
      <div>
        <template v-for="(hashTag,index) in item?.keywords" :key="index">
          <Button tag="span" color="gray" size="sm" :label="'#'+hashTag" />
        </template>
      </div>
      <ShareSocial />
    </div>
  </template>
</template>