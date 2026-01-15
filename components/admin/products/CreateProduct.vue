<script lang="ts" setup>
import { useValidate } from '@/composables/validate/useValidate';
import { createProductSchema } from '@/shared/validate/schemas/product.schema';
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { showWarning } from '@/utils/toast';

const store = useProductManageStore();
const { formErrors, validate } = useValidate(createProductSchema);
const handleSubmitCreate = async () => {

  if (!validate(store.formProductItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ');
    return;
  }

  store.submitCreate()
}

</script>
<template>
  <Popup v-model="store.isTogglePopupAdd" footerFixed popupHeading="Thêm sản phẩm" variant="modal-full-screen" bodyClass="bg-gray2" align="right">
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
        <div class="row row-sm">
          <div class="col-12 col-lg-8 mb-ms">
            <Card class="rd-lg">

            <LabelInput label="Tên sản phẩm" required/>
            <v-text-field
              v-model="store.formProductItem.productName"
              :counter="100"
              :error="!!formErrors.productName"
              :error-messages="formErrors.productName"
              label="Nhập tên sản phẩm"
              variant="outlined"
              required
            ></v-text-field>

            <div class="row row-xs">
              <div class="col-6">
                <LabelInput label="Giá gốc" required/>
                <v-text-field
                  v-model="store.formProductItem.price"
                  :error="!!formErrors.price"
                  :error-messages="formErrors.price"
                  type="number"
                  label="0"
                  variant="outlined"
                  required
                ></v-text-field>
              </div>

              <div class="col-6">
                <LabelInput label="Giá khuyến mãi" required/>
                <v-text-field
                  v-model="store.formProductItem.priceDiscounts"
                  :error="!!formErrors.priceDiscounts"
                  :error-messages="formErrors.priceDiscounts"
                  type="number"
                  label="0"
                  variant="outlined"
                  required
                ></v-text-field>
              </div>

              <div class="col-6">
                <LabelInput label="Tồn kho" required/>
                <v-text-field
                  v-model="store.formProductItem.amount"
                  :error="!!formErrors.amount"
                  :error-messages="formErrors.amount"
                  type="number"
                  label="Nhập tồn kho"
                  variant="outlined"
                  required
                ></v-text-field>
              </div>

              <div class="col-6">
                <LabelInput label="Cân nặng (gram)" required/>
                <v-text-field
                  v-model="store.formProductItem.weight"
                  :error="!!formErrors.weight"
                  :error-messages="formErrors.weight"
                  type="number"
                  label="Nhập cân nặng"
                  variant="outlined"
                  required
                ></v-text-field>
              </div>

              <div class="col-12">
                <LabelInput label="SKU"/>
                <v-text-field
                  v-model="store.formProductItem.sku"
                  :error="!!formErrors.sku"
                  :error-messages="formErrors.sku"
                  type="text"
                  label="SKU"
                  variant="outlined"
                ></v-text-field>
              </div>

              <div class="col-12 flex gap-sm align-anchor">
                <div class="flex-1">
                  <LabelInput label="Danh mục sản phẩm" required/>
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
                </div>
              </div>
            </div>

            <LabelInput label="Nội dung"/>
            <v-textarea
              v-model="store.formProductItem.description"
              :counter="5000"
              :error="!!formErrors.description"
              :error-messages="formErrors.description"
              label="Nhập nội dung"
              variant="outlined"
            ></v-textarea>

            <LabelInput label="Mô tả"/>
            <v-textarea
              v-model="store.formProductItem.summaryContent"
              :counter="500"
              :error="!!formErrors.summaryContent"
              :error-messages="formErrors.summaryContent"
              label="Nhập mô tả"
              variant="outlined"
            ></v-textarea>

            <v-switch
              :label="`Tình trạng: ${store.formProductItem.isActive ? 'Bật':'Tắt'} kích hoạt`"
              v-model="store.formProductItem.isActive"
              inset
            ></v-switch>

            <LabelInput label="SEO Title"/>
            <v-text-field
              v-model="store.formProductItem.titleSEO"
              :error="!!formErrors.titleSEO"
              :error-messages="formErrors.titleSEO"
              label="SEO Title"
              variant="outlined"
            />

            <LabelInput label="SEO Description"/>
            <v-textarea
              v-model="store.formProductItem.descriptionSEO"
              :counter="160"
              :error="!!formErrors.descriptionSEO"
              :error-messages="formErrors.descriptionSEO"
              label="SEO Description"
              variant="outlined"
            />

            <LabelInput label="Slug (URL)" required/>
            <v-text-field
              v-model="store.formProductItem.slug"
              :error="!!formErrors.slug"
              :error-messages="formErrors.slug"
              label="Slug"
              variant="outlined"
              required
            />

            <LabelInput label="Keywords (phân cách bằng dấu ,)"/>
            <v-text-field
              v-model="store.formProductItem.keywords"
              :error="!!formErrors.keywords"
              :error-messages="formErrors.keywords"
              label="Keywords"
              variant="outlined"
            />

            </Card>
          </div>   
          <div class="col-12 col-lg-4">
            <Card class="rd-lg">
              <LabelInput label="Ảnh đại diện" required/>
              <v-img
                v-if="store.formProductItem.image"
                :src="store.formProductItem.image"
                :error="!!formErrors.image"
                :error-messages="formErrors.image"
                class="mb-sm"
                alt="Hình ảnh"
                required
              />
              <div class="flex gap-sm">
                <v-text-field
                  v-model="store.formProductItem.image"
                  :error="!!formErrors.image"
                  :error-messages="formErrors.image"
                  label="Đường dẫn ảnh..."
                  variant="outlined"
                />
                <Button
                  color="black"
                  :label="store.formProductItem.image ? 'Đổi ảnh':'Chọn ảnh'"
                  @click.prevent="store.handleAddImage()"
                />
              </div>

              <LabelInput label="Ảnh liên quan"/>
              <div class="row row-xs" v-if="store.formProductItem.listImage?.length">
                <div class="col-6 col-md-4" v-for="item in store.formProductItem.listImage" :key="item.id">
                  <ControlImage :src="item.src" :label="item.src" class="mb-sm">
                    <template #action>
                      <Button
                        v-tooltip="'Xóa ảnh'"
                        color="secondary"
                        icon="delete"
                        size="sm"
                        @click="store.handleDeleteListImage(item.id, true)"
                      />
                    </template>
                  </ControlImage>
                </div>
              </div>
              <Button class="w-full" :border="false" color="gray" label="Thêm ảnh" @click.prevent="store.handleAddListImage()"/>
            </Card>
          </div>
        </div>
      </v-form>
    </template>
    <template #footer>
      <Button @click="handleSubmitCreate" color="primary" label="Lưu" class="w-full" />
    </template>
  </Popup>

<!-- 
<Popup v-model="store.isTogglePopupAdd" footerFixed popupHeading="Them san pham" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
        <LabelInput label="Ten san pham" required/>
        <v-text-field v-model="store.formProductItem.productName" :counter="100" :rules="store.nullAndSpecialRules" label="Nhap ten san pham" variant="outlined" required></v-text-field>
        <div class="row">
          <div class="col-6">
            <LabelInput label="Gia goc" required/>
            <v-text-field v-model="store.formProductItem.price" :rules="store.nullRules" type="number" label="0" variant="outlined"></v-text-field>
          </div>
          <div class="col-6">
            <LabelInput label="Gia khuyen mai" required/>
            <v-text-field v-model="store.formProductItem.priceDiscounts" :rules="store.productPriceDiscountRules" type="number" label="0" variant="outlined"></v-text-field>
          </div>
          <div class="col-6">
            <LabelInput label="So luong" required/>
            <v-text-field v-model="store.formProductItem.amount" :rules="store.nullRules" type="number" label="Nhap so luong" variant="outlined"></v-text-field>
          </div>
          <div class="col-6">
            <LabelInput label="Can nang (gram)" required/>
            <v-text-field v-model="store.formProductItem.weight" :rules="store.nullRules" type="number" label="Nhap can nang" variant="outlined"></v-text-field>
          </div>
          <div class="col-12">
            <LabelInput label="SKU" />
            <v-text-field v-model="store.formProductItem.sku" type="text" label="Sku" variant="outlined"></v-text-field>
          </div>
          <div class="col-12 flex gap-sm align-anchor">
            <div class="flex-1">
              <LabelInput label="Danh muc san pham" required/>
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
            </div>
          </div>
        </div>
        <LabelInput label="Noi dung"/>
        <v-textarea v-model="store.formProductItem.description" :counter="5000" label="Nhap noi dung" variant="outlined"></v-textarea>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.formProductItem.summaryContent" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formProductItem.image" :src="store.formProductItem.image" :rules="store.nullRules" class="mb-sm" alt="Hinh anh" required/>
        <div class="flex gap-sm">
          <v-text-field v-model="store.formProductItem.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
          <Button color="black" :label="store.formProductItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <LabelInput label="Anh lien quan" />

        <div class="row row-xs" v-if="store.formProductItem.listImage && store.formProductItem.listImage.length > 0">
          <div class="col-6 col-md-4" v-for="item in store.formProductItem.listImage" :key="item.id">
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xoa anh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id, true)"
                />
              </template>
            </ControlImage>
          </div>
        </div>

        <Button class="w-full" :border="false" color="gray" label="Them anh" @click.prevent="store.handleAddListImage()"/>

        <v-switch :label="`Tinh trang: ${store.formProductItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formProductItem.isActive" inset
        ></v-switch>

        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.formProductItem.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.formProductItem.descriptionSEO"
          :counter="160"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.formProductItem.slug"
          label="Slug"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.formProductItem.keywords"
          label="Keywords"
          variant="outlined"
        />

    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Luu" class="w-full" />
  </template>
</Popup> -->
</template>
