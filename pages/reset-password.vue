<script lang="ts" setup>
import {
  useUserAuthStore
} from '@/stores/users/useUserAuthStore'
import type {
  SubmitEventPromise
} from 'vuetify';
import {
  AUTH_TEXT_RESET_PASSWORD,
  AUTH_TEXT_PASSWORD_HINT,
  AUTH_TEXT_CHANGE_PASSWORD,
  AUTH_TEXT_PASSWORD_NEW,
  AUTH_TEXT_CONFIRM_PASSWORD,
} from '@/const/text'

definePageMeta({
  layout: 'auth-layout'
})

const store = useUserAuthStore();

const handleSubmitResetPassword = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitResetPassword();
}
</script>
<template>
    <Heading class="mb-xl text-center" tag="div" color="primary" size="2xl">{{AUTH_TEXT_RESET_PASSWORD}}</Heading>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitResetPassword">
      <LabelInput :label="AUTH_TEXT_PASSWORD_NEW" required/>
      <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.newPassword" :rules="store.newPasswordRules" :label="AUTH_TEXT_PASSWORD_HINT" variant="outlined" required></v-text-field>
      <LabelInput :label="AUTH_TEXT_CONFIRM_PASSWORD" required/>
      <v-text-field :append-icon="store.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'" :type="store.showPasswordConfirm ? 'text' : 'password'" @click:append="store.showPasswordConfirm = !store.showPasswordConfirm" v-model="store.newPasswordConfirm" :rules="store.newPasswordRules" :label="AUTH_TEXT_PASSWORD_HINT" variant="outlined" required></v-text-field>
      <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_CHANGE_PASSWORD" class="w-full" />
    </v-form>
</template>
