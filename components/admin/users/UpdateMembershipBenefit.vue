<script lang="ts" setup>
import { useBenefitStore } from '@/stores/admin/users/useBenefitStore'
import type { SubmitEventPromise } from 'vuetify'
import { nullRules } from '@/utils/validation'

const store = useBenefitStore()

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return

  await store.submitUpdate()
}
</script>

<template>
  <Popup
    popupId="popup-update-membership-benefit"
    v-model="store.isTogglePopupUpdate"
    popupHeading="Sửa lợi ích"
    align="right"
  >
    <template #body>
      <v-form
        validate-on="submit lazy"
        @submit.prevent="handleSubmitUpdate"
      >
        <LabelInput label="Tiêu đề" required />
        <v-text-field
          v-model="store.updateItem.name"
          :counter="200"
          :rules="nullRules"
          label="Nhập tiêu đề"
          variant="outlined"
          required
        />

        <LabelInput label="Mô tả" required />
        <v-textarea
          v-model="store.updateItem.description"
          label="Nhập mô tả"
          :rules="nullRules"
          variant="outlined"
          required
        />

        <LabelInput label="Biểu tượng (Icon)" required />
        <v-text-field
          v-model="store.updateItem.icon"
          label="Nhập icon"
          :rules="nullRules"
          variant="outlined"
          required
        />

        <Button
          type="submit"
          color="primary"
          label="Cập nhật"
          class="w-full"
        />
      </v-form>
    </template>
  </Popup>
</template>
