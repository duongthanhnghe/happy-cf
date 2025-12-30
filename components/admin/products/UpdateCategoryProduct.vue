<script lang="ts" setup>
import { useValidate } from '@/composables/validate/useValidate';
import { updateCategoryProductSchema } from '@/shared/validate/schemas/category-product.schema';
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import { copyText } from '@/utils/global';
import { showWarning } from '@/utils/toast';

const store = useCategoryManageStore();
const { validate, formErrors } = useValidate(updateCategoryProductSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.updateCategoryItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }
  
  await store.submitUpdate();
}

</script>
<template>
  <Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Sửa danh mục" align="right">
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">

        <LabelInput label="Thuộc danh mục"/>
        <VTreeChoose :label="store.selectedCategoryName">
          <v-treeview
            :items="store.treeItemsForEdit"
            item-value="id"
            item-title="categoryName"
            :item-props="(item: any) => ({ disabled: item.id === store.updateCategoryItem.id })"
            selectable
            return-object
            select-strategy="single-independent"
            v-model:selected="store.selectedCategory"
            open-all
            density="compact"
          />
        </VTreeChoose>

        <div class="flex justify-between mb-xs">
          <LabelInput label="Tên danh mục" required/>
          <v-chip label @click="copyText(`t('${store.updateCategoryItem.id}')`)">
            ID: {{ store.updateCategoryItem.id }}
            <MaterialIcon name="content_copy" class="ml-xs" />
          </v-chip>
        </div>

        <v-text-field
          v-model="store.updateCategoryItem.categoryName"
          :counter="50"
          :error="!!formErrors.categoryName"
          :error-messages="formErrors.categoryName"
          label="Nhập tên danh mục"
          variant="outlined"
          required
        />

        <LabelInput label="Mô tả"/>
        <v-textarea
          v-model="store.updateCategoryItem.description"
          :counter="500"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
          label="Nhập mô tả"
          variant="outlined"
        />

        <LabelInput label="Ảnh đại diện" required/>
        <v-img
          v-if="store.updateCategoryItem.image"
          :src="store.updateCategoryItem.image"
          class="mb-sm"
          alt="Hình ảnh"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.updateCategoryItem.image"
            :error="!!formErrors.image"
            :error-messages="formErrors.image"
            label="Đường dẫn ảnh..."
            variant="outlined"
          />
          <Button
            color="black"
            :label="store.updateCategoryItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage('image')"
          />
        </div>

        <LabelInput label="Banner"/>
        <v-img
          v-if="store.updateCategoryItem.banner"
          :src="store.updateCategoryItem.banner"
          class="mb-sm"
          alt="Banner"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.updateCategoryItem.banner"
            :error="!!formErrors.banner"
            :error-messages="formErrors.banner"
            label="Đường dẫn ảnh..."
            variant="outlined"
          />
          <Button
            color="black"
            :label="store.updateCategoryItem.banner ? 'Đổi banner' : 'Chọn banner'"
            @click.prevent="store.handleAddImage('banner')"
          />
        </div>

        <v-switch
          :label="`Tình trạng: ${store.updateCategoryItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
          v-model="store.updateCategoryItem.isActive"
          inset
        />

        <LabelInput label="SEO Title" required/>
        <v-text-field
          v-model="store.updateCategoryItem.titleSEO"
          :error="!!formErrors.titleSEO"
          :error-messages="formErrors.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description"/>
        <v-textarea
          v-model="store.updateCategoryItem.descriptionSEO"
          :counter="160"
          :error="!!formErrors.descriptionSEO"
          :error-messages="formErrors.descriptionSEO"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.updateCategoryItem.slug"
          :error="!!formErrors.slug"
          :error-messages="formErrors.slug"
          label="Slug"
          variant="outlined"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)"/>
        <v-text-field
          v-model="store.updateCategoryItem.keywords"
          :error="!!formErrors.keywords"
          :error-messages="formErrors.keywords"
          label="Keywords"
          variant="outlined"
        />

      </v-form>
    </template>

    <template #footer>
      <Button
        @click="handleSubmitUpdate"
        color="primary"
        label="Cập nhật"
        class="w-full"
      />
    </template>
  </Popup>
<!-- <Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Sua danh muc" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitUpdate">
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

      <div class="flex justify-between mb-xs">
        <LabelInput label="Ten danh muc" required/>
        <v-chip label @click="copyText(`t('${store.updateCategoryItem.id}')`)">
          ID: {{ store.updateCategoryItem.id }}
          <MaterialIcon name="content_copy" class="ml-xs" />
        </v-chip>
      </div>
      <v-text-field v-model="store.updateCategoryItem.categoryName" :counter="50" :rules="store.nullAndSpecialRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>
      <LabelInput label="Mo ta"/>
      <v-textarea v-model="store.updateCategoryItem.description" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
      
      <LabelInput label="Anh dai dien" required/>
      <v-img v-if="store.updateCategoryItem.image" :src="store.updateCategoryItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required />
      <div class="flex gap-sm">
        <v-text-field v-model="store.updateCategoryItem.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
        <Button color="black" :label="store.updateCategoryItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage('image')"/>
      </div>

      <LabelInput label="Banner" required/>
      <v-img v-if="store.updateCategoryItem.banner" :src="store.updateCategoryItem.banner" class="mb-sm" alt="Banner" />
      <div class="flex gap-sm">
        <v-text-field v-model="store.updateCategoryItem.banner" label="Duong dan anh..." variant="outlined" ></v-text-field>
        <Button color="black" :label="store.updateCategoryItem.banner ? 'Doi banner':'Chon banner'" @click.prevent="store.handleAddImage('banner')"/>
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
  <template #footer>
    <Button @click="handleSubmitUpdate" color="primary" label="Cập nhật" class="w-full" />
  </template>
</Popup> -->
</template>
