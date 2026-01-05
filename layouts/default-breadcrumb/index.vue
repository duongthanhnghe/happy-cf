<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/client/layout/useUserLayoutStore'
import type { HeaderTypeLeft } from '@/stores/client/layout/useUserLayoutStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeLayout = useLayoutStore()
const storeDisplay = useDisplayStore()
const route = useRoute()

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
    <div class="container container-xxl">
      <BreadcrumbDefault />
    </div>
    <slot />
    <Footer />
    <MenuBottom v-if="storeDisplay.isMobileTable" />
  </div>
</template>
