<script lang="ts" setup>
import { useAccountListStore } from '@/stores/admin/account/useAccountListStore'
import { ACCOUNT_ROLE } from '@/shared/constants/account-role'
import { useValidate } from '@/composables/validate/useValidate'
import { createAccountSchema } from '@/shared/validate/schemas/account.schema'
import { showWarning } from '@/utils/toast'

const store = useAccountListStore()

const { validate, formErrors } = useValidate(createAccountSchema)

const handleSubmit = async () => {
  if (!validate(store.formCreate)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  await store.submitCreate()
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupCreate"
    footerFixed
    popupHeading="Tạo tài khoản"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmit">

        <!-- Họ tên -->
        <LabelInput label="Họ và tên" required />
        <v-text-field
          v-model="store.formCreate.fullname"
          label="Nhập họ và tên"
          variant="outlined"
          required
          :error="!!formErrors.fullname"
          :error-messages="formErrors.fullname"
        />

        <!-- Email -->
        <LabelInput label="Email" required />
        <v-text-field
          v-model="store.formCreate.email"
          label="Email"
          variant="outlined"
          required
          :error="!!formErrors.email"
          :error-messages="formErrors.email"
        />

        <!-- Mật khẩu -->
        <LabelInput label="Mật khẩu" required />
        <v-text-field
          v-model="store.formCreate.password"
          label="Mật khẩu"
          variant="outlined"
          disabled
          required
          :error="!!formErrors.password"
          :error-messages="formErrors.password"
        />

        <!-- Role -->
        <v-radio-group
          v-model="store.formCreate.role"
          inline
          :error="!!formErrors.role"
        >
          <v-radio
            v-for="item in ACCOUNT_ROLE"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="mr-sm"
          />
        </v-radio-group>

        <div v-if="formErrors.role" class="text-error text-size-sm">
          {{ formErrors.role }}
        </div>

      </v-form>
    </template>
    <template #footer>
      <Button
        @click="handleSubmit"
        color="primary"
        label="Tạo tài khoản"
        class="w-full"
      />
    </template>
  </Popup>
</template>
