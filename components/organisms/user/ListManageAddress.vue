<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useCartStore } from '@/stores/client/product/useCartOrderStore';

const store = useAddressesManageStore();
const storeCart = useCartStore();

const props = defineProps<{
  idChoose?: string,
}>();

const handleChooseAddress = (item: any) => {
  storeCart.handleChooseAddress(item)
  store.isTogglePopupList = false
}

</script>
<template>
  <LoadingData v-if="store.loadingData && !store.getListAddress === null" />
  <template v-else-if="store.getListAddress && store.getListAddress.length > 0">
    <div  v-for="item in store.getListAddress" :key="item.id" class="card card-sm bg-white mb-ms">
      <div class="flex justify-between">
        <div class="flex gap-sm">
          <v-chip label color="blue">
            {{ item.tag }}
          </v-chip>
          <v-chip v-if="item.isDefault" label color="primary">
            Mac dinh
          </v-chip>
        </div>
        <div class="flex gap-sm">
          <template v-if="store.getActionChangeAddress">
            <Button v-if="props.idChoose === item.id" color="gray" size="sm" label="Dang chon" :disabled="true" />
            <Button v-else color="secondary" size="sm" label="Chon" @click.prevent="handleChooseAddress(item)" />
          </template>
          <Button v-else color="secondary" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
        </div>
      </div>
      <div class="flex align-center gap-xs mt-sm">
        <MaterialIcon name="distance" /> {{ item.address }}
      </div>
      <div class="mt-xs text-color-gray5">
        {{ item.fullname }} - {{ item.phone }}
      </div>
    </div>
  </template>
  <NoData v-else />
</template>
