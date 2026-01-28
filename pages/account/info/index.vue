<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useAccountEditStore } from '@/stores/client/users/useAccountEditStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { formatDateTime } from '@/utils/global';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
  showHeaderSub: ROUTES.PUBLIC.ACCOUNT.showHeaderSub,
})

const storeAccount = useAccountStore()
const storeAccountEdit = useAccountEditStore()
const storeDisplay = useDisplayStore()
const user = storeAccount.getDetailValue || null
const classItem = storeDisplay.isLaptop ? 'flex gap-sm mb-ms':'bg-white mb-xs pt-ms pb-ms pl-ms pr-ms shadow-1 rd-lg position-relative';
const classTitle = 'min-width-150';
const infoItems = [
  { label: 'Họ và tên', value: user?.fullname, edit: true },
  { label: 'Email', value: user?.email, edit: false },
  { label: 'Số điện thoại', value: user?.phone, edit: true },
  { label: 'Giới tính', value: user?.gender, edit: true },
  { label: 'Ngày sinh', value: formatDateTime(user?.birthday,'vi-VN',false), edit: true },
]
</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <Heading :text="ROUTES.PUBLIC.ACCOUNT.children?.INFO.label" />
    <div v-for="(item, index) in infoItems" :key="index" :class="classItem">
      <Text :text="item.label" color="gray5" :class="classTitle" />
      <Text :text="item.value" color="black" size="normal" :class="classTitle" />
      <Button
        v-if="item.edit && storeDisplay.isMobileTable"
        color="secondary" size="sm" icon="edit"
        class="rd-full position-absolute right-1 bottom-1"
        @click.prevent="storeAccountEdit.handleEditAccount"
      />
    </div>

    <div v-if="storeAccount.hasWarningInfo">
      <v-chip label color="warning" class="mb-sm">
        Vui lòng cập nhật thông tin đầy đủ để nhận thêm nhiều ưu đãi
      </v-chip>
    </div>

    <Button
      v-if="storeDisplay.isLaptop"
      color="gray" label="Cập nhật"
      class="mt-xs"
      @click.prevent="storeAccountEdit.handleEditAccount"
    />

    <Heading text="Thông tin đăng nhập" class="mt-lg" />

    <div :class="classItem">
      <Text text="Email" color="gray5" :class="classTitle" />
      <Text :text="user?.email" color="black" size="normal" :class="classTitle" />
    </div>

    <div :class="classItem">
      <Text text="Mật khẩu" color="gray5" :class="classTitle" />
      <Text text="••••••••••••••••" color="black" size="normal" :class="classTitle" />
      <Button
        v-if="storeDisplay.isMobileTable"
        color="secondary" size="sm" icon="edit"
        class="rd-full position-absolute right-1 bottom-1"
        @click.prevent="storeAccountEdit.handleTogglePopupChangePassword"
      />
    </div>

    <Button
      v-if="storeDisplay.isLaptop"
      color="gray" label="Cập nhật"
      class="mt-xs"
      @click="storeAccountEdit.handleTogglePopupChangePassword"
    />

    <Text :text="`Tham gia ngày ${formatDateTime(user?.membership.joinedAt,'vi-VN',false)}`" color="gray4" align="center" class="mt-sm" />

  </Card>

  <PopupUpdateAccount />
  <PopupChangePassword />
</template>
