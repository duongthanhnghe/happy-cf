<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs } from '@/utils/breadcrumb'
import type { MenuItem } from '@/server/types/common/menu-item';
import { useSeoTitle } from '@/composables/seo/useSEO';

const props = defineProps<{
  items?: MenuItem[]
}>()

const route = useRoute()

const seoTitle = useSeoTitle()

const breadcrumbs = computed<(MenuItem & { isCurrent: boolean })[]>(() => {
  const raw =
    props.items && props.items.length > 0
      ? props.items.filter(item => item.label)
      : getBreadcrumbs(route.path)

  const mapped = raw.map((item, i) => ({
    ...item,
    isCurrent: i === raw.length - 1,
  }))

  if (mapped.length > 0 && seoTitle.value) {
    mapped[mapped.length - 1] = {
      ...mapped[mapped.length - 1],
      label: seoTitle.value
    }
  }

  return mapped
})

</script>

<template>
  <v-breadcrumbs class="pl-0 pr-0 overflow-x-auto white-space scroll-hide">
    <template v-for="item in breadcrumbs" :key="item.path || item.label">
      <v-breadcrumbs-item>
        <router-link
          v-if="!item.isCurrent && item.path"
          :to="item.path"
        >
          {{ item.label }}
        </router-link>

        <h1 v-else>
          {{ item.label }}
        </h1>
      </v-breadcrumbs-item>

      <v-breadcrumbs-divider v-if="!item.isCurrent">
        <MaterialIcon name="keyboard_arrow_right" />
      </v-breadcrumbs-divider>
    </template>
  </v-breadcrumbs>
</template>

<style lang="scss">
  @use "@/assets/variables" as *;

  .v-breadcrumbs-item {
    padding: 0;
    &--link {
      color: $cl-gray5;
      display: flex;
      align-items: center;
    }
    &:last-child {
      .icon {
        display: none;
      }
      .v-breadcrumbs-item {
        &--link {
          color: $cl-text;
        }
      }
    }
    h1 {
      font-size: $fz-base;
      font-weight: 400;
    }
  }
  .v-breadcrumbs-divider {
    display: flex;
    padding: 0 4px;
    .icon {
      color: $cl-gray5;
    }
  }
</style>