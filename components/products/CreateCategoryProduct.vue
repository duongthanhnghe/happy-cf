<script lang="ts" setup>
import {
  useCategoryManageStore
} from '@/stores/product/useCategoryManageStore'
import type { SubmitEventPromise } from 'vuetify';

const store = useCategoryManageStore();

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitCreate();
}

</script>
<template>
<Popup popupId="popup-create-category" v-model="store.isTogglePopupAdd" popupHeading="Them danh muc" align="right">
  <template #body>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Luu moi" class="w-full" />
      </div>
        <LabelInput label="Ten danh muc" required/>
        <v-text-field v-model="store.formCategoryItem.categoryName" :counter="50" :rules="store.categoryNameRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.formCategoryItem.description" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formCategoryItem.image" :src="store.formCategoryItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formCategoryItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formCategoryItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.formCategoryItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formCategoryItem.isActive" inset
        ></v-switch>
    </v-form>
  </template>
</Popup>
</template>
