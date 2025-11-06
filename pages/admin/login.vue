<script lang="ts" setup>
import { useAdminAuthStore } from '@/stores/admin/admin-auth/useAdminAuthStore'
import type { SubmitEventPromise } from 'vuetify';
import { AUTH_TEXT_LOGIN, AUTH_TEXT_PASSWORD, AUTH_TEXT_USERNAME, AUTH_TEXT_FORGOT_PASSWORD, AUTH_TEXT_LOGIN_GOOGLE, AUTH_TEXT_LOGIN_EMAIL, AUTH_TEXT_REGISTER_HINT } from '@/const/text'
import { ROUTES } from '@/shared/constants/routes';
import { nullRules, emailRules } from '@/utils/validation';

definePageMeta({
  layout: ROUTES.PUBLIC.LOGIN.layout,
})

const store = useAdminAuthStore();

const handleSubmitLogin = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitLogin()
}

</script>
<template>
  <Heading class="mb-xl text-center" tag="div" color="primary" size="2xl">{{AUTH_TEXT_LOGIN}}</Heading>

  <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitLogin">
    <LabelInput :label="AUTH_TEXT_USERNAME" required/>
    <v-text-field v-model="store.formLogin.email" :rules="emailRules" label="email@gmail.com" variant="outlined" required></v-text-field>
    <LabelInput :label="AUTH_TEXT_PASSWORD" class="flex justify-between" required />
    <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.formLogin.password" :rules="nullRules" label="Nhap mat khau" required></v-text-field>
    <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_LOGIN" class="w-full" />
  </v-form>
</template>