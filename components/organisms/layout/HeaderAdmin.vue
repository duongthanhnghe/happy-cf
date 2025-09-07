<template>
<div :class="[
        'header-admin',
        headerClass
      ]">
  <div class="header-admin-left">
    <slot name="left"></slot>
  </div>
  <div class="header-admin-right">
    <slot name="right"></slot>

    <v-menu transition="slide-x-transition">
      <template v-slot:activator="{ props }">
        <div class="header-admin-right-avatar" v-bind="props">
          <img :src="IMAGE_AVATAR_DEFAULT" width="44" alt="avatar" />
        </div>
      </template>

      <v-list>
        <v-list-item v-for="item in menuList" :key="item.name" :value="item.name" class="header-admin-right-list">
          <v-list-item-title>
            <router-link v-if="!item.action" :to="{ name: item.name }" class="flex align-center gap-sm weight-medium">
              <MaterialIcon v-if="item.icon" :size="24" :name="item.icon" />
              {{ item.label }}
            </router-link>
            <div v-else @click="item.action" class="flex align-center gap-sm weight-medium">
            <MaterialIcon v-if="item.icon" :size="24" :name="item.icon" />
              {{ item.label }}
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  useUserAuthStore
} from '@/stores/users/useUserAuthStore'
import '@/styles/organisms/layout/header-admin.scss'
import { IMAGE_AVATAR_DEFAULT } from '@/const/image';

const storeUser = useUserAuthStore();

const props = defineProps({
  headerHeading: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
})

const menuList = [{
    name: 'index',
    label: 'Trang chủ',
    icon: 'home'
  },
  {
    name: 'order',
    label: 'Đặt hàng',
    icon: 'shopping_cart'
  },
  {
    name: 'my-account',
    label: 'Tai khoan',
    icon: 'person'
  },
  {
    name: 'my-account',
    label: 'Dang xuat',
    icon: 'logout',
    action: storeUser.handleLogout 
  },
]

const emit = defineEmits(['update:modelValue'])

</script>
