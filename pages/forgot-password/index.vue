<script lang="ts" setup>
import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'
import type { SubmitEventPromise } from 'vuetify';
import {
  AUTH_TEXT_SEND_EMAIL,
  AUTH_TEXT_FORGOT_SUGGEST,
  AUTH_TEXT_FORGOT_PASSWORD,
  AUTH_TEXT_EMAIL_HINT,
} from '@/const/text'
import { ROUTES } from '@/shared/constants/routes';
import { emailRules } from '@/utils/validation';

definePageMeta({
  layout: ROUTES.PUBLIC.FORGOT_PASSWORD.layout,
})

const store = useUserAuthStore();

const handleSubmitForgotPassword = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitForgotPassword();
}
</script>
<template>
    <Text class="mb-xl" align="center" color="primary" size="xxl" :text="AUTH_TEXT_FORGOT_PASSWORD" />

    <div class="text-center text-size-xs text-color-gray5 mb-md">
      {{ AUTH_TEXT_FORGOT_SUGGEST }}
    </div>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitForgotPassword">
      <LabelInput label="Email" required/>
      <v-text-field v-model="store.emailForgot" :rules="emailRules" :label="AUTH_TEXT_EMAIL_HINT" variant="outlined" required></v-text-field>
      <Button type="submit" :loading="store.loadingAuth" color="primary" :shadow="true" :label="AUTH_TEXT_SEND_EMAIL" class="w-full" />
    </v-form>
</template>
