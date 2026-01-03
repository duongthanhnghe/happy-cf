<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore'

const storeAccount = useAccountStore();
onMounted(() => {
  if(!storeAccount.getPendingReward && storeAccount.getUserId) storeAccount.fetchPendingRewardPoints(storeAccount.getUserId)
});
</script>
<template>
  <Popup
    v-model="storeAccount.isTogglePopupAccountMenuInfo"
    :popupHeading="`Hi, ${storeAccount.getDetailValue?.fullname}`"
    bodyClass="bg-gray2"
    align="right"
    footerFixed
    :bodySpace="false"
  >
    <template #body>
      <CardAccount showBarcode />
      <div class="pl-ms pr-ms pb-md">
        <CardPointInfo v-if="storeAccount.getDetailValue?.membership?.balancePoint && storeAccount.getPendingReward?.totalPendingPoints" :balancePoint="storeAccount.getDetailValue?.membership?.balancePoint" :totalPendingPoints="storeAccount.getPendingReward?.totalPendingPoints"/>
        <div class="row row-xxs has-control mt-md">
          <div class="col-4" v-for="(item, index) in storeAccount.accountMenu" :key="index">
            <MenuAccountItemTemplate2 :item="item" @click="storeAccount.handleTogglePopupAccountMenuInfo(false)"/>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <NuxtLink :to="{ path: storeAccount.accountMenu[0].path }" @click="storeAccount.handleTogglePopupAccountMenuInfo(false)">
        <Button tag="div" label="Đi tới tài khoản" color="primary" class="w-full text-uppercase" />
      </NuxtLink>
    </template>
  </Popup>
</template>

