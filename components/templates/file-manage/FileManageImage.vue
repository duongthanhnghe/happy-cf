<script lang="ts" setup>
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { ref } from 'vue';

const store = useFileManageFolderStore()

const props = defineProps({
  folderName: {
    type: String,
    default: '',
  },
  chooseImage: {
    type: Boolean,
    default: false,
  },
  column: {
    type: String,
    default: 'col-6 col-md-4 col-lg-3 col-xxl-2',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
})
const showReloadButton = ref(false)

const handleFileChange = async () => {
  const success = await store.uploadImage(props.folderName)
  if (success) {
    showReloadButton.value = true
  }
}

const reloadData = () => {
  store.getApiList(props.folderName)
  showReloadButton.value = false
}

</script>
<template>
  <div class="file-manage-search flex gap-sm mb-md pt-md sticky bg-white z-index-4">
    <Button
      color="secondary"
      :label="store.getItems?.length"
      :disabled="true"
      class="pd-0"
    />

    <div class="search-input flex-1">
      <v-text-field
        v-model="store.txtSearch"
        label="Tìm kiếm ảnh..."
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        @keydown.enter="store.onChangeSearch(props.folderName)"
        required
      />
      <MaterialIcon
        v-if="store.txtSearch !== ''"
        @click="store.handleCancelSearch(props.folderName)"
        name="cancel"
        class="search-input-cancel"
      />
    </div>

    <div class="button-upload-file">
      <v-file-input
        v-model="store.files"
        label="Chọn hình ảnh"
        :rules="store.imageRules"
        chips
        accept=".jpg, .jpeg, .png, .avif"
        multiple
        @change="handleFileChange"
      />
      <Button
        color="black"
        label="Tải lên"
        :shadow="true"
      />
    </div>
  </div>

  <template v-if="store.getItems && store.getItems.length > 0">
    <v-infinite-scroll
      height="auto"
      mode="manual"
      :class="{ 'hide-side': store.getItems.length < store.pageSize }"
      @load="store.load"
    >
      <div class="row row-xs mb-sm">
        <div
          :class="`${props.column} mb-sm`"
          v-for="(item, index) in store.getItems"
          :key="index"
        >
          <FileImageItem
            :item="item"
            :chooseImage="props.chooseImage"
            :isAdmin="props.isAdmin"
          />
        </div>
      </div>

      <template #load-more="{ props }">
        <Button
          color="secondary"
          label="Xem thêm"
          class="w-full"
          @click="props.onClick"
        />
      </template>
    </v-infinite-scroll>
  </template>

  <template v-else>
    <NoData />
    <div class="flex justify-center">
      <Button
        v-if="showReloadButton"
        color="secondary"
        label="Tải lại"
        class="mt-ms"
        @click.prevent="reloadData"
      />
    </div>
  </template>
</template>