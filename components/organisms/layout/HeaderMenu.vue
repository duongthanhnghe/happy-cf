<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import type { MenuItem } from '@/server/types/common/menu-item'; 

const props = defineProps<{
  listMenu: MenuItem[]
  menuLevel: number
}>()

const route = useRoute()
const storeDisplay = useDisplayStore()
</script>

<template>
  <div v-if="storeDisplay.isLaptop && props.listMenu" class="header-center flex gap-xs" >
    <div
      v-for="(item, index) in props.listMenu"
      :key="index"
      :class="[
        { 'position-relative': props.menuLevel !== 3 },
        'hover-visible-overlay'
      ]"
    >
      <!-- MENU cha -->
      <NuxtLink
        v-if="!item || item?.path !== null || item?.path !== undefined"
        :to="{ path: item.path }"
        :class="[
          'header-menu-href flex align-center',
          { active: route.path === item.path }
        ]"
      >
        <Button color="transparent" :label="item.label" />
      </NuxtLink>

      <!-- MENU 2 CẤP -->
      <HeaderMenuLevel2 v-if="menuLevel === 2" :item="item" />

      <!-- MENU 3 CẤP -->
      <HeaderMenuLevel3 v-else-if="menuLevel === 3" :item="item" />

    </div>
  </div>
</template>
