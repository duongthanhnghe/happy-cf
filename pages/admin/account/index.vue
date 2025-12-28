<script lang="ts" setup>
import { computed } from 'vue'
import type { SubmitEventPromise } from 'vuetify'
import { showWarning } from '@/utils/toast';
import { ROUTES } from '@/shared/constants/routes';
import { nullRules, createNewPasswordRules } from '@/utils/validation';
import { useAccountStore } from '@/stores/admin/account/useAccountStore';

definePageMeta({
  layout: ROUTES.ADMIN.BASE_INFORMATION.layout,
  middleware: ROUTES.ADMIN.BASE_INFORMATION.middleware,
})

const storeAccount = useAccountStore()
const cardItemClass= 'card card-sm bg-white';
const newPasswordRules = computed(() =>
  createNewPasswordRules(storeAccount.newPasswordConfirm)
)
const confirmPasswordRules = computed(() =>
  createNewPasswordRules(storeAccount.newPassword)
)

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) {
    showWarning('Vui long dien day du thong tin')
    return
  }
  await storeAccount.submitUpdate()
}

const submitChangePassword = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) {
    showWarning('Vui long dien day du thong tin')
    return
  }
  await storeAccount.submitChangePassword(storeAccount.getDetailAccount?.id ?? '', storeAccount.oldPassword ?? '');
}

</script>
<template>

<HeaderAdmin label="Quan ly tai khoan" />

<v-container>
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
    <div :class="`${cardItemClass}`">
      <Text size="md" weight="semibold" class="mb-sm" text="Thông tin nguoi dung" />

      <div class="row row-xs">
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Anh dai dien" required/>
          <v-text-field v-model="storeAccount.formUpdate.avatar" :rules="nullRules" label="Avatar" variant="outlined" required></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Ho va ten" required/>
          <v-text-field v-model="storeAccount.formUpdate.fullname" :rules="nullRules" label="Nhap ho ten" variant="outlined" required></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Email" required/>
          <v-text-field v-model="storeAccount.formUpdate.email" label="Email" variant="outlined" required disabled></v-text-field>
        </div>
        <div class="col-12 col-md-6 col-xxl-4">
          <LabelInput label="Role" required/>
          <v-text-field v-model="storeAccount.formUpdate.role" label="Role" variant="outlined" required disabled></v-text-field>
        </div>
        <div class="col-12">
          <Button type="submit" color="black" label="Luu thong tin" />
        </div>
      </div>
    </div>
  </v-form>

  <v-form validate-on="submit lazy" @submit.prevent="submitChangePassword">
    <div :class="`${cardItemClass} mt-md`">
      <Text size="md" weight="semibold" class="mb-sm" text="Mat khau" />

      <div class="row row-xs">
        <div class="col-12">
          <LabelInput label="Mat khau cu" required/>
          <v-text-field :append-icon="storeAccount.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccount.showPassword ? 'text' : 'password'" @click:append="storeAccount.showPassword = !storeAccount.showPassword" v-model="storeAccount.oldPassword" 
          :rules="nullRules" label="Mat khau cu" autocomplete="old-password" required></v-text-field>
        </div>
        <div class="col-12">
          <LabelInput label="Mat khau moi" required/>
          <v-text-field :append-icon="storeAccount.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccount.showPassword ? 'text' : 'password'" @click:append="storeAccount.showPassword = !storeAccount.showPassword" v-model="storeAccount.newPassword" 
          :rules="newPasswordRules" label="Mat khau moi" autocomplete="new-password" required></v-text-field>
        </div>
        <div class="col-12">
          <LabelInput label="Xac nhan mat khau" required/>
          <v-text-field :append-icon="storeAccount.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'" :type="storeAccount.showPasswordConfirm ? 'text' : 'password'" @click:append="storeAccount.showPasswordConfirm = !storeAccount.showPasswordConfirm" v-model="storeAccount.newPasswordConfirm" 
          :rules="confirmPasswordRules" label="Xac nhan mat khau" autocomplete="new-password" required></v-text-field>
        </div>
        <div class="col-12">
          <Button type="submit" color="black" label="Doi mat khau" />
        </div>
      </div>
    </div>
  </v-form>

</v-container>
</template>
