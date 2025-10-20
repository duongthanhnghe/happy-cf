import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { fileManageAPI } from "@/services/v1/shared/file-manage.service";
import {
  Loading
} from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";
import type { FileManageImage, FileManageFolder } from "@/server/types/dto/v1/file-manage.dto"
import { useAccountStore } from '@/stores/client/users/useAccountStore'

export const useFileManageFolderStore = defineStore("FileManageFolder", () => {
  
const accountStore = useAccountStore()
const txtSearch = ref<string>('');
const isTogglePopup = ref<boolean>(false);
const pageSize = 42
const dataList = ref<FileManageImage[]|null>(null);
const file = ref<File | null>(null)
const imageRules = [
  (v: File | null) => {
    if (!v) return 'Hình ảnh không được trống'
    return ['image/jpeg', 'image/jpg', 'image/png'].includes(v.type)
      || 'Chỉ chấp nhận JPG / JPEG / PNG'
  },
]
// const dataSelectImage = ref<string>('');
const dataSelectImage = ref<{ id: string, url: string } | null>(null)
const items = ref<FileManageImage[]|null>(null)
//folder
const dataListFolder = ref<FileManageFolder[]|null>(null);
const folderSelected = ref<string|null>(null);
const breadcrumb = ref<string[]|null>(null);

const handleTogglePopup = (value: boolean) => {
  isTogglePopup.value = value;
};

function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
  if(!items.value) return
  const start = items.value.length
  const nextItems = dataList.value?.slice(start, start + pageSize)
  if(!nextItems) return
  setTimeout(() => {
    if (nextItems.length > 0) {
      if(!items.value) return
      items.value.push(...nextItems)
      done('ok')
    } else {
      done('empty')
    }
  }, 500)
}

const getApiList = async (folderName:string) => {
  Loading(true);
  try {
    const res = await fileManageAPI.getImages(folderName, pageSize)
    dataList.value = res.images
    Loading(false);
  } catch (err) {
    console.error('Error submitting form:', err)
    Loading(false);
  }
}

const onChangeSearch = async (folderName: string) => {
  const folder = folderSelected.value != null ? folderSelected.value : folderName
  Loading(true)
  if(txtSearch.value === '') {
    showWarning('Vui long nhap tu khoa')
    Loading(false)
    return;
  }
  const keyQuery:string = txtSearch.value
  try {
    const res = await fileManageAPI.searchImage(keyQuery,folder)
    dataList.value = res.data
    Loading(false)
  } catch (err) {
    console.error('Error submitting form:', err)
    Loading(false)
  }
}

const handleCancelSearch = (folderName: string) => {
  const folder = folderSelected.value != null ? folderSelected.value : folderName
  txtSearch.value = ''
  getApiList(folder)
}

const deleteImage = async (id: string) => {
  Loading(true)
  try {
    const res = await fileManageAPI.deleteImage(id)
    if(res.success){
      showSuccess('Xoa thanh cong')
      if(dataList.value) dataList.value = dataList.value.filter((item) => item.public_id !== id)
    } 
    else showWarning('Xoa that bai')
    Loading(false)
  } catch (err) {
    console.error('Error submitting form:', err)
    Loading(false)
  }
}

watch(dataList, (newVal) => {
  if(!newVal) return
  items.value = [...newVal.slice(0, pageSize)]
})

const uploadImage = async (event: Event, folderName: string) => {
  Loading(true)
  const folder = folderSelected.value != null ? folderSelected.value : folderName
  
  const target = event?.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    file.value = files[0];
    let res = null;
    if(accountStore.getDetailValue?.id && folderName.includes(accountStore.getDetailValue?.id)) { //upload avatar
      res = await fileManageAPI.uploadAvatar(file.value, folder, accountStore.getDetailValue?.id)
      // if (res.success) getApiList(`Member/member${folder}`)
    } else { // upload global
      res = await fileManageAPI.uploadImage(file.value, folder) 
      // if (res.success) getApiList(folder)
    }
    if (res.success) {
      setTimeout(() => {
        showSuccess('Upload thanh cong')
        getApiList(folder)
      }, 2000);
      file.value = null
    } else {
      showWarning('Upload thất bại!')
      Loading(false)
    }
  } else {
    console.error('No files selected')
    Loading(false)
  }
};

const selectImage = async (url: string) => {
  dataSelectImage.value = { id: 'img' + Date.now(), url };
  isTogglePopup.value = false;
}

//folder
const getApiListFolder = async () => {
  Loading(true);
  try {
    const res = await fileManageAPI.getFolders()
    dataListFolder.value = res.data
    Loading(false);
  } catch (err) {
    console.error('Error submitting form:', err)
    Loading(false);
  }
}

const handleItemClick = (item: FileManageFolder) => {
  folderSelected.value = item.path
  breadcrumb.value = item.segments
  if(!txtSearch.value) {
    getApiList(item.path)
  } else {
    onChangeSearch(item.path)
  }
}

const getItems = computed(() => items.value)
const getSelectImage = computed(() => dataSelectImage.value)
const getListFolder = computed(() => dataListFolder.value)
const getBreadcrumb = computed(() => breadcrumb.value)

  return {
    txtSearch,
    isTogglePopup,
    pageSize,
    dataList,
    items,
    file,
    imageRules,
    dataSelectImage,
    dataListFolder,
    folderSelected,
    breadcrumb,
    handleTogglePopup,
    load,
    getApiList,
    onChangeSearch,
    handleCancelSearch,
    deleteImage,
    uploadImage,
    selectImage,
    getApiListFolder,
    handleItemClick,
    getItems,
    getSelectImage,
    getListFolder,
    getBreadcrumb,
  };
});
