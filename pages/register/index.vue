<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'
import type { SubmitEventPromise } from 'vuetify';
import { AUTH_TEXT_LOGIN, AUTH_TEXT_LOGIN_GOOGLE, AUTH_TEXT_LOGIN_EMAIL, AUTH_TEXT_REGISTER, AUTH_TEXT_FULLNAME, AUTH_TEXT_PASSWORD, AUTH_TEXT_REGISTER_HINT2, GLOBAL_TEXT_MALE, GLOBAL_TEXT_FEMALE } from '@/const/text'
import { ROUTES } from '@/shared/constants/routes';
import { useGoogleAuth } from '@/composables/user/useGoogleAuth'
import { strongPasswordRules, emailRules, nullRules } from '@/utils/validation';

definePageMeta({
  layout: ROUTES.PUBLIC.REGISTER.layout,
})

const store = useUserAuthStore();
const { googleButtonId, initializeGoogleSignIn, renderButton } = useGoogleAuth()

const handleSubmitRegister = async (event: SubmitEventPromise) => {
    const result = await event
  if (!result.valid) return
  store.submitRegister()
}

onMounted(() => {
  initializeGoogleSignIn()

  setTimeout(() => {
    renderButton(googleButtonId)
  }, 500)
})
</script>
<template>
  <Text class="mb-xl" align="center" color="primary" size="xxl" :text="AUTH_TEXT_REGISTER" />

  <client-only>
  <div class="auth-google">
    <div :id="googleButtonId" class="auth-google-button"></div>
    <Button icon="account_circle" :loading="store.loadingAuth" color="gray" :shadow="true" :label="AUTH_TEXT_LOGIN_GOOGLE" class="w-full" />
  </div>
  </client-only>

  <div class="text-center text-size-xs text-color-gray5 mt-md mb-md line-height-1">
    {{ AUTH_TEXT_LOGIN_EMAIL }}
  </div>
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitRegister">
    <LabelInput :label="AUTH_TEXT_FULLNAME" required/>
    <v-text-field v-model="store.formUserItem.fullname" :rules="nullRules" label="Nhap ho va ten" variant="outlined" required></v-text-field>
    <LabelInput label="Email" required/>
    <v-text-field v-model="store.formUserItem.email" :rules="emailRules" label="Email" variant="outlined" required></v-text-field>
    <LabelInput :label="AUTH_TEXT_PASSWORD" required/>
    <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.formUserItem.password" :rules="strongPasswordRules" label="Mat khau" variant="outlined" required></v-text-field>
    <v-radio-group inline v-model="store.formUserItem.gender">
      <v-radio :label="GLOBAL_TEXT_MALE" value="male"></v-radio>
      <v-radio :label="GLOBAL_TEXT_FEMALE" value="female"></v-radio>
      <v-radio label="Khac" value="other"></v-radio>
    </v-radio-group>
    <Button type="submit" :loading="store.loadingAuth" color="primary" :shadow="true" :label="AUTH_TEXT_REGISTER" class="w-full" />
  </v-form>
  <router-link :to="{ name: 'login' }">
    <div class="block text-center text-size-xs text-color-gray5 mt-md line-height-1">{{ AUTH_TEXT_REGISTER_HINT2 }} <span class="text-color-black weight-semibold">{{AUTH_TEXT_LOGIN}}!</span></div>
  </router-link>
</template>