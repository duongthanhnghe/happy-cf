<script lang="ts" setup>
import { useUserAuthStore } from '@/stores/users/useUserAuthStore'
import type { SubmitEventPromise } from 'vuetify';
import { AUTH_TEXT_LOGIN, AUTH_TEXT_REGISTER, AUTH_TEXT_PASSWORD, AUTH_TEXT_USERNAME, AUTH_TEXT_FORGOT_PASSWORD, AUTH_TEXT_LOGIN_GOOGLE, AUTH_TEXT_LOGIN_EMAIL, AUTH_TEXT_REGISTER_HINT } from '@/const/text'

definePageMeta({
  layout: 'auth-layout'
})

const store = useUserAuthStore();

const handleSubmitLogin = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitLogin()
}
</script>
<template>
      <Heading class="mb-xl text-center" tag="div" color="primary" size="2xl">{{AUTH_TEXT_LOGIN}}</Heading>
      <Button icon="account_circle" color="gray" :shadow="true" :label="AUTH_TEXT_LOGIN_GOOGLE" class="w-full" />
      <div class="text-center text-size-xs text-color-gray5 mt-md mb-md line-height1">
        {{ AUTH_TEXT_LOGIN_EMAIL }}
      </div>
      <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitLogin">
        <LabelInput :label="AUTH_TEXT_USERNAME" required/>
        <v-text-field v-model="store.formUserItem.email" :rules="store.emailRules" label="email@gmail.com" variant="outlined" required></v-text-field>
        <LabelInput :label="AUTH_TEXT_PASSWORD" class="flex justify-between" required>
          <slot>
            <NuxtLink tabindex="-1" :to="{ name: 'forgot-password' }" class="text-size-xs text-color-gray5">{{AUTH_TEXT_FORGOT_PASSWORD}}?</NuxtLink>
          </slot>
        </LabelInput>
        <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.formUserItem.password" :rules="store.passwordRules" label="Nhap mat khau" required></v-text-field>
        <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_LOGIN" class="w-full" />
      </v-form>
      <NuxtLink :to="{ name: 'register' }" class="block text-center text-size-xs text-color-gray5 mt-md line-height1">
        {{ AUTH_TEXT_REGISTER_HINT }} <span class="text-color-black weight-semibold">{{AUTH_TEXT_REGISTER}}!</span>
      </NuxtLink>
</template>