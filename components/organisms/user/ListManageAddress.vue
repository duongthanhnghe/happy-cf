<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';

const store = useAddressesManageStore();
const props = defineProps<{
  idChoose?: string,
}>();

</script>
<template>
  <LoadingData v-if="store.loadingData && !store.getListAddress" />
  <template v-else-if="store.getListAddress && store.getListAddress.length > 0">
    <template v-for="item in store.getListAddress" :key="item.id">
      <AccountAddressTemplate1 :item="item" :idChoose="props.idChoose"/>
    </template>
  </template>
  <NoData v-else />
</template>