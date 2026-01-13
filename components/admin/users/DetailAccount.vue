<script lang="ts" setup>
import { useAdminUserDetailStore } from '@/stores/admin/users/useUserDetailStore';
import { useUserHelpers } from '@/utils/userHelpers';

const { colorType } = useUserHelpers()
const store = useAdminUserDetailStore();

</script>
<template>
<Popup 
  v-model="store.isTogglePopup" 
  :popupHeading="store.getDetailUser?.fullname" 
  bodyClass="bg-gray6"
  align="right"
  >
  <template #body >
    <div class="text-center">
      <div>
        <Image 
          v-if="store.getDetailUser?.avatar" :src="store.getDetailUser?.avatar" :alt="store.getDetailUser?.fullname"
          :width="150"
          :height="150"
          preset="avatar"
          class="rd-full width-150 height-150 object-fit-cover"
        />
      </div>
      <Text :text="store.getDetailUser?.fullname" color="black" weight="semibold" size="lg" class="mt-sm mb-xs"/>
      <v-chip v-if="store.getDetailUser?.membership" :color="colorType(store.getDetailUser?.membership.level)" >{{store.getDetailUser?.membership.level}}</v-chip>
    </div>
    <Card size="sm" heading="Thông tin" class="rd-lg mt-lg">
      <div v-for="(item, index) in store.infoItems" :key="index" class="mb-ms">
        <div class="flex gap-sm align-center">
          <Button tag="span" :icon="item.icon" color="secondary" class="rd-xs" />
          <div>
            <Text :text="item.label" color="gray5" />
            <Text :text="item.value" color="black" size="normal" />
          </div>
        </div>
      </div>
      <div class="flex align-center gap-xs">
        Tình trạng: 
        <v-chip label :color="`${store.getDetailUser?.active === true ? 'green' : 'red'}`" >
          {{ store.getDetailUser?.active === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
        </v-chip>
      </div>
    </Card>
    <Card size="sm" heading="Mã barcode" class="rd-lg mt-ms">
      <div class="text-center">
        <img v-if="store.getDetailUser?.membership.barcode" :src="store.getDetailUser?.membership.barcode" :alt="store.getDetailUser?.membership.barcode" class="width-300" />
        <div class="mt-xs">{{ store.getDetailUser?.membership.code }}</div>
      </div>
    </Card>
    <Card size="sm" heading="Thông tin Membership" class="rd-lg mt-ms">
      <div v-for="(item, index) in store.membershipItems" :key="index" class="mb-ms">
        <div class="flex gap-sm align-center">
          <Button tag="span" :icon="item.icon" color="secondary" class="rd-xs" />
          <div>
            <Text :text="item.label" color="gray5" />
            <Text :text="item.value" color="black" size="normal" />
          </div>
        </div>
      </div>
      <div class="flex align-center gap-xs">
        Hạng thành viên: 
        <v-chip v-if="store.getDetailUser?.membership" :color="colorType(store.getDetailUser?.membership.level)" >{{store.getDetailUser?.membership.level}}</v-chip>
      </div>
    </Card>
  </template>
</Popup>
</template>
