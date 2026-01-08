<script lang="ts" setup>
import type { MenuItem } from '@/server/types/common/menu-item'

defineProps<{
  item: MenuItem
  maxChildren?: number
}>()

const MAX_CHILD = 5
</script>

<template>
  <div
    v-if="item?.children?.length"
    class="hover-visible-overlay-el
           max-height-400 overflow-auto
           position-absolute rd-lg
           top-full left-0 w-full
           shadow-2 z-index-3
           bg-white pd-md
           flex flex-wrap gap-md"
  >
    <div
      v-for="(child, idx) in item.children"
      :key="idx"
      class="col-2"
    >
      <!-- cấp 2 -->
      <NuxtLink :to="child.path">
        <div
          v-if="child.icon"
          class="align-content-center text-center
                 bg-gray2 rd-full
                 height-50 width-50
                 object-fit-cover overflow-hidden
                 mb-sm"
        >
          <Image 
            :src="child.icon"
            :alt="child.label"
            class="hover-scale transition-0d3"
            :width="50"
            preset="label"
          />
        </div>

        <Text
          :text="child.label"
          color="black"
          size="normal"
          limit="1"
          weight="semibold"
          class="text-uppercase hover-color-primary transition-0d3"
        />
      </NuxtLink>

      <!-- cấp 3 -->
      <div
        v-for="(child2, idx2) in Object.values(child.children || {}).slice(0, MAX_CHILD)"
        :key="idx2"
      >
        <NuxtLink :to="child2.path">
          <Text
            :text="child2.label"
            color="gray5"
            limit="1"
            class="mt-sm hover-color-primary transition-0d3"
          />
        </NuxtLink>
      </div>

      <!-- Xem thêm -->
      <div v-if="Object.values(child.children || {}).length > MAX_CHILD">
        <NuxtLink :to="child.path">
          <Text
            text="Xem thêm"
            color="black"
            limit="1"
            class="mt-sm hover-color-primary transition-0d3 text-underline"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
