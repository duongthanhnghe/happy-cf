<script lang="ts" setup>
import '@/styles/admin/layout/sidebar.scss';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import { useAccountAdminStore } from '@/stores/admin/account/useAccountAdminStore';
import type { MenuItem } from 'server/types/common/menu-item';
import { useSidebarStore } from '@/stores/admin/layout/useSidebarStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeAccount = useAccountAdminStore()
const storeSidebar = useSidebarStore()
const storeDisplay = useDisplayStore()

const route = useRoute()
const listMenu = ROUTES.ADMIN;
const toggleActive = ref<Record<string, boolean>>({})

const handleToggleDropdown = (index: string) => {
  toggleActive.value[index] = !toggleActive.value[index];
};

const isChildActive = (children: Record<string, MenuItem>) => {
  return Object.values(children).some((child) => route.fullPath === child.path);
};

const isShowSidebarContent = computed(() => {
  if (storeDisplay.isLaptop) {
    return storeSidebar.getToggleSidebar
  }
  
  return true
})

</script>

<template>
  <div 
    v-show="!storeSidebar.getToggleSidebar && !storeDisplay.isLaptop" 
    @click="storeSidebar.handleToggleSidebar()" 
    class="position-fixed left-0 top-0 height-full width-full bg-black-20 z-index-12">
  </div>
  <div 
    v-if="storeAccount.getDetailAccount"
    :class="[
      isShowSidebarContent ? 'width-taskbar':'width-taskbar-hide', 
      storeDisplay.isLaptop ? 'transform-translate-x-0': {'transform-translate-x-hide': storeSidebar.getToggleSidebar}
    ]" 
    class="taskbar scroll-hide position-fixed height-dvh left-0 top-0 pd-sm border-right-default z-index-12 bg-white transition-0d3">
    <div class="taskbar-content">
      <div class="flex justify-between align-center pd-xs sticky bg-white z-index-2">
        <AdminLogo maxHeight="xl" link v-show="isShowSidebarContent" />
        <Button color="secondary" :border="false" icon="dock_to_left" size="sm" @click="storeSidebar.handleToggleSidebar()"/>
      </div>

      <template v-if="listMenu">
        <!-- home -->
        <NuxtLink
          :to="{ path: ROUTES.PUBLIC.HOME.path }"
          class="taskbar-href flex min-height-xl"
          v-tooltip.right="!isShowSidebarContent && ROUTES.PUBLIC.HOME.label"
          @click="!storeDisplay.isLaptop && storeSidebar.handleToggleSidebar()"
        >
          <Button
            :icon="ROUTES.PUBLIC.HOME.icon"
            class="taskbar-icon"
            :border="false"
            color="secondary"
            size="sm"
            :class="{ active: route.fullPath === ROUTES.PUBLIC.HOME.path }"
          />
          <Button
            v-show="isShowSidebarContent"
            color="secondary"
            class="taskbar-text"
            :label="ROUTES.PUBLIC.HOME.label"
            :border="false"
          />
        </NuxtLink>

        <!-- list menu -->
        <template v-for="(item, index) in listMenu" :key="index">
          <template v-if="item.isShowSidebar && item.roles?.includes(storeAccount.getDetailAccount?.role)">
            <NuxtLink
              :to="{ path: item.path }"
              class="taskbar-href flex min-height-xl"
              v-if="!item.children"
              v-tooltip.right="!isShowSidebarContent && item.label"
              @click="!storeDisplay.isLaptop && storeSidebar.handleToggleSidebar()"
            >
              <Button
                :icon="item.icon"
                class="taskbar-icon"
                :border="false"
                color="secondary"
                size="sm"
                :class="{ active: route.fullPath === item.path }"
              />
              <Button
                v-show="isShowSidebarContent"
                color="secondary"
                class="taskbar-text"
                :label="item.label"
                :border="false"
                :class="{ active: route.fullPath === item.path }"
              />
            </NuxtLink>

            <!-- list menu children -->
            <div v-else :class="`taskbar-dropdown dropdown-${index}`" :key="`dropdown-${index}`">
              <template v-if="item.isShowSidebar && item.roles?.includes(storeAccount.getDetailAccount?.role)">
                <div class="taskbar-href flex min-height-xl" @click="handleToggleDropdown(index)" v-tooltip.right="!isShowSidebarContent && item.label">
                  <Button
                    :icon="item.icon"
                    class="taskbar-icon"
                    :border="false"
                    color="secondary"
                    size="sm"
                  />
                  <Button
                    v-show="isShowSidebarContent"
                    color="secondary"
                    class="taskbar-text"
                    :label="item.label"
                    :border="false"
                  >
                    <MaterialIcon name="keyboard_arrow_down" :class="`taskbar-dropdown-icon ${toggleActive[index] || isChildActive(item.children) ? 'active':''}`" />
                  </Button>
                </div>
              </template>
              <!-- children -->
              <div :class="`taskbar-dropdown-content ${toggleActive[index] || isChildActive(item.children) ? 'active':''}`">
                <template v-for="(child, cIndex) in item.children" :key="`child-${cIndex}`">
                  <template v-if="child.isShowSidebar && child.roles?.includes(storeAccount.getDetailAccount?.role)">
                    <NuxtLink
                      :to="{ path: child.path }"
                      class="taskbar-href flex taskbar-dropdown-href"
                      v-tooltip.right="!isShowSidebarContent && child.label"
                      @click="!storeDisplay.isLaptop && storeSidebar.handleToggleSidebar()"
                    >
                      <Button
                        color="secondary"
                        class="taskbar-text"
                        :label="child.label"
                        :border="false"
                        :class="{ active: route.fullPath === child.path }"
                      />
                    </NuxtLink>
                  </template>
                </template>
              </div>
            </div>

          </template>
        </template>
       
      </template>
      
    </div>
  </div>
</template>