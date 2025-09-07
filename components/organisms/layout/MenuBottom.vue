<script lang="ts" setup>
import '@/styles/molecules/layout/menu-bottom.scss';
import { useRoute } from 'vue-router'
import {
  useOrderHistoryStore
} from '@/stores/order/useOrderHistoryStore'
import PopupOrderHistory from '@/components/templates/user/PopupOrderHistory.vue';

const route = useRoute()
const storeOrder = useOrderHistoryStore()

const listMenu = [
  { name: 'index', label: 'Trang chủ', icon:'home', action: () => {} },
  { name: 'order', label: 'Dat hang', icon:'inventory_2', action: () => {} },
  { name: '', label: 'Don hang', icon:'category', action: () => storeOrder.handleTogglePopupAdd(true) },
  { name: 'my-account', label: 'Tai khoan', icon:'assignment', action: () => {} },
]

</script>

<template>
  <div class="menu-bottom">
    <div class="menu-bottom-content">
      <template v-for="(item,index) in listMenu" :key="index">
        <router-link
          v-if="item.name"
          :to="{ name: item.name }"
          :class="['menu-bottom-item', { active: route.name === item.name }]"
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