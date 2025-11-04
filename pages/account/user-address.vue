<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useAddressesManageStore();
const storeLocation = useLocationStore();

store.actionChangeAddress = false
if (!store.getListAddress) store.loadItems();

useLocationWatchers(storeLocation);

</script>
<template>
  <ListManageAddress />
  <Button color="primary" label="Them dia chi" class="w-full" @click="store.handleTogglePopupAdd"/>

  <PopupUpdateAddress />
  <PopupCreateAddress />
</template>