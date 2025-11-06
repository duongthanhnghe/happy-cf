<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import type { SubmitEventPromise } from 'vuetify'
import { showWarning } from '@/utils/toast';
import { ROUTES } from '@/shared/constants/routes';
import { nullRules, createNewPasswordRules } from '@/utils/validation';
import { useAdminAuthStore } from '@/stores/admin/admin-auth/useAdminAuthStore';

definePageMeta({
  layout: ROUTES.ADMIN.SETTINGS.layout,
  middleware: ROUTES.ADMIN.SETTINGS.middleware,
})

const storeAdminAuth = useAdminAuthStore()
const cardItemClass= 'card card-sm bg-white';
const newPasswordRules = computed(() =>
  createNewPasswordRules(storeAdminAuth.newPasswordConfirm)
)
const confirmPasswordRules = computed(() =>
  createNewPasswordRules(storeAdminAuth.newPassword)
)

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) {
    showWarning('Vui long dien day du thong tin')
    return
  }
  await storeAdminAuth.submitUpdate()
}

const submitChangePassword = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) {
    showWarning('Vui long dien day du thong tin')
    return
  }
  await storeAdminAuth.submitChangePassword(storeAdminAuth.getDetailAccount?.id ?? '', storeAdminAuth.oldPassword ?? '');
}

onMounted(async () => {
  if(!storeAdminAuth.getDetailAccount?.id) await storeAdminAuth.refreshAccount()
})

</script>
<template>

<HeaderAdmin />

<v-container>
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
    <div :class="`${cardItemClass}`">
      <Heading class="mb-sm" tag="div" weight="semibold" size="md">Thông tin nguoi dung</Heading>
      <div class="row row-xs">
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Anh dai dien" required/>
          <v-text-field v-model="storeAdminAuth.formUpdate.avatar" :rules="nullRules" label="Avatar" variant="outlined" required></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Ho va ten" required/>
          <v-text-field v-model="storeAdminAuth.formUpdate.fullname" :rules="nullRules" label="Nhap ho ten" variant="outlined" required></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Email" required/>
          <v-text-field v-model="storeAdminAuth.formUpdate.email" label="Email" variant="outlined" required disabled></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Role" required/>
          <v-text-field v-model="storeAdminAuth.formUpdate.role" label="Role" variant="outlined" required disabled></v-text-field>
        </div>
        <div class="col-12">
          <Button type="submit" color="black" label="Luu thong tin" />
        </div>
      </div>
    </div>
  </v-form>

  <v-form validate-on="submit lazy" @submit.prevent="submitChangePassword">
    <div :class="`${cardItemClass} mt-md`">
      <Heading class="mb-sm" tag="div" weight="semibold" size="md">Mat khau</Heading>
      <div class="row row-xs">
        <div class="col-12">
          <LabelInput label="Mat khau cu" required/>
          <v-text-field :append-icon="storeAdminAuth.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAdminAuth.showPassword ? 'text' : 'password'" @click:append="storeAdminAuth.showPassword = !storeAdminAuth.showPassword" v-model="storeAdminAuth.oldPassword" 
          :rules="nullRules" label="Mat khau cu" autocomplete="old-password" required></v-text-field>
        </div>
        <div class="col-12">
          <LabelInput label="Mat khau moi" required/>
          <v-text-field :append-icon="storeAdminAuth.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAdminAuth.showPassword ? 'text' : 'password'" @click:append="storeAdminAuth.showPassword = !storeAdminAuth.showPassword" v-model="storeAdminAuth.newPassword" 
          :rules="newPasswordRules" label="Mat khau moi" autocomplete="new-password" required></v-text-field>
        </div>
        <div class="col-12">
          <LabelInput label="Xac nhan mat khau" required/>
          <v-text-field :append-icon="storeAdminAuth.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAdminAuth.showPasswordConfirm ? 'text' : 'password'" @click:append="storeAdminAuth.showPasswordConfirm = !storeAdminAuth.showPasswordConfirm" v-model="storeAdminAuth.newPasswordConfirm" 
          :rules="confirmPasswordRules" label="Xac nhan mat khau" autocomplete="new-password" required></v-text-field>
        </div>
        <div class="col-12">
          <Button type="submit" color="black" label="Doi mat khau" />
        </div>
      </div>
    </div>
  </v-form>

  <Button type="submit" color="primary" :shadow="true" label="Dang xuat" class="mt-md" @click="storeAdminAuth.handleLogout()" />

</v-container>
</template>
