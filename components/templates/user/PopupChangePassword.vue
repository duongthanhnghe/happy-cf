<script lang="ts" setup>
import { computed } from 'vue';
import {
  useAccountEditStore
} from '@/stores/client/users/useAccountEditStore'
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore'
import type {
  SubmitEventPromise
} from 'vuetify';
import {
  AUTH_TEXT_CHANGE_PASSWORD,
  AUTH_TEXT_PASSWORD_NEW,
  AUTH_TEXT_CONFIRM_PASSWORD,
  GLOBAL_TEXT_UPDATE,
  AUTH_TEXT_PASSWORD_HINT,
} from '@/const/text'
import { createNewPasswordRules } from '@/utils/validation';

const storeAccountEdit = useAccountEditStore();
const storeAccount = useAccountStore();

const newPasswordRules = computed(() =>
  createNewPasswordRules(storeAccountEdit.newPasswordConfirm)
)
const confirmPasswordRules = computed(() =>
  createNewPasswordRules(storeAccountEdit.newPassword)
)

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event;
  if (!result.valid) return;
  storeAccountEdit.submitChangePassword(storeAccount.getDetailValue?.id ?? '', storeAccount.getDetailValue?.password ?? '');
}

</script>
<template>
<Popup popupId="popup-change-password" v-model="storeAccountEdit.isTogglePopupChangePassword" :popupHeading="AUTH_TEXT_CHANGE_PASSWORD" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" :label="GLOBAL_TEXT_UPDATE" class="w-full" />
      </div>

      <LabelInput :label="AUTH_TEXT_PASSWORD_NEW" required/>
      <v-text-field :append-icon="storeAccountEdit.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccountEdit.showPassword ? 'text' : 'password'" @click:append="storeAccountEdit.showPassword = !storeAccountEdit.showPassword" v-model="storeAccountEdit.newPassword" :rules="newPasswordRules" :label="AUTH_TEXT_PASSWORD_HINT" autocomplete="new-password" required></v-text-field>
      <LabelInput :label="AUTH_TEXT_CONFIRM_PASSWORD" required/>
      <v-text-field :append-icon="storeAccountEdit.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccountEdit.showPasswordConfirm ? 'text' : 'password'" @click:append="storeAccountEdit.showPasswordConfirm = !storeAccountEdit.showPasswordConfirm" v-model="storeAccountEdit.newPasswordConfirm" :rules="confirmPasswordRules" :label="AUTH_TEXT_PASSWORD_HINT" autocomplete="new-password" required></v-text-field>

    </v-form>
  </template>
</Popup>
</template>
