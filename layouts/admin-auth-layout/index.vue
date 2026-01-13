<script lang="ts" setup>
import './index.scss'
import { IMAGE_AUTH_LOGIN } from '@/const/image'
import { ROUTES } from '@/shared/constants/routes';
</script>

<template>
  <NuxtLink :to="{ path: ROUTES.PUBLIC.HOME.path }" class="auth-logo">
    <Logo class="auth-logo isLaptop" link />
    <Button icon="arrow_back_ios_new" color="secondary" class="isMobileTable"/>
  </NuxtLink>
  <div class="auth-wrapper">
    <div class="auth-right">
      <Image 
        :src="IMAGE_AUTH_LOGIN"
        alt="Login"
        :width="1000"
      />
    </div>
    <div class="auth-left">
      <slot />
    </div>
  </div>
</template>
