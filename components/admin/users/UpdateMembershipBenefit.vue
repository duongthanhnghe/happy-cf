<script lang="ts" setup>
import { useBenefitStore } from '@/stores/admin/users/useBenefitStore'
import type { SubmitEventPromise } from 'vuetify'
import { nullRules } from '@/utils/validation';

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
    popupHeading="Sửa loi ich"
    align="right"
  >
    <template #body>
      <v-form
        validate-on="submit lazy"
        @submit.prevent="handleSubmitUpdate"
      >
        <div class="portal-popup-footer">
          <Button type="submit" color="primary" label="Cập nhật" class="w-full" />
        </div>

        <LabelInput label="Tieu de" required/>
        <v-text-field v-model="store.updateItem.name" :counter="200" :rules="nullRules" label="Nhap tieu de" variant="outlined" required></v-text-field>

        <LabelInput label="Mo ta" required/>
        <v-textarea v-model="store.updateItem.description" label="Nhap mo ta" :rules="nullRules" variant="outlined" required></v-textarea>

        <LabelInput label="Icon" required/>
        <v-text-field v-model="store.updateItem.icon" label="Nhap icon" :rules="nullRules" variant="outlined" required></v-text-field>
      </v-form>
    </template>
  </Popup>
</template>
