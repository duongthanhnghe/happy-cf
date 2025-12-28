<script lang="ts" setup>
import type { MenuItem } from '@/server/types/common/menu-item'

defineProps<{
  listMenuMore: MenuItem[]
}>()
</script>

<template>
  <template v-for="(item, index) in listMenuMore" :key="index">
    <NuxtLink :to="item.path">
      <Text
        :text="item.label"
        color="gray5"
        class="mb-ms pl-ms"
      />
    </NuxtLink>
  </template>
</template>
