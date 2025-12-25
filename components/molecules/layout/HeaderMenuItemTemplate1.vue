<script setup lang="ts">
import { ref } from 'vue';
import type { MenuItem } from '@/server/types/common/menu-item';

const props = defineProps<{
  item: MenuItem;
}>();

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="flex gap-sm justify-between mb-ms">
    <NuxtLink :to="item.path">
      <Text
        :text="item.label"
        color="black"
        weight="semibold"
        class="text-uppercase"
      />
    </NuxtLink>
    <MaterialIcon v-if="props.item.children?.length" @click.prevent="toggle" name="chevron_right" weight="light" size="lg-2" :class="[{'rotate-90': isOpen},'text-color-gray5 transition-0d3']"/>
  </div>
  <div v-show="props.item.children?.length && isOpen" class="pl-ms mt-ms">
    <NuxtLink :to="child.path" v-for="(child, idx) in item.children" :key="idx">
      <Text
        :text="child.label"
        color="gray5"
        class="mb-ms"
      />
    </NuxtLink>
  </div>
</template>