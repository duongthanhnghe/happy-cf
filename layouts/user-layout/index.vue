<script lang="ts" setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { ROUTES } from '@/shared/constants/routes'
import { useAccountStore } from '@/stores/client/users/useAccountStore'

const store = useAccountStore();
const storeDisplay = useDisplayStore()
const listMenu = [
  ...store.accountMenu,
  { label: 'Đăng xuất', action: () => store.handleLogout(), icon: 'logout' }
];
</script>

<template>
  <div :class="['min-height-dvh pb-section',storeDisplay.isLaptop ? 'bg-gray2':'bg-gray6']">
    <Header />
    <template v-if="storeDisplay.isLaptop">
      <SectionAccount showLevel />
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-3">
            <div class="sticky sticky-cover-header pt-ms">
              <MenuAccount :menu="listMenu" />
            </div>
          </div>
          <client-only>
            <div class="col-12 col-lg-9 pt-ms">
              <slot />
            </div>
          </client-only>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="container">
        <NuxtLink :to="{ path: ROUTES.PUBLIC.MENU_ACCOUNT.path }" >
          <Button :border="false" color="secondary" icon="west" size="lg" class="w-full bg-transparent justify-start" />
        </NuxtLink>
        <slot></slot>
      </div>
    </template>
    <MenuBottom v-if="storeDisplay.isMobileTable" />
  </div>
</template>
