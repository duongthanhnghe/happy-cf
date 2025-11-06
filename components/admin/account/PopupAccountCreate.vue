<script lang="ts" setup>
import type { SubmitEventPromise } from 'vuetify';
import { strongPasswordRules, emailRules, nullRules } from '@/utils/validation';
import { useAccountListStore } from '@/stores/admin/account/useAccountListStore'
import { ACCOUNT_ROLE } from '@/shared/constants/account-role'

const store = useAccountListStore();

const handleSubmit = async (event: SubmitEventPromise) => {
  const result = await event;
  if (!result.valid) return;
  store.submitCreate()
}

</script>
<template>
  <Popup popupId="popup-create-account" v-model="store.isTogglePopupCreate" popupHeading="Tao tai khoan" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmit">
      <LabelInput label="AUTH_TEXT_FULLNAME" required/>
      <v-text-field v-model="store.formCreate.fullname" :rules="nullRules" label="Nhap ho va ten" variant="outlined" required></v-text-field>

      <LabelInput label="Email" required/>
      <v-text-field v-model="store.formCreate.email" :rules="emailRules" label="Email" variant="outlined" required></v-text-field>

      <LabelInput label="AUTH_TEXT_PASSWORD" required/>
      <v-text-field v-model="store.formCreate.password" :rules="strongPasswordRules" label="Mat khau" variant="outlined" disabled required></v-text-field>
      
      <v-radio-group v-model="store.formCreate.role" inline>
        <v-radio 
          v-for="item in ACCOUNT_ROLE"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </v-radio-group>

      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Tao tai khoan" class="w-full" />
      </div>
    </v-form>
  </template>
</Popup>
</template>