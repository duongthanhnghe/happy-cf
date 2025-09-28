<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs } from '@/utils/breadcrumb'
import MaterialIcon from './MaterialIcon.vue'

const route = useRoute()
const breadcrumbs = computed(() => getBreadcrumbs(route.path))
</script>

<template>
  <v-breadcrumbs class="pl-0 pr-0">
    <v-breadcrumbs-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :href="item.path"
    >
      
      <template v-if="index === breadcrumbs.length - 1">
        <h1>{{ item.label }}</h1>
        <MaterialIcon name="keyboard_arrow_right"/>
      </template>
      <template v-else>
        {{ item.label }}
      <MaterialIcon name="keyboard_arrow_right"/>
      </template>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<style lang="scss">
  @use "@/assets/variables" as *;

  .v-breadcrumbs-item {
    padding: 0;
    .icon {
      color: $cl-gray5;
      margin: 0 4px;
    }
    &--link {
      color: $cl-gray5;
      display: flex;
      align-items: center;
      h1 {
        font-size: $fz-base;
        font-weight: 400;
      }
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
  }
</style>