<script lang="ts" setup>
import { watch, onBeforeUnmount } from 'vue'
import {
  AUTH_TEXT_FULLNAME,
  AUTH_TEXT_BIRTHDAY,
  AUTH_TEXT_PHONE,
  GLOBAL_TEXT_UPDATE,
  AUTH_TEXT_UPDATE_INFO,
  AUTH_TEXT_EDIT_AVATAR,
  GLOBAL_TEXT_MALE,
  GLOBAL_TEXT_FEMALE
} from '@/const/text'
import { IMAGE_EMPTY_DEFAULT } from '@/const/image'
import { useAccountEditStore } from '@/stores/client/users/useAccountEditStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { useFileManageWatchers } from '@/composables/shared/file-manage/useFileManageWatchers';
import { useValidate } from '@/composables/validate/useValidate'
import { updateUserProfileSchema } from '@/shared/validate/schemas/user.schema'
import { showWarning } from '@/utils/toast'

const storeAccountEdit = useAccountEditStore()
const accountStore = useAccountStore()
const storeFileManage = useFileManageFolderStore();
const folderName = `${FOLDER_UPLOAD.MEMBER}${accountStore.getUserId}`;
const { validate, formErrors } = useValidate(updateUserProfileSchema)

const handleSubmitUpdate = async () => {
  // const payload = {
  //   fullname: storeAccountEdit.formUserItem.fullname,
  //   phone: storeAccountEdit.formUserItem.phone,
  //   birthday: storeAccountEdit.getBirthday,
  //   gender: storeAccountEdit.formUserItem.gender,
  //   avatar: storeAccountEdit.formUserItem.avatar,
  // }

  if (!validate(storeAccountEdit.formUserItem)) {
    showWarning('Vui lòng kiểm tra lại thông tin')
    return
  }

  storeAccountEdit.submitUpdate();
}

watch(() => storeFileManage.getSelectImage, (newValue) => {
  if (!newValue) return
  storeAccountEdit.formUserItem.avatar = newValue.url
}, { immediate: true })

useFileManageWatchers(storeFileManage, folderName);

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

<PopupFileManageImage :folderName="folderName" :chooseImage="true" column="col-6 col-md-4"/>

<Popup bodyClass="bg-gray6" v-model="storeAccountEdit.isTogglePopupUpdate" footerFixed :popupHeading="AUTH_TEXT_UPDATE_INFO" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitUpdate">
      <AvatarEdit :label="AUTH_TEXT_EDIT_AVATAR" className="mb-md width-200 height-200" @click.prevent="storeFileManage.handleTogglePopup(true)">
        <slot>
          <img v-if="storeAccountEdit.formUserItem.avatar" :src="storeAccountEdit.formUserItem.avatar" :alt="storeAccountEdit.formUserItem.fullname" />
          <img v-else :src="IMAGE_EMPTY_DEFAULT" :alt="storeAccountEdit.formUserItem.fullname" />
        </slot>
      </AvatarEdit>

      <LabelInput :label="AUTH_TEXT_FULLNAME" required />
      <v-text-field variant="outlined" v-model="storeAccountEdit.formUserItem.fullname" :error="!!formErrors.fullname"
  :error-messages="formErrors.fullname" label="Họ và tên" required></v-text-field>

      <LabelInput :label="AUTH_TEXT_BIRTHDAY" required />
      <v-text-field variant="outlined" v-model="storeAccountEdit.getBirthday" type="date" label="Ngày sinh" class="input-date-custom" append-inner-icon="mdi-calendar" :error="!!formErrors.birthday"
  :error-messages="formErrors.birthday"></v-text-field>

      <LabelInput :label="AUTH_TEXT_PHONE" required />
      <v-text-field variant="outlined" v-model="storeAccountEdit.formUserItem.phone" type="tel" :counter="11" maxlength="11" :error="!!formErrors.phone"
  :error-messages="formErrors.phone" label="Số điện thoại"></v-text-field>
      <v-radio-group inline v-model="storeAccountEdit.formUserItem.gender">
        <v-radio :label="GLOBAL_TEXT_MALE" value="male" class="mr-sm"></v-radio>
        <v-radio :label="GLOBAL_TEXT_FEMALE" value="female" class="mr-sm"></v-radio>
        <v-radio label="Khác" value="other"></v-radio>
      </v-radio-group>
    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitUpdate" color="primary" :label="GLOBAL_TEXT_UPDATE" class="w-full" />
  </template>
</Popup>
</template>
