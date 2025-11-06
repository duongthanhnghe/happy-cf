<script lang="ts" setup>
import {
  watch, onBeforeUnmount
} from 'vue'
import type {
  SubmitEventPromise
} from 'vuetify';
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
import { nullRules } from '@/utils/validation';

const storeAccountEdit = useAccountEditStore()
const accountStore = useAccountStore()
const storeFileManage = useFileManageFolderStore();
let folderName = FOLDER_UPLOAD.MEMBER

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event;
  if (!result.valid) return;
  storeAccountEdit.submitUpdate();
}

watch(() => storeFileManage.getSelectImage, (newValue) => {
  if (!newValue) return
  storeAccountEdit.formUserItem.avatar = newValue.url
}, { immediate: true })

folderName = `${FOLDER_UPLOAD.MEMBER}${accountStore.getDetailValue?.id}`;
useFileManageWatchers(storeFileManage, folderName);

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

<PopupFileManageImage :folderName="folderName+accountStore.getDetailValue?.id" :chooseImage="true" column="col-6 col-md-4"/>

<Popup popupId="popup-update-account" v-model="storeAccountEdit.isTogglePopupUpdate" :popupHeading="AUTH_TEXT_UPDATE_INFO" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" :label="GLOBAL_TEXT_UPDATE" class="w-full" />
      </div>
      <v-container>
        <AvatarEdit width="200px" :label="AUTH_TEXT_EDIT_AVATAR" className="mb-md" @click.prevent="storeFileManage.handleTogglePopup(true)">
          <slot>
            <img v-if="storeAccountEdit.formUserItem.avatar" :src="storeAccountEdit.formUserItem.avatar" :alt="storeAccountEdit.formUserItem.fullname" />
            <img v-else :src="IMAGE_EMPTY_DEFAULT" :alt="storeAccountEdit.formUserItem.fullname" />
          </slot>
        </AvatarEdit>

        <LabelInput :label="AUTH_TEXT_FULLNAME" required />
        <v-text-field variant="outlined" v-model="storeAccountEdit.formUserItem.fullname" :rules="nullRules" label="Ho va ten" required></v-text-field>

        <LabelInput :label="AUTH_TEXT_BIRTHDAY" required />
        <v-text-field variant="outlined" v-model="storeAccountEdit.getBirthday" type="date" label="Ngay sinh" class="input-date-custom" append-inner-icon="mdi-calendar"></v-text-field>

        <LabelInput :label="AUTH_TEXT_PHONE" required />
        <v-text-field variant="outlined" v-model="storeAccountEdit.formUserItem.phone" type="tel" :counter="11" maxlength="11" :rules="nullRules" label="So dien thoai"></v-text-field>
        <v-radio-group inline v-model="storeAccountEdit.formUserItem.gender">
          <v-radio :label="GLOBAL_TEXT_MALE" value="male"></v-radio>
          <v-radio :label="GLOBAL_TEXT_FEMALE" value="female"></v-radio>
          <v-radio label="Khac" value="other"></v-radio>
        </v-radio-group>

      </v-container>
    </v-form>
  </template>
</Popup>
</template>
