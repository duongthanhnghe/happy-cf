
<script lang="ts" setup>
import '@/styles/organisms/layout/header-admin.scss'
import { ROUTES } from '@/shared/constants/routes';
import { useAccountStore } from '@/stores/admin/account/useAccountStore';
import type { MenuItem } from 'server/types/common/menu-item';
import { computed } from 'vue';

const storeAccount = useAccountStore()
const props = defineProps({
  headerClass: {
    type: String,
  },
  label: {
    type: String,
  },
})
const listMenu = ROUTES.ADMIN
const detailAccount = computed(() => storeAccount.getDetailAccount);

</script>

<template>
  <client-only>
  <div :class="['header-admin', headerClass]">
    <div class="header-admin-left">
      <Text v-if="props.label" tag="h2" size="xl" weight="semibold" class="line-height-1" :text="props.label" />

      <slot name="left"></slot>
    </div>
    <div class="header-admin-right">
      <slot name="right"></slot>
      <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <div class="header-admin-right-avatar" v-bind="props">
            <img v-if="detailAccount?.avatar" :src="detailAccount?.avatar" width="44" alt="avatar" />
          </div>
        </template>
        <template v-if="listMenu">
          <v-list class="mt-sm">
            <v-list-item 
              v-for="(item, index) in Object.values(listMenu).filter((item: MenuItem) => item.isShowMenuAccount && item.roles?.includes(detailAccount.role))" 
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
                <div class="flex align-center gap-sm weight-medium cursor-pointer" @click="storeAccount.handleLogout()">
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
  </client-only>
</template>