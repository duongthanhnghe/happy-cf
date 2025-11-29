<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const store = useAddressesManageStore();
const storeDisplay = useDisplayStore();

const props = defineProps<{
  idChoose?: string,
}>();

</script>
<template>
  <Popup v-model="store.isTogglePopupList" popupHeading="Sổ địa chỉ" :bodyClass="storeDisplay.isMobileTable ? 'bg-gray6':''" align="right">
    <template #body>
        <ListManageAddress :idChoose="props.idChoose" />
    </template>
  </Popup>
</template>
