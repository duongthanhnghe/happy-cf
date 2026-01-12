import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { fileManageAPI } from "@/services/v1/admin/file-manage.service";
import { Loading } from '@/utils/global'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import type { FileManageImage, FileManageFolder } from "@/server/types/dto/v1/file-manage.dto"

export const useFileManageFolderStore = defineStore("FileManageFolderAdmin", () => {
  
const txtSearch = ref<string>('');
const isTogglePopup = ref<boolean>(false);
const pageSize = 42
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
const items = ref<FileManageImage[]>([])
const dataListFolder = ref<FileManageFolder[]|null>(null);
const folderSelected = ref<string|null>(null);
const breadcrumb = ref<string[]|null>(null);
const nextCursor = ref<string | null>(null)
const isEnd = ref(false)
const currentFolder = ref<string | null>(null)
const isLoaded = ref(false)

const handleTogglePopup = async (value: boolean, folderName?: string) => {
  isTogglePopup.value = value;

  if (!isLoaded.value && folderName) {
    await getApiList(folderName)
    isLoaded.value = true
  }
};

const load = async ({ done }: { done: (status: 'ok' | 'empty') => void }) => {
  if (isEnd.value || !currentFolder.value) {
    done('empty')
    return
  }

  const res = await fileManageAPI.getImages(
    currentFolder.value,
    pageSize,
    nextCursor.value || undefined
  )

  if (res.data.length) {
    items.value.push(...res.data)
    nextCursor.value = res.next_cursor
    isEnd.value = !res.next_cursor
    done('ok')
  } else {
    isEnd.value = true
    done('empty')
  }
}

 const getApiList = async (folderName: string) => {
  if (!folderName) return

  Loading(true)

  currentFolder.value = folderName
  items.value = []
  nextCursor.value = null
  isEnd.value = false

  try {
    const res = await fileManageAPI.getImages(folderName, pageSize)
    items.value = res.data
    nextCursor.value = res.next_cursor ?? null
    isEnd.value = !res.next_cursor
  } finally {
    Loading(false)
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
    nextCursor.value = null
    isEnd.value = true

    const res = await fileManageAPI.searchImage(keyQuery,folder)
    items.value = res.success ? res.data : []
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
    if (res.success) {
      items.value = items.value.filter(i => i.public_id !== id)
      showSuccess('Xóa thành công')
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
    const res = await fileManageAPI.uploadImage(files.value, folder) 

    if (res.success) {
      const uploadedFiles = res.data as FileManageImage[]
      showSuccess(`${res.data.length} ảnh đã tải lên thành công`)
      items.value.unshift(...uploadedFiles)
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
  items.value = []
  selectedIdsDelete.value = []
  dataSelectImage.value = null
  isLoaded.value = false
}

const getItems = computed(() => items.value)
const getSelectImage = computed(() => dataSelectImage.value)
const getListFolder = computed(() => dataListFolder.value)
const getBreadcrumb = computed(() => breadcrumb.value)

  return {
    txtSearch,
    isTogglePopup,
    pageSize,
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
