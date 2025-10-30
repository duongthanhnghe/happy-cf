<script lang="ts" setup>
// import './index.scss';
import { useRoute } from 'vue-router'
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes';
import type { MenuItem } from 'server/types/common/menu-item';

const store = useAccountStore();
const route = useRoute()
const accountChildren = ROUTES.PUBLIC.ACCOUNT.children!;

const accountMenu: MenuItem[] = Object.values(accountChildren).map((route) => ({
  path: route.path,
  label: route.label,
  icon: route.icon,
}));

const listMenu = [
  ...accountMenu,
  { label: 'Dang xuat', icon:'logout', action: () => store.handleLogout() },
];

const cardItemClass= 'card card-sm bg-white';

</script>
<template>
  <div class="account-container">
    <Heading class="mb-sm" tag="div" color="primary" weight="semibold" size="md">Thông tin tài khoản</Heading>
    <div :class="`${cardItemClass}`">
      <template v-for="(item, index) in listMenu" :key="index">
        <router-link
          v-if="item.path"
          :to="{ path: item.path }"
          :class="['account-link-item flex gap-sm cursor-pointer mb-ms', { active: route.path === item.path }]"
        >
        <MaterialIcon :name="item.icon" weight="300" size="24" />
        <div class="account-link-text flex flex-1 justify-between align-center pb-ms">
          <span>{{ item.label }}</span>
          <MaterialIcon name="chevron_right" weight="300" size="20" class="text-color-gray5"/>
        </div>
        </router-link>
        <div
          v-else
          class="account-link-item flex gap-sm cursor-pointer mb-ms"
          @click="item.action"
        >
          <MaterialIcon :name="item.icon" weight="300" size="24" />
          <div class="account-link-text flex flex-1 justify-between align-center pb-ms">
            <span>{{ item.label }}</span>
            <MaterialIcon name="chevron_right" weight="300" size="20" class="text-color-gray5"/>
        </div>
        </div>
      </template>
    </div>
  </div>
</template>