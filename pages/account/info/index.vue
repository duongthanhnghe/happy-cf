<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useAccountEditStore } from '@/stores/client/users/useAccountEditStore'
import type { User } from '@/server/types/dto/v1/user.dto';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const storeAccount = useAccountStore();
const storeAccountEdit = useAccountEditStore()
const user: User | null = storeAccount.getDetailValue

</script>
<template>
  <template v-if="user">
    <Heading class="mb-sm" tag="div" color="primary" weight="semibold" size="md">Thông tin tài khoản</Heading>
    {{ user.fullname }}
    <Button label="Cập nhật" @click="storeAccountEdit.handleEditAccount" />

    <Heading class="mb-sm" tag="div" color="primary" weight="semibold" size="md">Thông tin đăng nhập</Heading>
    <div class="flex gap-md">
      <span class="text-color-gray">Email</span> {{ user.email }}
    </div>
    <div class="flex gap-md">
      <span class="text-color-gray">Mật khẩu</span> ••••••••••••••••
    </div>

    <Button label="Cập nhật" @click="storeAccountEdit.handleTogglePopupChangePassword" />

    <PopupUpdateAccount />
    <PopupChangePassword />
  </template>
</template>