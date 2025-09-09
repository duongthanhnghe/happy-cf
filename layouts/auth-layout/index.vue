<script lang="ts" setup>
import './index.scss'
import { IMAGE_AUTH_LOGIN } from '@/const/image'
import { useSettingStore } from '@/stores/setting/useSettingStore';
import { ROUTES } from '@/shared/constants/routes';

const storeSetting = useSettingStore();

</script>

<template>
  <NuxtLink :to="{ path: ROUTES.PUBLIC.HOME.path }" class="auth-logo">
    <img v-if="storeSetting.getSettings?.logoUrl" :src="storeSetting.getSettings?.logoUrl" class="auth-logo isLaptop" alt="Logo" />
    <Button icon="arrow_back_ios_new" color="secondary" class="isMobileTable"/>
  </NuxtLink>
  <div class="auth-wrapper">
    <div class="auth-right">
      <img :src="IMAGE_AUTH_LOGIN" alt="Login">
    </div>
    <div class="auth-left">
      <slot />
    </div>
  </div>
</template>
