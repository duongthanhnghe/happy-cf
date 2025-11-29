<script lang="ts" setup>
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
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
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Luu moi" class="w-full" />
      </div>

      <LabelInput label="Thuoc danh muc"/>
      <VTreeChoose :label="store.selectedCategoryName">
        <v-treeview
          :items="store.treeItems"
          item-value="id"
          item-title="categoryName"
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
        <v-text-field v-model="store.formCategoryItem.categoryName" :counter="50" :rules="store.nullAndSpecialRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.formCategoryItem.description" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
        
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formCategoryItem.image" :src="store.formCategoryItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formCategoryItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formCategoryItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage('image')"/>
        </div>

        <LabelInput label="Banner" required/>
        <v-img v-if="store.formCategoryItem.banner" :src="store.formCategoryItem.banner" class="mb-sm" alt="Banner" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formCategoryItem.banner" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formCategoryItem.banner ? 'Doi banner':'Chon banner'" @click.prevent="store.handleAddImage('banner')"/>
        </div>

        <v-switch :label="`Tinh trang: ${store.formCategoryItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formCategoryItem.isActive" inset
        ></v-switch>

        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.formCategoryItem.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.formCategoryItem.descriptionSEO"
          :counter="160"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.formCategoryItem.slug"
          label="Slug"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.formCategoryItem.keywords"
          label="Keywords"
          variant="outlined"
        />
    </v-form>
  </template>
</Popup>
</template>
