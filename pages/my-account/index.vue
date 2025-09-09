<script lang="ts" setup>
import './index.scss';
import {
  useAccountStore
} from '@/stores/users/useAccountStore'
import {
  useAddressesManageStore
} from '@/stores/users/useAddressesStore'
import {
  useOrderHistoryStore
} from '@/stores/order/useOrderHistoryStore';
import {
  useWishlistStore
} from '@/stores/users/useWishlistStore';
import { useAccountEditStore } from '@/stores/users/useAccountEditStore'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  layout: ROUTES.PUBLIC.MY_ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.MY_ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.MY_ACCOUNT.middleware,
})

const store = useAccountStore();
const storeAccountEdit = useAccountEditStore()
const storeAddress = useAddressesManageStore();
const storeOrder = useOrderHistoryStore();
const storeWishlist = useWishlistStore();

const menuAccount = [
  { label: 'Thong tin ca nhan', icon:'person', action: () => storeAccountEdit.handleEditAccount() },
  { label: 'Dia chi da luu', icon:'edit_location', action: () => storeAddress.handleTogglePopupList(true,false,false) },
  { label: 'Lich su don hang', icon:'prescriptions', action: () => storeOrder.handleTogglePopupAdd(true) },
  { label: 'Danh sach yeu thich', icon:'favorite', action: () => storeWishlist.handleTogglePopupAdd(true) },
  { label: 'Dang xuat', icon:'logout', action: () => store.handleLogout() },
]

const cardItemClass= 'card card-sm bg-white';

</script>
<template>
  <template v-if="store.getDetailValue?.id">
  <PopupUpdateAccount />
  <PopupOrderHistory />
  <PopupWishlist />
  </template>
  <div class="account-bg bg-gray2">
    <SectionAccount :showBarcode="false"/>
    <div v-if="store.getDetailValue?.id" class="container pt-ms">
      <div class="account-container">
        <Heading class="mb-sm" tag="div" color="primary" weight="semibold" size="md">Thông tin tài khoản</Heading>
        <div :class="`${cardItemClass}`">
            <div class="account-link-item flex gap-sm cursor-pointer" v-for="(item, index) in menuAccount" @click="item.action" :key="index">
              <MaterialIcon :name="item.icon" weight="300" size="24" />
              <div class="account-link-text flex flex-1 justify-between align-center">
                <span>{{ item.label }}</span>
                <MaterialIcon name="chevron_right" weight="300" size="20" class="text-color-gray5"/>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>