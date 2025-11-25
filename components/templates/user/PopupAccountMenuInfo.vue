<script lang="ts" setup>
import { useAccountStore } from '@/stores/client/users/useAccountStore'

const storeAccount = useAccountStore();

</script>
<template>
  <Popup
    v-model="storeAccount.isTogglePopupAccountMenuInfo"
    :popupHeading="`Hi, ${storeAccount.getDetailValue.fullname}`"
    bodyClass="bg-gray2"
    align="right"
    footerFixed
    :bodySpace="false"
  >
    <template #body>
      <CardAccount :showBarcode="false" />
      <div class="pl-ms pr-ms pb-md">
        <CardPointInfo :balancePoint="storeAccount.getDetailValue?.membership?.balancePoint"/>
        <div class="row row-xxs has-control mt-md">
          <div class="col-4" v-for="(item, index) in storeAccount.accountMenu" :key="index">
            <MenuAccountItemTemplate2 :item="item" @click="storeAccount.handleTogglePopupAccountMenuInfo(false)"/>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <NuxtLink :to="{ path: storeAccount.accountMenu[0].path }" @click="storeAccount.handleTogglePopupAccountMenuInfo(false)">
        <Button tag="div" label="Di toi tai khoan" color="primary" class="w-full text-uppercase" />
      </NuxtLink>
    </template>
  </Popup>
</template>

