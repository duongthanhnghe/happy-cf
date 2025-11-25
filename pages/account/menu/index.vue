<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.MENU_ACCOUNT.middleware,
})
const storeDisplay = useDisplayStore()
const store = useAccountStore();
const listMenu = [
  ...store.accountMenu,
];
</script>
<template>
  <div :class="['min-height-dvh',storeDisplay.isLaptop ? 'bg-gray2':'bg-gray6']">
    <SectionAccount :showBarcode="false"/>
    <div class="container">
      <div class="pt-ms">
        <MenuAccount :menu="listMenu" heading="Tài khoản"/>
        <div class="flex justify-center">
          <Button @click.prevent="store.handleLogout()" color="danger" class="bg-gray6 mt-sm" icon="logout" label="Dang xuat" />
        </div>
      </div>
    </div>
  </div>
</template>