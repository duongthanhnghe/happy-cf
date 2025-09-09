<script lang="ts" setup>
import '@/styles/molecules/layout/menu-bottom.scss';
import { useRoute } from 'vue-router'
import {
  useOrderHistoryStore
} from '@/stores/order/useOrderHistoryStore'
import { ROUTES } from '@/shared/constants/routes';
import type { MenuItem } from 'server/types/common/menu-item';

const route = useRoute()
const storeOrder = useOrderHistoryStore()

const listMenu: MenuItem[] = [
  ROUTES.PUBLIC.HOME,
  ROUTES.PUBLIC.ORDER,
  { label: 'Don hang', icon:'category', action: () => storeOrder.handleTogglePopupAdd(true) },
  ROUTES.PUBLIC.MY_ACCOUNT,
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
            {{ item.label }}
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
  
  <PopupOrderHistory />
</template>