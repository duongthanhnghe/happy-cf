<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/client/layout/useUserLayoutStore'
import type { HeaderTypeLeft } from '@/stores/client/layout/useUserLayoutStore'

const storeLayout = useLayoutStore()
const route = useRoute()

watch(() => route.meta, (meta) => {
  if (meta?.headerTypeLeft) {
    storeLayout.setHeaderTypeLeft(meta.headerTypeLeft as HeaderTypeLeft)
  }
}, { immediate: true })
</script>

<template>
  <Header :type-left="storeLayout.headerTypeLeft"/>
  <slot />
</template>
