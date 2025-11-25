<script lang="ts" setup>
import type { MenuItem } from '@/server/types/common/menu-item';

const props = defineProps<{
  menu: MenuItem[];
  heading?: string;
}>();
</script>
<template>
  <Text v-if="props.heading" :text="props.heading" class="mb-sm" color="black" weight="semibold" size="normal" />
  <Card class="rd-xl shadow-1">
    <template v-for="(item, index) in props.menu" :key="index">
      <MenuAccountItemTemplate1 v-if="item.path" :item="item" tag="RouterLink" :class="{ 'mb-ms': index !== props.menu.length - 1 }" :is-last="index === props.menu.length - 1"/>
      <MenuAccountItemTemplate1 v-else :item="item" tag="div" :is-last="index === props.menu.length - 1"/>
    </template>
  </Card>
</template>