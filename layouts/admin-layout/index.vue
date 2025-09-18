<script lang="ts" setup>
import './index.scss'
</script>
<template>
  <div class="admin-wrapper">
    <Sidebar />
    <div class="main-admin">
      <slot />
    </div>
  </div>
</template>