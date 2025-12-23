<script lang="ts" setup>
import { useBannerManageStore } from '@/stores/admin/banner/useBannerManageStore'
import type { SubmitEventPromise } from 'vuetify'

const store = useBannerManageStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitUpdate();
}
</script>
<template>
<Popup v-model="store.isTogglePopupUpdate" popupHeading="Sua banner" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>
        
        <LabelInput label="Tieu de" required/>
        <v-text-field v-model="store.formBannerItem.title" :counter="200" :rules="store.nullRules" label="Tieu de banner" variant="outlined" required></v-text-field>
        
        <LabelInput label="Noi dung"/>
        <v-textarea v-model="store.formBannerItem.description" label="Nhap noi dung" variant="outlined"></v-textarea>
        
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formBannerItem.image" :src="store.formBannerItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formBannerItem.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
          <Button color="black" :label="store.formBannerItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.formBannerItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formBannerItem.isActive" inset
        ></v-switch>
    </v-form>
  </template>
</Popup>
</template>
