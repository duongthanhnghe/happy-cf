<script lang="ts" setup>
import type { MenuItem } from 'server/types/common/menu-item';

defineProps<{
  listMenu: MenuItem[],
  listMenuLeft: MenuItem[]
}>()

</script>

<template>
  <div class="bg-white shadow-2">
    <div class="container container-xxl">
      <div class="flex justify-between align-center">
        <!-- LEFT MENU -->
        <div class="flex gap-ms align-center height-40 overflow-hidden">
          <template v-for="(item, index) in listMenuLeft" :key="index">
            <component
              :is="item.path ? 'router-link' : 'div'"
              :to="item.path ? { path: item.path } : undefined"
              class="flex gap-xs align-center cursor-pointer min-height-40"
              @click="!item.path && item.action?.()"
            >
              <MaterialIcon v-if="index===0" :name="item.icon" size="normal" class="text-color-gray5" />
              <Text limit="1" :text="item.label" class="hover-color-primary" />
            </component>
          </template>
          <VoucherFeatureSwiper position="header-sub" />
        </div>

        <!-- RIGHT MENU -->
        <div class="flex gap-ms align-center">
          <template v-for="(item, index) in listMenu" :key="index">
            <component
              :is="item.path ? 'router-link' : 'div'"
              :to="item.path ? { path: item.path } : undefined"
              class="flex gap-xs align-center cursor-pointer min-height-40"
              @click="!item.path && item.action?.()"
            >
              <MaterialIcon :name="item.icon" size="normal" class="text-color-gray5" />
              <Text limit="1" :text="item.label" class="hover-color-primary" />
            </component>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
