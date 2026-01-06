import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { fileManageAPI } from "@/services/v1/admin/file-manage.service";
import { Loading } from '@/utils/global'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import type { FileManageImage, FileManageFolder } from "@/server/types/dto/v1/file-manage.dto"
import { useAccountStore } from '@/stores/client/users/useAccountStore'

export const useFileManageFolderStore = defineStore("FileManageFolder", () => {
  
const accountStore = useAccountStore()
const txtSearch = ref<string>('');
const isTogglePopup = ref<boolean>(false);
const pageSize = 42
const dataList = ref<FileManageImage[]|null>(null);
const file = ref<File | null>(null)
const files = ref<File[]>([])
const loadingFolder = ref<boolean>(false)
const selectedIdsDelete = ref<string[]>([])
const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
const imageRules = [
  (v: File[] | null) => {
    if (!v || v.length === 0) return 'Hình ảnh không được để trống'
    for (const file of v) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/avif'].includes(file.type)) {
        return 'Chỉ chấp nhận JPG / JPEG / PNG / AVIF'
      }
      if (file.size > MAX_FILE_SIZE) {
        return 'Dung lượng ảnh tối đa là 3MB'
      }
    }
    return true
  }
]
const dataSelectImage = ref<{ id: string, url: string } | null>(null)
const items = ref<FileManageImage[]|null>(null)
const dataListFolder = ref<FileManageFolder[]|null>(null);
const folderSelected = ref<string|null>(null);
const breadcrumb = ref<string[]|null>(null);

const handleTogglePopup = async (value: boolean) => {
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
  if(!folderName || folderName === '') return false

  try {
    const res = await fileManageAPI.getImages(folderName, pageSize)
    dataList.value = res.images
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    Loading(false);
  }
}

const onChangeSearch = async (folderName: string) => {
  const folder = folderSelected.value != null ? folderSelected.value : folderName
  Loading(true)
  if(txtSearch.value === '') {
    showWarning('Vui lòng nhập từ khóa')
    Loading(false)
    return;
  }
  const keyQuery:string = txtSearch.value
  try {
    const res = await fileManageAPI.searchImage(keyQuery,folder)
    if(res.success) dataList.value = res.data
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    Loading(false);
  }
}

const handleCancelSearch = async (folderName: string) => {
  const folder = folderSelected.value != null ? folderSelected.value : folderName
  txtSearch.value = ''
  await getApiList(folder)
}

const deleteImage = async (id: string) => {
  Loading(true)
  try {
    const res = await fileManageAPI.deleteImage(id)
    if(res.success){
      showSuccess('Xóa thành công')
      if(dataList.value) dataList.value = dataList.value.filter((item) => item.public_id !== id)
    } 
    else showWarning('Xóa thất bại')
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    Loading(false)
  }
}

const deleteImages = async () => {
  const confirm = await showConfirm('Bạn có chắc chắn muốn xóa không?')
  if (!confirm) return

  if (selectedIdsDelete.value.length === 0) {
    showWarning('Vui lòng chọn ít nhất 1 ảnh')
    return
  }

  Loading(true)
  try {
    const publicIds = selectedIdsDelete.value

    const res = await fileManageAPI.deleteImages(publicIds)

    if (res.success) {
      showSuccess(`Đã xóa ${publicIds.length} ảnh`)
      if(folderSelected.value) await getApiList(folderSelected.value)
      selectedIdsDelete.value = []
    } else {
      showWarning('Xóa ảnh thất bại')
    }
  } finally {
    Loading(false)
  }
}

watch(
  dataList,
  (newVal) => {
    items.value = newVal?.slice(0, pageSize) ?? []
  }
)

const uploadImage = async (folderName: string) => {
  if (!files.value || files.value.length === 0) {
    showWarning('Vui lòng chọn ít nhất 1 hình ảnh')
    return false
  }

  if (files.value.some(file => file.size > MAX_FILE_SIZE)) {
    showWarning('Mỗi ảnh phải nhỏ hơn hoặc bằng 3MB')
    return false
  }

  Loading(true)
  const folder = folderSelected.value ?? folderName

  try {
    let res = null;
    if(accountStore.getDetailValue?.id && folderName.includes(accountStore.getDetailValue?.id)) { //upload avatar for user
      res = await fileManageAPI.uploadAvatar(files.value, folder, accountStore.getDetailValue?.id)
    } else { // upload admin
      res = await fileManageAPI.uploadImage(files.value, folder) 
    }

    if (res.success) {
      const uploadedFiles = res.files as FileManageImage[]
      showSuccess(`${res.files.length} ảnh đã tải lên thành công`)
      if (dataList.value) {
        dataList.value = [
          ...uploadedFiles,
          ...dataList.value,
        ]
      }
      files.value = []
      return true
    }

    showWarning(res.message ?? 'Tải lên thất bại')
    return false
  } catch (err) {
    console.error(err)
    return false
  } finally {
    Loading(false)
  }
}

const selectImage = async (url: string) => {
  dataSelectImage.value = { id: 'img' + Date.now(), url };
  isTogglePopup.value = false;
}

//folder
const getApiListFolder = async () => {
  loadingFolder.value = true
  try {
    const res = await fileManageAPI.getFolders()
    if(res.success) dataListFolder.value = res.data
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    loadingFolder.value = false
  }
}

const handleItemClick = async (item: FileManageFolder) => {
  selectedIdsDelete.value = []
  folderSelected.value = item.path
  breadcrumb.value = item.segments
  if(!txtSearch.value) {
    await getApiList(item.path)
  } else {
    onChangeSearch(item.path)
  }
}

const resetState = () => {
  txtSearch.value = ''
  items.value = null
  dataList.value = null
  selectedIdsDelete.value = []
  dataSelectImage.value = null
}

const getItems = computed(() => items.value)
const getSelectImage = computed(() => dataSelectImage.value?.url)
const getListFolder = computed(() => dataListFolder.value)
const getBreadcrumb = computed(() => breadcrumb.value)

  return {
    txtSearch,
    isTogglePopup,
    pageSize,
    dataList,
    items,
    file,
    files,
    imageRules,
    dataSelectImage,
    dataListFolder,
    folderSelected,
    breadcrumb,
    loadingFolder,
    selectedIdsDelete,
    handleTogglePopup,
    load,
    getApiList,
    onChangeSearch,
    handleCancelSearch,
    deleteImage,
    deleteImages,
    uploadImage,
    selectImage,
    getApiListFolder,
    handleItemClick,
    resetState,
    getItems,
    getSelectImage,
    getListFolder,
    getBreadcrumb,
  };
});
