<script lang="ts" setup>
import { useValidate } from '@/composables/validate/useValidate';
import { createCategoryProductSchema } from '@/shared/validate/schemas/category-product.schema';
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import { showWarning } from '@/utils/toast';
const store = useCategoryManageStore();
const { formErrors, validate } = useValidate(createCategoryProductSchema);

const handleSubmitCreate = async () => {
  if (!validate(store.formCategoryItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ');
    return;
  }

  await store.submitCreate();
}

</script>
<template>
  <Popup v-model="store.isTogglePopupAdd" footerFixed popupHeading="Thêm danh mục" align="right">
    <template #body>
      <v-form @submit.prevent="handleSubmitCreate">

        <LabelInput label="Thuộc danh mục"/>
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
          />
        </VTreeChoose>

        <LabelInput label="Tên danh mục" required/>
        <v-text-field
          v-model="store.formCategoryItem.categoryName"
          :counter="50"
          :error="!!formErrors.categoryName"
          :error-messages="formErrors.categoryName"
          label="Nhập tên danh mục"
          variant="outlined"
          required
        />

        <LabelInput label="Mô tả"/>
        <v-textarea
          v-model="store.formCategoryItem.description"
          :counter="500"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
          label="Nhập mô tả"
          variant="outlined"
        />

        <LabelInput label="Ảnh đại diện" required/>
        <v-img
          v-if="store.formCategoryItem.image"
          :src="store.formCategoryItem.image"
          class="mb-sm"
          alt="Hình ảnh"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.formCategoryItem.image"
            :error="!!formErrors.image"
            :error-messages="formErrors.image"
            label="Đường dẫn ảnh..."
            variant="outlined"
          />
          <Button
            color="black"
            :label="store.formCategoryItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage('image')"
          />
        </div>

        <LabelInput label="Banner"/>
        <v-img
          v-if="store.formCategoryItem.banner"
          :src="store.formCategoryItem.banner"
          class="mb-sm"
          alt="Banner"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.formCategoryItem.banner"
            :error="!!formErrors.banner"
            :error-messages="formErrors.banner"
            label="Đường dẫn ảnh..."
            variant="outlined"
          />
          <Button
            color="black"
            :label="store.formCategoryItem.banner ? 'Đổi banner' : 'Chọn banner'"
            @click.prevent="store.handleAddImage('banner')"
          />
        </div>

        <v-switch
          :label="`Tình trạng: ${store.formCategoryItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
          v-model="store.formCategoryItem.isActive"
          inset
        />

        <LabelInput label="SEO Title"/>
        <v-text-field
          v-model="store.formCategoryItem.titleSEO"
          :error="!!formErrors.titleSEO"
          :error-messages="formErrors.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description"/>
        <v-textarea
          v-model="store.formCategoryItem.descriptionSEO"
          :counter="160"
          :error="!!formErrors.descriptionSEO"
          :error-messages="formErrors.descriptionSEO"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.formCategoryItem.slug"
          :error="!!formErrors.slug"
          :error-messages="formErrors.slug"
          label="Slug"
          variant="outlined"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)"/>
        <v-text-field
          v-model="store.formCategoryItem.keywords"
          :error="!!formErrors.keywords"
          :error-messages="formErrors.keywords"
          label="Keywords"
          variant="outlined"
        />

      </v-form>
    </template>

    <template #footer>
      <Button
        @click="handleSubmitCreate"
        color="primary"
        label="Lưu mới"
        class="w-full"
      />
    </template>
  </Popup>
<!-- <Popup v-model="store.isTogglePopupAdd" footerFixed popupHeading="Them danh muc" align="right">
  <template #body>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">

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
          <v-text-field v-model="store.formCategoryItem.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
          <Button color="black" :label="store.formCategoryItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage('image')"/>
        </div>

        <LabelInput label="Banner" required/>
        <v-img v-if="store.formCategoryItem.banner" :src="store.formCategoryItem.banner" class="mb-sm" alt="Banner" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formCategoryItem.banner" label="Duong dan anh..." variant="outlined" ></v-text-field>
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
  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Luu moi" class="w-full" />
  </template>
</Popup> -->
</template>
