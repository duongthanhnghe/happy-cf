<script lang="ts" setup>
import { useAccountStore } from '@/stores/admin/account/useAccountStore'
import type { SubmitEventPromise } from 'vuetify';
import { AUTH_TEXT_LOGIN, AUTH_TEXT_PASSWORD, AUTH_TEXT_USERNAME } from '@/const/text'
import { ROUTES } from '@/shared/constants/routes';
import { strongPasswordRules, emailRules } from '@/utils/validation';

definePageMeta({
  layout: ROUTES.ADMIN.LOGIN.layout,
})

const store = useAccountStore();

const handleSubmitLogin = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitLogin()
}

</script>
<template>
  <Text class="mb-xl" align="center" color="primary" size="xxl" :text="AUTH_TEXT_LOGIN" />

  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitLogin">
    <LabelInput :label="AUTH_TEXT_USERNAME" required/>
    <v-text-field v-model="store.formLogin.email" :rules="emailRules" label="email@gmail.com" variant="outlined" required></v-text-field>
    <LabelInput :label="AUTH_TEXT_PASSWORD" class="flex justify-between" required />
    <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.formLogin.password" :rules="strongPasswordRules" label="Nhap mat khau" required></v-text-field>
    <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_LOGIN" class="w-full" />
  </v-form>
</template>