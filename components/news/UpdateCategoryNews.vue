<script lang="ts" setup>
import {
  useCategoryManageStore
} from '@/stores/news/useCategoryManageStore'
import type { SubmitEventPromise } from 'vuetify';

const store = useCategoryManageStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event
  if(result.valid === false) return
  await store.submitUpdate();
}

</script>
<template>
<Popup popupId="popup-update-category" v-model="store.isTogglePopupUpdate" popupHeading="Sua danh muc" align="right">
  <template #body>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>
        
      <LabelInput label="Ten danh muc" required/>
      <v-text-field v-model="store.updateItem.categoryName" :counter="200" :rules="store.categoryNameRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>
      
      <LabelInput label="Mo ta"/>
      <v-textarea v-model="store.updateItem.summaryContent" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
      
      <LabelInput label="Noi dung"/>
      <v-textarea v-model="store.updateItem.description" label="Nhap noi dung" variant="outlined"></v-textarea>
    
      <LabelInput label="Anh dai dien"/>
      <v-img v-if="store.updateItem.image" :src="store.updateItem.image" class="mb-sm" alt="Hinh anh" />
      <div class="flex gap-sm">
        <v-text-field v-model="store.updateItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
        <Button color="black" :label="store.updateItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
      </div>
      <v-switch :label="`Tinh trang: ${store.updateItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updateItem.isActive" inset
        ></v-switch>
    </v-form>
  </template>
</Popup>
</template>
