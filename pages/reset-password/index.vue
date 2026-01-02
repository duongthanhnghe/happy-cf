<script lang="ts" setup>
import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'
import { useValidate } from '@/composables/validate/useValidate'
import { resetPasswordSchema } from '@/shared/validate/schemas/user.schema'
import { showWarning } from '@/utils/toast'

import {
  AUTH_TEXT_RESET_PASSWORD,
  AUTH_TEXT_PASSWORD_HINT,
  AUTH_TEXT_CHANGE_PASSWORD,
  AUTH_TEXT_PASSWORD_NEW,
  AUTH_TEXT_CONFIRM_PASSWORD,
} from '@/const/text'

import { ROUTES } from '@/shared/constants/routes'

definePageMeta({
  layout: ROUTES.PUBLIC.RESET_PASSWORD.layout,
})

const store = useUserAuthStore()

const { validate, formErrors } = useValidate(resetPasswordSchema)

const handleSubmitResetPassword = async () => {
  const payload = {
    password: store.newPassword,
    passwordConfirm: store.newPasswordConfirm,
  }

  if (!validate(payload)) {
    showWarning('Vui lòng nhập mật khẩu hợp lệ')
    return
  }

  await store.submitResetPassword()
}
</script>

<template>
  <Text
    class="mb-xl"
    align="center"
    color="primary"
    size="xxl"
    :text="AUTH_TEXT_RESET_PASSWORD"
  />

  <v-form @submit.prevent="handleSubmitResetPassword">
    <!-- New password -->
    <LabelInput :label="AUTH_TEXT_PASSWORD_NEW" required />
    <v-text-field
      v-model="store.newPassword"
      :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="store.showPassword ? 'text' : 'password'"
      @click:append="store.showPassword = !store.showPassword"
      :label="AUTH_TEXT_PASSWORD_HINT"
      variant="outlined"
      required
      :error="!!formErrors.password"
      :error-messages="formErrors.password"
    />

    <!-- Confirm password -->
    <LabelInput :label="AUTH_TEXT_CONFIRM_PASSWORD" required />
    <v-text-field
      v-model="store.newPasswordConfirm"
      :append-icon="store.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      :type="store.showPasswordConfirm ? 'text' : 'password'"
      @click:append="store.showPasswordConfirm = !store.showPasswordConfirm"
      :label="AUTH_TEXT_PASSWORD_HINT"
      variant="outlined"
      required
      :error="!!formErrors.passwordConfirm"
      :error-messages="formErrors.passwordConfirm"
    />

    <Button
      type="submit"
      color="primary"
      :loading="store.loadingAuth"
      :shadow="true"
      :label="AUTH_TEXT_CHANGE_PASSWORD"
      class="w-full"
    />
  </v-form>
</template>