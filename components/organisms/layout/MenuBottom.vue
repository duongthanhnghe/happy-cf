<script lang="ts" setup>
import '@/styles/molecules/layout/menu-bottom.scss';
import { useRoute } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import type { MenuItem } from 'server/types/common/menu-item';

const route = useRoute()

const listMenu: MenuItem[] = [
  ROUTES.PUBLIC.HOME,
  ROUTES.PUBLIC.ORDER,
  ROUTES.PUBLIC.ACCOUNT.children!.ORDERS,
  ROUTES.PUBLIC.ACCOUNT.children!.WALLET_VOUCHER,
  ROUTES.PUBLIC.MENU_ACCOUNT,
]

</script>

<template>
  <div class="menu-bottom">
    <div class="menu-bottom-content">
      <template v-for="(item,index) in listMenu" :key="index">
        <router-link
          v-if="item.path"
          :to="{ path: item.path }"
          :class="['menu-bottom-item', { active: route.path === item.path }]"
        >
          <MaterialIcon :name="item.icon" class="menu-bottom-icon"/>
          <div class="text-limit text-size-xs menu-bottom-title">
            {{ item.label.replace('Lịch sử đơn hàng','Đơn hàng') }}
          </div>
        </router-link>
        <div
          v-else
          class="menu-bottom-item"
          @click="item.action"
        >
          <MaterialIcon :name="item.icon" class="menu-bottom-icon"/>
          <div class="text-limit text-size-xs menu-bottom-title">
            {{ item.label }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>