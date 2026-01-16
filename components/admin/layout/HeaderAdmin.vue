
<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useAccountAdminStore } from '@/stores/admin/account/useAccountAdminStore';
import type { MenuItem } from 'server/types/common/menu-item';
import { computed, useSlots } from 'vue';
import { useSidebarStore } from '@/stores/admin/layout/useSidebarStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeSidebar = useSidebarStore()
const storeAccount = useAccountAdminStore()
const storeDisplay = useDisplayStore()

const props = defineProps({
  headerRightClass: {
    type: String,
  },
  headerLeftClass: {
    type: String,
  },
  label: {
    type: String,
  },
})

const slots = useSlots();
const listMenu = ROUTES.ADMIN

const detailAccount = computed(() => storeAccount.getDetailAccount);
const slotLeft = computed(() => !!slots.left);

</script>

<template>
  <client-only>
    <div :class="[slotLeft && !storeDisplay.isLaptop ? 'height-header-admin-filter':'height-header-admin']">
      <div 
        class="transition-0d3 position-fixed top-0 right-0 width-full z-index-11" 
        :class="[storeDisplay.isLaptop ? [(storeSidebar.getToggleSidebar ? 'pl-taskbar':'pl-taskbar-hide'),'bg-gray2'] : 'bg-white', slotLeft && !storeDisplay.isLaptop ? 'height-header-admin-filter':'height-header-admin']">
        <div 
          class="flex justify-between align-center width-full"
          :class="storeDisplay.isLaptop ? 'height-full gap-md pl-md pr-md':'pt-ms gap-sm pl-sm pr-sm'"
        >
          <Button v-if="!storeDisplay.isLaptop" color="secondary" icon="dock_to_right" @click="storeSidebar.handleToggleSidebar()"/>
          <div 
            :class="['min-width-200-input max-width-200-input flex flex-1 align-center gap-xs',
            !storeDisplay.isLaptop && slotLeft ? 'bottom-0 left-0 width-full position-absolute bg-gray6 pd-sm overflow-auto-x scroll-hide border-top-default':'',
            headerLeftClass
          ]">
            <Text v-if="props.label && storeDisplay.isLaptop" tag="h2" size="xl" weight="semibold" class="line-height-1" :text="props.label" />
            <slot name="left"></slot>
          </div>
          <div :class="['flex align-center justify-end gap-sm', headerRightClass]">
            <slot name="right"></slot>
            <v-menu transition="slide-x-transition">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <Image 
                    v-if="detailAccount?.avatar" :src="detailAccount?.avatar"
                    alt="avatar"
                    :width="44"
                    :height="44"
                    preset="avatar"
                    class="rd-full bg-gray6"
                  />
                </div>
              </template>
              <template v-if="listMenu">
                <v-list class="mt-sm">
                  <v-list-item 
                    v-for="(item, index) in Object.values(listMenu).filter((item: MenuItem) => item.isShowMenuAccount && detailAccount && item.roles?.includes(detailAccount.role))" 
                    :key="index"
                    :value="item.path"
                    class="min-width-200">
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
                        Đăng xuất
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </template>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>