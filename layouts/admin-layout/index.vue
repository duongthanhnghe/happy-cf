<script lang="ts" setup>
  import './index.scss'
import { useSidebarStore } from '@/stores/admin/layout/useSidebarStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeSidebar = useSidebarStore()
const storeDisplay = useDisplayStore()

</script>
<template>
  <div class="admin-wrapper">
    <client-only>
      <Sidebar />
    </client-only>
    <div class="main-admin transition-0d3" :class="storeDisplay.isLaptop ? storeSidebar.getToggleSidebar ? 'pl-taskbar':'pl-taskbar-hide' : ''">
      <slot />
    </div>
  </div>
</template>