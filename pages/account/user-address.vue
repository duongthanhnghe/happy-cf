<script lang="ts" setup>
import { watch } from 'vue'
import { ROUTES } from '@/shared/constants/routes';
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useLocationStore } from '@/stores/shared/useLocationStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useAddressesManageStore();
const storeLocation = useLocationStore();

store.actionChangeAddress = false
if (!store.getListAddress) store.loadItems();


watch(() => storeLocation.selectedProvince, async (newVal) => {
  if (storeLocation.isSetting) return
  
  if (newVal) {
    await storeLocation.fetchDistrictsStore(newVal)
    storeLocation.selectedDistrict = null
    storeLocation.selectedWard = null
  } else {
    storeLocation.districts = []
    storeLocation.wards = []
  }
})

watch(() => storeLocation.selectedDistrict, async (newVal) => {
  if (storeLocation.isSetting) return
  
  if (newVal) {
    await storeLocation.fetchWardsStore(newVal)
    storeLocation.selectedWard = null
  } else {
    storeLocation.wards = []
  }
})

</script>
<template>
  <ListManageAddress />
  <Button color="primary" label="Them dia chi" class="w-full" @click="store.handleTogglePopupAdd"/>

  <PopupUpdateAddress />
  <PopupCreateAddress />
</template>