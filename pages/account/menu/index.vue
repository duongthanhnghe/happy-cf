<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  // layout: ROUTES.PUBLIC.MENU_ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.MENU_ACCOUNT.middleware,
})


</script>
<template>
  <div class="account-bg bg-gray2">
    <SectionAccount :showBarcode="false"/>
    <div class="container">
      <MenuAccount />
    </div>
  </div>
</template>