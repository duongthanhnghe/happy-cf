<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs } from '@/utils/breadcrumb'

const props = defineProps<{
  customLabel?: string
}>()

const route = useRoute()
const breadcrumbs = computed(() => getBreadcrumbs(route.path, props.customLabel))
</script>

<template>
  <v-breadcrumbs class="pl-0 pr-0">
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <v-breadcrumbs-item>
        <router-link 
          v-if="index < breadcrumbs.length - 1 && item.path"
          :to="item.path"
        >
          {{ item.label }}
        </router-link>
        
        <h1 v-else>
          {{ item.label }}
        </h1>
      </v-breadcrumbs-item>
      
      <v-breadcrumbs-divider v-if="index < breadcrumbs.length - 1">
        <MaterialIcon name="keyboard_arrow_right"/>
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