<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useAccountEditStore } from '@/stores/client/users/useAccountEditStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { formatDateTime } from '@/utils/global';
import type { User } from '@/server/types/dto/v1/user.dto';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const storeAccount = useAccountStore();
const storeAccountEdit = useAccountEditStore()
const storeDisplay = useDisplayStore()
const user: User = storeAccount.getDetailValue
const classItem = 'flex gap-sm mb-ms';
const classTitle = 'min-width-150';

</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.INFO.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <div :class="classItem">
      <Text text="Họ và tên" color="gray5" :class="classTitle" />
      <Text :text="user.fullname" color="black" :class="classTitle" />
    </div>
    <div :class="classItem">
      <Text text="Email" color="gray5" :class="classTitle" />
      <Text :text="user.email" color="black" :class="classTitle" />
    </div>
    <div :class="classItem">
      <Text text="Số điện thoại" color="gray5" :class="classTitle" />
      <Text :text="user.phone" color="black" :class="classTitle" />
    </div>
    <div :class="classItem">
      <Text text="Giới tính" color="gray5" :class="classTitle" />
      <Text :text="user.gender" color="black" :class="classTitle" />
    </div>
    <div :class="classItem">
      <Text text="Ngày sinh" color="gray5" :class="classTitle" />
      <Text :text="formatDateTime(user.birthday,'vi-VN',false)" color="black" :class="classTitle" />
    </div>
    <Button color="gray" label="Cập nhật" class="mt-xs" @click.prevent="storeAccountEdit.handleEditAccount" />

    <Text text="Thông tin đăng nhập" color="black" size="md" weight="semibold" class="mb-sm mt-lg" />
    <div :class="classItem">
      <Text text="Email" color="gray5" :class="classTitle" />
      <Text :text="user.email" color="black" :class="classTitle" />
    </div>
    <div :class="classItem">
      <Text text="Mật khẩu" color="gray5" :class="classTitle" />
      <Text text="••••••••••••••••" color="black" :class="classTitle" />
    </div>
    <Button color="gray" label="Cập nhật" class="mt-xs" @click="storeAccountEdit.handleTogglePopupChangePassword" />
  </Card>

  <PopupUpdateAccount />
  <PopupChangePassword />
</template>