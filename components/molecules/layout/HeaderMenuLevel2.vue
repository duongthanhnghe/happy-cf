<script lang="ts" setup>
import type { MenuItem } from '@/server/types/common/menu-item'

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <div
    v-if="item?.children?.length"
    class="hover-visible-overlay-el
           max-height-400 overflow-auto
           position-absolute rd-lg
           top-full left-0
           min-width-200
           shadow-2 z-index-3
           bg-white pt-xs pb-xs"
  >
    <NuxtLink
      v-for="(child, idx) in item.children"
      :key="idx"
      :to="child.path"
      class="flex w-full min-height-40
             pl-ms pr-ms align-center
             line-height-1"
    >
      <Text
        :text="child.label"
        color="gray5"
        limit="1"
        class="hover-color-primary transition-0d3"
      />
    </NuxtLink>
  </div>
</template>
