<script lang="ts" setup>
import { useBenefitStore } from '@/stores/admin/users/useBenefitStore'
import type { SubmitEventPromise } from 'vuetify'
import { nullRules } from '@/utils/validation'

const store = useBenefitStore()

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return

  await store.submitCreate()
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupAdd"
    popupHeading="Thêm lợi ích"
    align="right"
  >
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">

        <LabelInput label="Tiêu đề" required />
        <v-text-field
          v-model="store.formItem.name"
          :counter="200"
          :rules="nullRules"
          label="Nhập tiêu đề"
          variant="outlined"
          required
        />

        <LabelInput label="Mô tả" required />
        <v-textarea
          v-model="store.formItem.description"
          label="Nhập mô tả"
          :rules="nullRules"
          variant="outlined"
          required
        />

        <LabelInput label="Biểu tượng (Icon)" required />
        <v-text-field
          v-model="store.formItem.icon"
          label="Nhập icon"
          :rules="nullRules"
          variant="outlined"
          required
        />

        <Button
          type="submit"
          color="primary"
          label="Lưu"
          class="w-full"
        />
      </v-form>
    </template>
  </Popup>
</template>
