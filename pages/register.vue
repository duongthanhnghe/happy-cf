<script lang="ts" setup>
import {
  useUserAuthStore
} from '@/stores/client/users/useUserAuthStore'
import type { SubmitEventPromise } from 'vuetify';
import { AUTH_TEXT_LOGIN, AUTH_TEXT_LOGIN_GOOGLE, AUTH_TEXT_LOGIN_EMAIL, AUTH_TEXT_REGISTER, AUTH_TEXT_FULLNAME, AUTH_TEXT_PASSWORD, AUTH_TEXT_REGISTER_HINT2, GLOBAL_TEXT_MALE, GLOBAL_TEXT_FEMALE } from '@/const/text'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  layout: ROUTES.PUBLIC.REGISTER.layout,
})

const store = useUserAuthStore();

const handleSubmitRegister = async (event: SubmitEventPromise) => {
    const result = await event
  if (!result.valid) return
  store.submitRegister()
}

</script>
<template>
      <Heading class="mb-xl text-center" tag="div" color="primary" size="2xl">{{AUTH_TEXT_REGISTER}}</Heading>
      <Button icon="account_circle" color="gray" :shadow="true" :label="AUTH_TEXT_LOGIN_GOOGLE" class="w-full" />
      <div class="text-center text-size-xs text-color-gray5 mt-md mb-md line-height1">
        {{ AUTH_TEXT_LOGIN_EMAIL }}
      </div>
      <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitRegister">
        <LabelInput :label="AUTH_TEXT_FULLNAME" required/>
        <v-text-field v-model="store.formUserItem.fullname" :rules="store.fullnameRules" label="Nhap ho va ten" variant="outlined" required></v-text-field>
        <LabelInput label="Email" required/>
        <v-text-field v-model="store.formUserItem.email" :rules="store.emailRules" label="Email" variant="outlined" required></v-text-field>
        <LabelInput :label="AUTH_TEXT_PASSWORD" required/>
        <v-text-field :append-icon="store.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="store.showPassword ? 'text' : 'password'" @click:append="store.showPassword = !store.showPassword" v-model="store.formUserItem.password" :rules="store.passwordRules" label="Mat khau" variant="outlined" required></v-text-field>
        <v-radio-group inline v-model="store.formUserItem.gender">
          <v-radio :label="GLOBAL_TEXT_MALE" value="male"></v-radio>
          <v-radio :label="GLOBAL_TEXT_FEMALE" value="female"></v-radio>
        </v-radio-group>
        <Button type="submit" color="primary" :shadow="true" :label="AUTH_TEXT_REGISTER" class="w-full" />
      </v-form>
      <router-link :to="{ name: 'login' }">
        <div class="block text-center text-size-xs text-color-gray5 mt-md line-height1">{{ AUTH_TEXT_REGISTER_HINT2 }} <span class="text-color-black weight-semibold">{{AUTH_TEXT_LOGIN}}!</span></div>
      </router-link>
</template>