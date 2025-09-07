<script lang="ts" setup>
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore';

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
  }
})

const handleFileChange = (event: Event) => {
  store.uploadImage(event, props.folderName);
}

</script>
<template>
    <div class="file-manage-search flex gap-sm mb-md pt-md sticky bg-white">
      <Button color="secondary" :label="store.getItems?.length" :disabled="true" class="pd-0"/>
      <div class="search-input flex-1">
        <v-text-field
          v-model="store.txtSearch"
          label="Tim kiem anh..."
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter="store.onChangeSearch(props.folderName)"
          required>
        </v-text-field>
        <MaterialIcon v-if="store.txtSearch !== ''" @click="store.handleCancelSearch(props.folderName)" name="cancel" size="24" class="search-input-cancel" />
      </div>
      <div class="button-upload-file">
        <v-file-input ref="inputUploadFile" v-model="store.file" label="Chon hinh anh" :rules="store.imageRules" chips accept=".jpg, .jpeg, .png" @change="handleFileChange"></v-file-input>
        <Button color="black" label="Upload file" :shadow="true" />
      </div>
    </div>
    <template v-if="store.getItems && store.getItems.length > 0">
      <v-infinite-scroll
        height="auto"
        mode="manual"
        :class="{ 'hide-side': store.getItems.length < store.pageSize }"
        @load="store.load"
      >
        <div class="row row-sm mb-sm">
          <div :class="`${props.column} mb-sm`" v-for="(item, index) in store.getItems" :key="index">
            <FileImageItem :item="item" :chooseImage="props.chooseImage" />
          </div>
        </div>
        <template #load-more="{ props }">
          <Button color="secondary" label="Xem thêm" class="w-full" @click="props.onClick" />
        </template>
      </v-infinite-scroll>
    </template>
    <template v-else>
      <NoData />
    </template>
  </template>