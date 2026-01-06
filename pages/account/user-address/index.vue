<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useAddressesManageStore();
const storeLocation = useLocationStore();
const storeDisplay = useDisplayStore()

store.actionChangeAddress = false
if (!store.getListAddress || store.getListAddress.length === 0) await store.loadItems();

useLocationWatchers(storeLocation);

</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.USER_ADDRESS.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <ListManageAddress />
    <Button color="primary" label="Thêm địa chỉ" class="w-full" @click="store.handleTogglePopupAdd"/>
  </Card>

  <PopupUpdateAddress />
  <PopupCreateAddress />
</template>