<script lang="ts" setup>
import type { MenuItem } from '@/server/types/common/menu-item'

defineProps<{
  listMenu: MenuItem[]
}>()
</script>

<template>
  <Card class="rd-lg mt-sm pb-0 overflow-hidden">
    <template v-for="(item, index) in listMenu" :key="index">
      <HeaderMenuItemTemplate1 :item="item" />
    </template>
  </Card>
</template>
