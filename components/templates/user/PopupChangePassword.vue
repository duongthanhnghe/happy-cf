<script lang="ts" setup>
import { useAccountEditStore } from '@/stores/client/users/useAccountEditStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import {
  AUTH_TEXT_CHANGE_PASSWORD,
  AUTH_TEXT_PASSWORD_NEW,
  AUTH_TEXT_CONFIRM_PASSWORD,
  GLOBAL_TEXT_UPDATE,
  AUTH_TEXT_PASSWORD_HINT,
} from '@/const/text'
import { useValidate } from '@/composables/validate/useValidate'
import { resetPasswordSchema } from '@/shared/validate/schemas/user.schema'
import { showWarning } from '@/utils/toast'

const storeAccountEdit = useAccountEditStore();
const storeAccount = useAccountStore();
const { validate, formErrors } = useValidate(resetPasswordSchema)

const handleSubmitUpdate = async () => {
  const payload = {
    oldPassword: storeAccountEdit.oldPassword,
    password: storeAccountEdit.newPassword,
    passwordConfirm: storeAccountEdit.newPasswordConfirm,
  }

  if (!validate(payload)) {
    showWarning('Vui lòng nhập mật khẩu hợp lệ')
    return
  }

  storeAccountEdit.submitChangePassword()
}

</script>
<template>
<Popup bodyClass="bg-gray6" v-model="storeAccountEdit.isTogglePopupChangePassword" footerFixed :popupHeading="AUTH_TEXT_CHANGE_PASSWORD" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitUpdate">
      <LabelInput label="Mật khẩu cũ" required/>
      <v-text-field :append-icon="storeAccountEdit.showOldPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccountEdit.showOldPassword ? 'text' : 'password'" @click:append="storeAccountEdit.showOldPassword = !storeAccountEdit.showOldPassword" v-model="storeAccountEdit.oldPassword" :error="!!formErrors.oldPassword"
  :error-messages="formErrors.oldPassword" :label="AUTH_TEXT_PASSWORD_HINT" autocomplete="new-password" variant="outlined" required></v-text-field>

      <LabelInput :label="AUTH_TEXT_PASSWORD_NEW" required/>
      <v-text-field :append-icon="storeAccountEdit.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccountEdit.showPassword ? 'text' : 'password'" @click:append="storeAccountEdit.showPassword = !storeAccountEdit.showPassword" v-model="storeAccountEdit.newPassword" :error="!!formErrors.password"
  :error-messages="formErrors.password" :label="AUTH_TEXT_PASSWORD_HINT" autocomplete="new-password" variant="outlined" required></v-text-field>
      <LabelInput :label="AUTH_TEXT_CONFIRM_PASSWORD" required/>
      <v-text-field :append-icon="storeAccountEdit.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccountEdit.showPasswordConfirm ? 'text' : 'password'" @click:append="storeAccountEdit.showPasswordConfirm = !storeAccountEdit.showPasswordConfirm" v-model="storeAccountEdit.newPasswordConfirm" :error="!!formErrors.passwordConfirm"
  :error-messages="formErrors.passwordConfirm" :label="AUTH_TEXT_PASSWORD_HINT" autocomplete="new-password" variant="outlined" required></v-text-field>
    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitUpdate" color="primary" :label="GLOBAL_TEXT_UPDATE" class="w-full" />
  </template>
</Popup>
</template>
