<script lang="ts" setup>
import '@/styles/organisms/layout/sidebar.scss';
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import type { MenuItem } from 'server/types/common/menu-item';

const route = useRoute()
const listMenu = ROUTES.ADMIN;
const toggleActive = ref<Record<string, boolean>>({})

const handleToggleDropdown = (index: string) => {
  toggleActive.value[index] = !toggleActive.value[index];
};

const isChildActive = (children: Record<string, MenuItem>) => {
  return Object.values(children).some((child) => route.fullPath === child.path);
};
</script>

<template>
  <div class="taskbar scroll-hide">
    <div class="taskbar-content">

      <template v-if="listMenu">
        <!-- home -->
        <NuxtLink
          :to="{ path: ROUTES.PUBLIC.HOME.path }"
          class="taskbar-href flex"
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
            color="secondary"
            class="taskbar-text"
            :label="ROUTES.PUBLIC.HOME.label"
            :border="false"
          />
        </NuxtLink>

        <template v-for="(item, index) in listMenu" :key="index">
          <NuxtLink
            :to="{ path: item.path }"
            class="taskbar-href flex"
            v-if="!item.children"
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
              color="secondary"
              class="taskbar-text"
              :label="item.label"
              :border="false"
              :class="{ active: route.fullPath === item.path }"
            />
          </NuxtLink>

          <!-- children -->
          <div v-else :class="`taskbar-dropdown dropdown-${index}`" :key="`dropdown-${index}`">
            <div class="taskbar-href flex" @click="handleToggleDropdown(index)">
              <Button
                :icon="item.icon"
                class="taskbar-icon"
                :border="false"
                color="secondary"
                size="sm"
              />
              <Button
                color="secondary"
                class="taskbar-text"
                :label="item.label"
                :border="false"
              >
                <MaterialIcon name="keyboard_arrow_down" :class="`taskbar-dropdown-icon ${toggleActive[index] || isChildActive(item.children) ? 'active':''}`" />
              </Button>
            </div>
            <div :class="`taskbar-dropdown-content ${toggleActive[index] || isChildActive(item.children) ? 'active':''}`">
              <template v-for="(child, cIndex) in item.children" :key="`child-${cIndex}`">
                <NuxtLink
                  :to="{ path: child.path }"
                  class="taskbar-href flex taskbar-dropdown-href"
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
            </div>
          </div>
        </template>
       
      </template>
    </div>
  </div>
</template>