<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';

const store = useAddressesManageStore();

const props = defineProps<{
  idChoose?: string,
}>();

</script>
<template>
  <Popup v-model="store.isTogglePopupList" popupHeading="Dia chi" bodyClass="bg-gray6" align="right">
    <template #body>
        <ListManageAddress :idChoose="props.idChoose" />
    </template>
  </Popup>
</template>
