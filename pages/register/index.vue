<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'
import { useValidate } from '@/composables/validate/useValidate'
import { registerSchema } from '@/shared/validate/schemas/user.schema'
import { showWarning } from '@/utils/toast'

import {
  AUTH_TEXT_LOGIN,
  AUTH_TEXT_LOGIN_GOOGLE,
  AUTH_TEXT_LOGIN_EMAIL,
  AUTH_TEXT_REGISTER,
  AUTH_TEXT_FULLNAME,
  AUTH_TEXT_PASSWORD,
  AUTH_TEXT_REGISTER_HINT2,
  GLOBAL_TEXT_MALE,
  GLOBAL_TEXT_FEMALE,
} from '@/const/text'

import { ROUTES } from '@/shared/constants/routes'
import { useGoogleAuth } from '@/composables/user/useGoogleAuth'

definePageMeta({
  layout: ROUTES.PUBLIC.REGISTER.layout,
})

const store = useUserAuthStore()
const { googleButtonId, initializeGoogleSignIn, renderButton } = useGoogleAuth()

const { validate, formErrors } = useValidate(registerSchema)

const handleSubmitRegister = async () => {
  if (!validate(store.formUserItem)) {
    showWarning('Vui lòng nhập thông tin đăng ký hợp lệ')
    return
  }

  await store.submitRegister()
}

onMounted(() => {
  initializeGoogleSignIn()
  setTimeout(() => {
    renderButton(googleButtonId)
  }, 500)
})

onBeforeUnmount(() => {
  store.handleResetFormUserItem()
})
</script>
<template>
  <Text
    class="mb-xl"
    align="center"
    color="primary"
    size="xxl"
    :text="AUTH_TEXT_REGISTER"
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

  <v-form @submit.prevent="handleSubmitRegister">
    <!-- Fullname -->
    <LabelInput :label="AUTH_TEXT_FULLNAME" required />
    <v-text-field
      v-model="store.formUserItem.fullname"
      label="Nhập họ và tên"
      variant="outlined"
      required
      :error="!!formErrors.fullname"
      :error-messages="formErrors.fullname"
    />

    <!-- Email -->
    <LabelInput label="Email" required />
    <v-text-field
      v-model="store.formUserItem.email"
      label="Email"
      variant="outlined"
      required
      :error="!!formErrors.email"
      :error-messages="formErrors.email"
    />

    <!-- Password -->
    <LabelInput :label="AUTH_TEXT_PASSWORD" required />
    <v-text-field
      v-model="store.formUserItem.password"
      :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="store.showPassword ? 'text' : 'password'"
      @click:append="store.showPassword = !store.showPassword"
      label="Mật khẩu"
      variant="outlined"
      required
      :error="!!formErrors.password"
      :error-messages="formErrors.password"
    />

    <!-- Gender -->
    <v-radio-group inline v-model="store.formUserItem.gender" >
      <v-radio :label="GLOBAL_TEXT_MALE" value="male" class="mr-sm"/>
      <v-radio :label="GLOBAL_TEXT_FEMALE" value="female" class="mr-sm"/>
      <v-radio label="Khác" value="other" />
    </v-radio-group>

    <Button
      type="submit"
      :loading="store.loadingAuth"
      color="primary"
      :shadow="true"
      :label="AUTH_TEXT_REGISTER"
      class="w-full"
    />
  </v-form>

  <NuxtLink :to="{ name: 'login' }">
    <div class="block text-center text-size-xs text-color-gray5 mt-md line-height-1">
      {{ AUTH_TEXT_REGISTER_HINT2 }}
      <span class="text-color-black weight-semibold">
        {{ AUTH_TEXT_LOGIN }}!
      </span>
    </div>
  </NuxtLink>
</template>
