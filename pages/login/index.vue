<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'
import { useValidate } from '@/composables/validate/useValidate'
import { loginSchema } from '@/shared/validate/schemas/user.schema'

import {
  AUTH_TEXT_LOGIN,
  AUTH_TEXT_REGISTER,
  AUTH_TEXT_PASSWORD,
  AUTH_TEXT_USERNAME,
  AUTH_TEXT_FORGOT_PASSWORD,
  AUTH_TEXT_LOGIN_GOOGLE,
  AUTH_TEXT_LOGIN_EMAIL,
  AUTH_TEXT_REGISTER_HINT
} from '@/const/text'

import { ROUTES } from '@/shared/constants/routes'
import { useGoogleAuth } from '@/composables/user/useGoogleAuth'
import { showWarning } from '@/utils/toast'

definePageMeta({
  layout: ROUTES.PUBLIC.LOGIN.layout,
})

const store = useUserAuthStore()
const { googleButtonId, initializeGoogleSignIn, renderButton } = useGoogleAuth()

const { validate, formErrors } = useValidate(loginSchema)

const handleSubmitLogin = async () => {
  if (!validate(store.formUserLoginItem)) {
    showWarning('Vui lòng nhập thông tin đăng nhập hợp lệ')
    return
  }

  await store.submitLogin()
}

onMounted(() => {
  initializeGoogleSignIn()
  setTimeout(() => {
    renderButton(googleButtonId)
  }, 500)
})

onBeforeUnmount(() => {
  store.handleResetFormLoginItem()
})
</script>

<template>
  <Text
    class="mb-xl"
    align="center"
    color="primary"
    size="xxl"
    :text="AUTH_TEXT_LOGIN"
  />

  <client-only>
    <div class="auth-google">
      <div :id="googleButtonId" class="auth-google-button"></div>
      <Button
        icon="account_circle"
        :loading="store.loadingAuth"
        color="gray"
        :shadow="true"
        :label="AUTH_TEXT_LOGIN_GOOGLE"
        class="w-full"
      />
    </div>
  </client-only>

  <div class="text-center text-size-xs text-color-gray5 mt-md mb-md line-height-1">
    {{ AUTH_TEXT_LOGIN_EMAIL }}
  </div>

  <v-form @submit.prevent="handleSubmitLogin">
    <LabelInput :label="AUTH_TEXT_USERNAME" required />
    <v-text-field
      v-model="store.formUserLoginItem.email"
      label="email@gmail.com"
      variant="outlined"
      required
      :error="!!formErrors.email"
      :error-messages="formErrors.email"
    />

    <LabelInput :label="AUTH_TEXT_PASSWORD" class="flex justify-between" required>
      <slot>
        <NuxtLink
          tabindex="-1"
          :to="{ name: 'forgot-password' }"
          class="text-size-xs text-color-gray5"
        >
          {{ AUTH_TEXT_FORGOT_PASSWORD }}?
        </NuxtLink>
      </slot>
    </LabelInput>

    <v-text-field
      v-model="store.formUserLoginItem.password"
      :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="store.showPassword ? 'text' : 'password'"
      @click:append="store.showPassword = !store.showPassword"
      variant="outlined"
      label="Nhập mật khẩu"
      required
      :error="!!formErrors.password"
      :error-messages="formErrors.password"
    />

    <Button
      type="submit"
      :loading="store.loadingAuth"
      color="primary"
      :shadow="true"
      :label="AUTH_TEXT_LOGIN"
      class="w-full"
    />
  </v-form>

  <NuxtLink
    :to="{ name: 'register' }"
    class="block text-center text-size-xs text-color-gray5 mt-md line-height-1"
  >
    {{ AUTH_TEXT_REGISTER_HINT }}
    <span class="text-color-black weight-semibold">
      {{ AUTH_TEXT_REGISTER }}!
    </span>
  </NuxtLink>
</template>

