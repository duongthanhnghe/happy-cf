<script lang="ts" setup>
import { useMembershipStore } from '@/stores/client/users/useMembershipStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore'

const store = useMembershipStore();
const storeAccount = useAccountStore();

</script>
<template>
  <Popup
    v-model="storeAccount.isTogglePopupMembershipInformation"
    popupHeading="Hạng thành viên"
    bodyClass="bg-gray2 pd-0"
    align="right"
  >
    <template #body>
      <CardAccount showLevel />
      <LoadingData v-if="store.loading" />
      <ListMembershipInfo :listData="store.getListData" v-else />
    </template>
  </Popup>
</template>

