<script lang="ts" setup>
import { useFirstLoaderStore } from '@/stores/shared/useFirstLoaderStore'
const storeFirstLoader = useFirstLoaderStore()
</script>
<template>
  <FirstLoader :class="{ active: storeFirstLoader.loaderActive }" />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>