<script lang="ts" setup>
import {
  useUserAuthStore
} from '@/stores/users/useUserAuthStore'
import type {
  SubmitEventPromise
} from 'vuetify';
import {
  AUTH_TEXT_SEND_EMAIL,
  AUTH_TEXT_FORGOT_SUGGEST,
  AUTH_TEXT_FORGOT_PASSWORD,
  AUTH_TEXT_EMAIL_HINT,
} from '@/const/text'

definePageMeta({
  layout: 'auth-layout'
})

const store = useUserAuthStore();

const handleSubmitForgotPassword = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitForgotPassword();
}
</script>
<template>
    <Heading class="mb-xl text-center" tag="div" color="primary" size="2xl">{{AUTH_TEXT_FORGOT_PASSWORD}}</Heading>
    <div class="text-center text-size-xs text-color-gray5 mb-md">
        {{ AUTH_TEXT_FORGOT_SUGGEST }}
      </div>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitForgotPassword">
      <LabelInput label="Email" required/>
      <v-text-field v-model="store.emailForgot" :rules="store.emailRules" :label="AUTH_TEXT_EMAIL_HINT" variant="outlined" required></v-text-field>
      <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_SEND_EMAIL" class="w-full" />
    </v-form>
</template>
