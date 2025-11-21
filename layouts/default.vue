<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/client/layout/useUserLayoutStore'
import type { HeaderTypeLeft } from '@/stores/client/layout/useUserLayoutStore'

const storeLayout = useLayoutStore()
const route = useRoute()

// watch(() => route.meta, (meta) => {
//   console.log(meta)
//   if (meta?.headerTypeLeft) {
//     storeLayout.setHeaderTypeLeft(meta.headerTypeLeft as HeaderTypeLeft)
//   }
// }, { immediate: true })

watch(() => route.fullPath, () => {
  const meta = route.meta

  storeLayout.setHeaderTypeLeft('logo')

  if (meta?.headerTypeLeft) {
    storeLayout.setHeaderTypeLeft(meta.headerTypeLeft as HeaderTypeLeft)
  }
}, { immediate: true })

</script>

<template>
  <div>
    <Header :typeLeft="storeLayout.headerTypeLeft"/>
    <slot />
    <MenuBottom />
  </div>
</template>
