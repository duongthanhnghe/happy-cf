<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { useCartStore } from '@/stores/client/product/useCartOrderStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { AddressDTO } from '@/server/types/dto/v1/address.dto';

const store = useAddressesManageStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()

const props = defineProps<{
  idChoose?: string,
  item: AddressDTO,
}>();

const handleChooseAddress = (item: any) => {
  storeCart.handleChooseAddress(item)
  store.isTogglePopupList = false
}

</script>
<template>
  <Card size="sm" class="rd-lg shadow-1 mb-ms" :bg="storeDisplay.isLaptop ? 'gray6':'white'">
    <div class="flex justify-between">
      <div class="flex gap-xs">
        <v-chip label >
          {{ item.tag }}
        </v-chip>
        <v-chip v-if="item.isDefault" label color="blue">
          Mac dinh
        </v-chip>
      </div>
      <div class="flex gap-sm">
        <template v-if="store.getActionChangeAddress">
          <Button v-if="props.idChoose === item.id" color="black" size="sm" label="Dang chon" :disabled="true" />
          <Button v-else color="secondary" size="sm" label="Chon" @click.prevent="handleChooseAddress(item)" />
        </template>
        <Button v-else color="secondary" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
      </div>
    </div>
    <div class="flex align-center gap-xs mt-ms mb-ms">
      <MaterialIcon name="distance" /> {{ item.address }}
    </div>
    <div class="flex gap-md">
      <div>
        <Text text="Ten nguoi nhan" color="gray5" size="xs"/>
        <Text :text="item.fullname" color="black" />
      </div>
      <div>
        <Text text="So dien thoai" color="gray5" size="xs"/>
        <Text :text="item.phone" color="black" />
      </div>
    </div>
  </Card>
</template>
