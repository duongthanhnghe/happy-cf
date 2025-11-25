<script setup lang="ts">
import { computed } from 'vue';
import type { MenuItem } from '@/server/types/common/menu-item';
import { useRoute } from 'vue-router';

const props = defineProps<{
  item: MenuItem;
  tag: string;
  isLast?: boolean;
}>();

const route = useRoute();

const isLink = computed(() =>
  props.tag === 'NuxtLink' || props.tag === 'RouterLink'
);

const bindProps = computed(() =>
  isLink.value ? { to: props.item.path } : {}
);
</script>


<template>
  <component
    :is="tag"
    v-bind="bindProps"
    @click="!isLink ? item.action?.() : null"
    :class="[
      'flex gap-sm cursor-pointer',
      { 'text-color-primary': route.path === item.path }
    ]"
  >
    <MaterialIcon :name="item.icon" weight="light" size="lg-2" />
    <div :class="['flex flex-1 justify-between align-center',{ 'border-bottom-default pb-ms': !props.isLast }]">
      <span>{{ item.label }}</span>
      <MaterialIcon name="chevron_right" weight="light" size="lg-2" class="text-color-gray5"/>
    </div>
  </component>
</template>