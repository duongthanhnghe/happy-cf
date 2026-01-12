import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { fileManageAPI } from "@/services/v1/file-manage.service";
import { Loading } from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";
import type { FileManageImage } from "@/server/types/dto/v1/file-manage.dto"
import { useAccountStore } from '@/stores/client/users/useAccountStore'

export const useFileManageClientStore = defineStore("FileManageClient", () => {
  
  const accountStore = useAccountStore()
  const txtSearch = ref<string>('');
  const isTogglePopup = ref<boolean>(false);
  const pageSize = 20
  const file = ref<File | null>(null)
  const files = ref<File[]>([])
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
  const nextCursor = ref<string | null>(null)
  const isEnd = ref(false)
  const currentFolder = ref<string | null>(null)

  const handleTogglePopup = async (value: boolean) => {
    isTogglePopup.value = value;
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
    if (!folderName) return showWarning('Không thể tìm kiếm!')
    if (!txtSearch.value) return showWarning('Vui lòng nhập từ khóa')

    Loading(true)

    try {
      currentFolder.value = folderName
      nextCursor.value = null
      isEnd.value = true

      const res = await fileManageAPI.searchImage(
        txtSearch.value,
        folderName
      )

      items.value = res.success ? res.data : []
    } finally {
      Loading(false)
    }
  }

  const handleCancelSearch = async (folderName: string) => {
    txtSearch.value = ''
    await getApiList(folderName)
  }

  const deleteImage = async (id: string) => {
    Loading(true)
    try {
      const res = await fileManageAPI.deleteImage(id)
      if (res.success) {
        items.value = items.value.filter(i => i.public_id !== id)
        showSuccess('Xóa thành công')
      } else {
        showWarning('Xóa thất bại')
      }
    } finally {
      Loading(false)
    }
  }

  const uploadImage = async (folderName: string) => {
    if (!folderName || !accountStore.getUserId) {
      showWarning('Không thể upload hình ảnh, vui lòng thử lại!')
      return false
    }

    if (!files.value || files.value.length === 0) {
      showWarning('Vui lòng chọn ít nhất 1 hình ảnh')
      return false
    }

    if (files.value.some(file => file.size > MAX_FILE_SIZE)) {
      showWarning('Mỗi ảnh phải nhỏ hơn hoặc bằng 3MB')
      return false
    }

    Loading(true)
    const folder = folderName

    try {
      const res = await fileManageAPI.uploadAvatar(files.value, folder, accountStore.getUserId)
    
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

  const resetState = () => {
    txtSearch.value = ''
    items.value = []
    dataSelectImage.value = null
  }

  const getItems = computed(() => items.value)
  const getSelectImage = computed(() => dataSelectImage.value?.url)

  return {
    txtSearch,
    isTogglePopup,
    pageSize,
    items,
    file,
    files,
    imageRules,
    dataSelectImage,
    handleTogglePopup,
    load,
    getApiList,
    onChangeSearch,
    handleCancelSearch,
    deleteImage,
    uploadImage,
    selectImage,
    resetState,
    getItems,
    getSelectImage,
  };
});
