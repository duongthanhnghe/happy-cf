<script lang="ts" setup>
import './index.scss'
import { IMAGE_AUTH_LOGIN } from '@/const/image'
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';
import { ROUTES } from '@/shared/constants/routes';

const storeSetting = useBaseInformationStore();

</script>

<template>
  <NuxtLink :to="{ path: ROUTES.PUBLIC.HOME.path }" class="auth-logo">
    <img v-if="storeSetting.getBaseInformation?.logoUrl" :src="storeSetting.getBaseInformation?.logoUrl" class="auth-logo isLaptop" alt="Logo" />
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
