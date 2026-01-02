<script lang="ts" setup>
import { showWarning } from '@/utils/toast';
import { ROUTES } from '@/shared/constants/routes';
import { useAccountStore } from '@/stores/admin/account/useAccountStore';
import { useValidate } from '@/composables/validate/useValidate';
import { updateAccountSchema, changePasswordFESchema } from '@/shared/validate/schemas/account.schema';

definePageMeta({
  layout: ROUTES.ADMIN.BASE_INFORMATION.layout,
  middleware: ROUTES.ADMIN.BASE_INFORMATION.middleware,
})

const storeAccount = useAccountStore()
const {
  validate: validateUpdate,
  formErrors: updateErrors,
} = useValidate(updateAccountSchema)

const {
  validate: validatePassword,
  formErrors: passwordErrors,
} = useValidate(changePasswordFESchema)

const handleSubmitUpdate = async () => {
  if (!validateUpdate(storeAccount.formUpdate)) {
    showWarning('Vui lòng kiểm tra lại thông tin')
    return
  }

  await storeAccount.submitUpdate()
}

const submitChangePassword = async () => {
  const payload = {
    oldPassword: storeAccount.oldPassword,
    newPassword: storeAccount.newPassword,
    newPasswordConfirm: storeAccount.newPasswordConfirm,
  }
  if (!validatePassword(payload)) {
    showWarning('Vui lòng nhập mật khẩu hợp lệ')
    return
  }

  await storeAccount.submitChangePassword();
}

</script>
<template>
<HeaderAdmin label="Quản lý tài khoản" />

<client-only>
  <v-container>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <Card class="rd-lg" size="sm">
        <Text
          size="md"
          weight="semibold"
          class="mb-sm"
          text="Thông tin người dùng"
        />

        <div class="row row-xs">
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Ảnh đại diện" required />
            <v-text-field
              v-model="storeAccount.formUpdate.avatar"
              :error="!!updateErrors.avatar"
              :error-messages="updateErrors.avatar"
              label="Ảnh đại diện"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Họ và tên" required />
            <v-text-field
              v-model="storeAccount.formUpdate.fullname"
              :error="!!updateErrors.fullname"
              :error-messages="updateErrors.fullname"
              label="Nhập họ và tên"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Email" />
            <v-text-field
              :model-value="storeAccount.getDetailAccount?.email"
              variant="outlined"
              disabled
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Vai trò" />
            <v-text-field
              :model-value="storeAccount.getDetailAccount?.role"
              variant="outlined"
              disabled
              required
            />
          </div>

          <div class="col-12">
            <Button type="submit" color="black" label="Lưu thông tin" />
          </div>
        </div>
      </Card>
    </v-form>

    <v-form validate-on="submit lazy" @submit.prevent="submitChangePassword">
      <Card class="rd-lg mt-md" size="sm">
        <Text
          size="md"
          weight="semibold"
          class="mb-sm"
          text="Mật khẩu"
        />

        <div class="max-width-600 m-auto">
        <div class="row row-xs">
          <div class="col-12">
            <LabelInput label="Mật khẩu cũ" required />
            <v-text-field
              :append-icon="storeAccount.showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="storeAccount.showOldPassword ? 'text' : 'password'"
              @click:append="storeAccount.showOldPassword = !storeAccount.showOldPassword"
              v-model="storeAccount.oldPassword"
              :error="!!passwordErrors.oldPassword"
              :error-messages="passwordErrors.oldPassword"
              label="Mật khẩu cũ"
              autocomplete="old-password"
              required
            />
          </div>

          <div class="col-12">
            <LabelInput label="Mật khẩu mới" required />
            <v-text-field
              :append-icon="storeAccount.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="storeAccount.showPassword ? 'text' : 'password'"
              @click:append="storeAccount.showPassword = !storeAccount.showPassword"
              v-model="storeAccount.newPassword"
              :error="!!passwordErrors.newPassword"
              :error-messages="passwordErrors.newPassword"
              label="Mật khẩu mới"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="col-12">
            <LabelInput label="Xác nhận mật khẩu" required />
            <v-text-field
              :append-icon="storeAccount.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              :type="storeAccount.showPasswordConfirm ? 'text' : 'password'"
              @click:append="storeAccount.showPasswordConfirm = !storeAccount.showPasswordConfirm"
              v-model="storeAccount.newPasswordConfirm"
              :error="!!passwordErrors.newPasswordConfirm"
              :error-messages="passwordErrors.newPasswordConfirm"
              label="Xác nhận mật khẩu"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="col-12">
            <Button type="submit" color="black" label="Đổi mật khẩu" />
          </div>
        </div>
        </div>

      </Card>
    </v-form>
  </v-container>
</client-only>

</template>
