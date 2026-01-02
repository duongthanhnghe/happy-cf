<script lang="ts" setup>
import { useAccountStore } from '@/stores/admin/account/useAccountStore'
import type { SubmitEventPromise } from 'vuetify'
import { AUTH_TEXT_LOGIN, AUTH_TEXT_PASSWORD, AUTH_TEXT_USERNAME } from '@/const/text'
import { ROUTES } from '@/shared/constants/routes'
import { useValidate } from '@/composables/validate/useValidate'
import { loginSchema } from '@/shared/validate/schemas/account.schema'
import { showWarning } from '@/utils/toast'

definePageMeta({
  layout: ROUTES.ADMIN.LOGIN.layout,
})

const store = useAccountStore()

const { validate, formErrors } = useValidate(loginSchema)

const handleSubmitLogin = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return

  if (!validate(store.formLogin)) {
    showWarning('Vui lòng nhập thông tin đăng nhập hợp lệ')
    return
  }

  store.submitLogin()
}
</script>

<template>
  <Text class="mb-xl" align="center" color="primary" size="xxl" :text="AUTH_TEXT_LOGIN" />
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitLogin">
    <LabelInput :label="AUTH_TEXT_USERNAME" required/>
    <v-text-field
      v-model="store.formLogin.email"
      label="email@gmail.com"
      variant="outlined"
      required
      :error="!!formErrors.email"
      :error-messages="formErrors.email"
    />
    <LabelInput :label="AUTH_TEXT_PASSWORD" class="flex justify-between" required />
    <v-text-field
      v-model="store.formLogin.password"
      :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="store.showPassword ? 'text' : 'password'"
      @click:append="store.showPassword = !store.showPassword"
      variant="outlined"
      label="Nhập mật khẩu"
      required
      :error="!!formErrors.password"
      :error-messages="formErrors.password"
    />
    <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_LOGIN" class="w-full" />
  </v-form>
</template>