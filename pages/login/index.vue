<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'
import type { SubmitEventPromise } from 'vuetify';
import { AUTH_TEXT_LOGIN, AUTH_TEXT_REGISTER, AUTH_TEXT_PASSWORD, AUTH_TEXT_USERNAME, AUTH_TEXT_FORGOT_PASSWORD, AUTH_TEXT_LOGIN_GOOGLE, AUTH_TEXT_LOGIN_EMAIL, AUTH_TEXT_REGISTER_HINT } from '@/const/text'
import { ROUTES } from '@/shared/constants/routes';
import { useGoogleAuth } from '@/composables/user/useGoogleAuth'
import { strongPasswordRules, emailRules } from '@/utils/validation';

definePageMeta({
  layout: ROUTES.PUBLIC.LOGIN.layout,
})

const store = useUserAuthStore();
const { googleButtonId, initializeGoogleSignIn, renderButton } = useGoogleAuth()

const handleSubmitLogin = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitLogin()
}

onMounted(() => {
  initializeGoogleSignIn()

  setTimeout(() => {
    renderButton(googleButtonId)
  }, 500)
})
</script>
<template>
  <Heading class="mb-xl text-center" tag="div" color="primary" size="2xl">{{AUTH_TEXT_LOGIN}}</Heading>

  <client-only>
  <div class="auth-google">
    <div :id="googleButtonId" class="auth-google-button"></div>
    <Button icon="account_circle" :loading="store.loadingAuth" color="gray" :shadow="true" :label="AUTH_TEXT_LOGIN_GOOGLE" class="w-full" />
  </div>
  </client-only>
  <div class="text-center text-size-xs text-color-gray5 mt-md mb-md line-height-1">
    {{ AUTH_TEXT_LOGIN_EMAIL }}
  </div>
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitLogin">
    <LabelInput :label="AUTH_TEXT_USERNAME" required/>
    <v-text-field v-model="store.formUserLoginItem.email" :rules="emailRules" label="email@gmail.com" variant="outlined" required></v-text-field>
    <LabelInput :label="AUTH_TEXT_PASSWORD" class="flex justify-between" required>
      <slot>
        <NuxtLink tabindex="-1" :to="{ name: 'forgot-password' }" class="text-size-xs text-color-gray5">{{AUTH_TEXT_FORGOT_PASSWORD}}?</NuxtLink>
      </slot>
    </LabelInput>
    <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.formUserLoginItem.password" :rules="strongPasswordRules" label="Nhap mat khau" required></v-text-field>
    <Button type="submit" :loading="store.loadingAuth" color="primary" :shadow="true" :label="AUTH_TEXT_LOGIN" class="w-full" />
  </v-form>
  <NuxtLink :to="{ name: 'register' }" class="block text-center text-size-xs text-color-gray5 mt-md line-height-1">
    {{ AUTH_TEXT_REGISTER_HINT }} <span class="text-color-black weight-semibold">{{AUTH_TEXT_REGISTER}}!</span>
  </NuxtLink>
</template>