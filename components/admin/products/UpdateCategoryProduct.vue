<script lang="ts" setup>
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import type { SubmitEventPromise } from 'vuetify';

const store = useCategoryManageStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitUpdate();
}

</script>
<template>
<Popup popupId="popup-update-category" v-model="store.isTogglePopupUpdate" popupHeading="Sua danh muc" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>

      <LabelInput label="Thuoc danh muc"/>
      <VTreeChoose :label="store.selectedCategoryName">
        <v-treeview
          :items="store.treeItemsForEdit"
          item-value="id"
          item-title="categoryName"
          :item-props="(item: any) => ({disabled: item.id === store.updateCategoryItem.id})"
          selectable
          return-object
          select-strategy="single-independent"
          v-model:selected="store.selectedCategory"
          open-all
          density="compact"
        >
        </v-treeview>
      </VTreeChoose>

      <LabelInput label="Ten danh muc" required/>
      <v-text-field v-model="store.updateCategoryItem.categoryName" :counter="50" :rules="store.nullAndSpecialRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>
      <LabelInput label="Mo ta"/>
      <v-textarea v-model="store.updateCategoryItem.description" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
      <LabelInput label="Anh dai dien" required/>
      <v-img v-if="store.updateCategoryItem.image" :src="store.updateCategoryItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required />
      <div class="flex gap-sm">
        <v-text-field v-model="store.updateCategoryItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
        <Button color="black" :label="store.updateCategoryItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
      </div>
      <v-switch :label="`Tinh trang: ${store.updateCategoryItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updateCategoryItem.isActive" inset
      ></v-switch>

      <LabelInput label="SEO Title" />
      <v-text-field
        v-model="store.updateCategoryItem.titleSEO"
        label="SEO Title"
        variant="outlined"
      />

      <LabelInput label="SEO Description" />
      <v-textarea
        v-model="store.updateCategoryItem.descriptionSEO"
        :counter="160"
        label="SEO Description"
        variant="outlined"
      />

      <LabelInput label="Slug (URL)" required/>
      <v-text-field
        v-model="store.updateCategoryItem.slug"
        label="Slug"
        variant="outlined"
        :rules="store.nullRules"
        required
      />

      <LabelInput label="Keywords (phân cách bằng dấu ,)" />
      <v-text-field
        v-model="store.updateCategoryItem.keywords"
        label="Keywords"
        variant="outlined"
      />
    </v-form>
  </template>
</Popup>
</template>
