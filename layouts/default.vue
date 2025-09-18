<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout/useUserLayoutStore'
import type { HeaderTypeLeft } from '@/stores/layout/useUserLayoutStore'

const storeLayout = useLayoutStore()
const route = useRoute()

watch(() => route.meta, (meta) => {
  if (meta?.headerTypeLeft) {
    storeLayout.setHeaderTypeLeft(meta.headerTypeLeft as HeaderTypeLeft)
  }
}, { immediate: true })
</script>

<template>
  <div>
    <Header :type-left="storeLayout.headerTypeLeft"/>
    <slot />
    <MenuBottom />
  </div>
</template>
