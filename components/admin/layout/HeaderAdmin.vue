
<script lang="ts" setup>
import '@/styles/organisms/layout/header-admin.scss'
import { IMAGE_AVATAR_DEFAULT } from '@/const/image';
import { ROUTES } from '@/shared/constants/routes';
import { useAdminAuthStore } from '@/stores/admin/admin-auth/useAdminAuthStore';
import type { MenuItem } from 'server/types/common/menu-item';

const storeAdminAuth = useAdminAuthStore()
const listMenu = ROUTES.ADMIN;
const props = defineProps({
  headerClass: {
    type: String,
  },
  label: {
    type: String,
  },
})

</script>

<template>
  <div :class="['header-admin', headerClass]">
    <div class="header-admin-left">
      <Heading v-if="props.label" class="line-height1" tag="h2" weight="semibold" size="xl">{{props.label}}</Heading>
      <slot name="left"></slot>
    </div>
    <div class="header-admin-right">
      <slot name="right"></slot>
      <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <div class="header-admin-right-avatar" v-bind="props">
            <img :src="storeAdminAuth.getDetailAccount?.avatar || IMAGE_AVATAR_DEFAULT" width="44" alt="avatar" />
          </div>
        </template>
        <template v-if="listMenu">
          <v-list class="mt-sm">
            <v-list-item 
              v-for="(item, index) in Object.values(listMenu).filter((item: MenuItem) => item.isShowMenuAccount)"
              :key="index"
              :value="item.path"
              class="header-admin-right-list">
              <v-list-item-title>
                <router-link :to="{ path: item.path }" class="flex align-center gap-sm weight-medium">
                  <MaterialIcon v-if="item.icon" :name="item.icon" />
                  {{ item.label }}
                </router-link>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="bg-gray2">
              <v-list-item-title >
                <div class="flex align-center gap-sm weight-medium cursor-pointer" @click="storeAdminAuth.handleLogout()">
                  <MaterialIcon name="logout" />
                  Dang xuat
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </template>
      </v-menu>
    </div>
  </div>
</template>
