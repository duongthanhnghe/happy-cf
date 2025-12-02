<script lang="ts" setup>
import './index.scss'
</script>
<template>
  <div class="admin-wrapper">
    <client-only>
      <Sidebar />
    </client-only>
    <div class="main-admin">
      <slot />
    </div>
  </div>
</template>