<template>
  <div class="mb-md">
    <div v-if="!isReady" class="loading-editor">
      <!-- <v-progress-circular indeterminate></v-progress-circular> -->
      <span>Đang tải editor...</span>
    </div>
    <div v-show="isReady" ref="editorElement"></div>
    
    <!-- Hidden file input -->
    <input 
      ref="fileInput" 
      type="file" 
      accept="image/*" 
      multiple 
      style="display: none" 
      @change="handleFileSelect"
    />
    
    <!-- Loading overlay khi đang upload -->
    <div v-if="isUploading" class="upload-overlay">
      <!-- <v-progress-circular indeterminate size="50"></v-progress-circular> -->
      <p>Đang upload hình ảnh... ({{ uploadProgress.current }}/{{ uploadProgress.total }})</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fileManageAPI } from "@/services/file-manage.service";
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

interface Props {
  modelValue: string
  config?: object
  uploadUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  uploadUrl: 'Default'
})

const emit = defineEmits(['update:modelValue', 'ready', 'focus', 'blur'])

const editorElement = ref(null)
const fileInput = ref(null)
const isReady = ref(false)
const isUploading = ref(false)
const uploadProgress = ref({ current: 0, total: 0 })
let editorInstance: any = null

const tempImages = new Map<string, { file: File, tempUrl: string }>()

const defaultConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'fontSize',
    'fontFamily',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'alignment',
    '|',
    'numberedList',
    'bulletedList',
    '|',
    'outdent',
    'indent',
    '|',
    'todoList',
    'link',
    'imageUpload',
    'blockQuote',
    'insertTable',
    'mediaEmbed',
    '|',
    'undo',
    'redo'
  ],
  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'toggleImageCaption',
      'imageTextAlternative'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells'
    ]
  },
  ...props.config
}

class TemporaryUploadAdapter {
  private loader: any

  constructor(loader: any) {
    this.loader = loader
  }

  upload() {
    return this.loader.file.then((file: File) => this.createTemporaryUrl(file))
  }

  abort() {
  }

  private async createTemporaryUrl(file: File): Promise<{ default: string }> {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const blobUrl = URL.createObjectURL(file)
    const tempUrl = `${blobUrl}#${tempId}`

    tempImages.set(tempId, { file, tempUrl })
  
    return { default: tempUrl }
  }
}

// Plugin function để đăng ký temporary upload adapter
function TemporaryUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new TemporaryUploadAdapter(loader)
  }
}

// Upload thực sự lên server
const uploadFileToServer = async (file: File): Promise<string> => {
  // const formData = new FormData()
  // formData.append('file', file)

  const response = await fileManageAPI.uploadImage(file, props.uploadUrl)

  if (!response.success || !response.url) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  // const result = await response.json()
  return response.url

  // const response = await fetch(props.uploadUrl, {
  //   method: 'POST',
  //   body: formData
  // })

  // if (!response.ok) {
  //   throw new Error(`Upload failed: ${response.statusText}`)
  // }

  // const result = await response.json()
  // return result.url
}

const uploadAllImages = async (): Promise<boolean> => {
  if (tempImages.size === 0) return true

  try {
    isUploading.value = true
    uploadProgress.value = { current: 0, total: tempImages.size }

    let content = editorInstance.getData()
    const uploadPromises: Promise<void>[] = []

    for (const [tempId, { file, tempUrl }] of tempImages.entries()) {
      const uploadPromise = uploadFileToServer(file).then(realUrl => {
        // Replace đúng tempUrl gốc (có #tempId) bằng realUrl
        const safeRegex = new RegExp(tempUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        content = content.replace(safeRegex, realUrl)

        uploadProgress.value.current++

        // Revoke blob URL gốc
        const blobPart = tempUrl.split('#')[0]
        URL.revokeObjectURL(blobPart)
      }).catch(error => {
        console.error(`Failed to upload ${file.name}:`, error)
        throw error
      })

      uploadPromises.push(uploadPromise)
    }

    await Promise.all(uploadPromises)

    // Cập nhật nội dung với URL Cloudinary
    editorInstance.setData(content)
    emit('update:modelValue', content)

    // Clear tạm
    tempImages.clear()
    return true
  } catch (error) {
    console.error('Upload images failed:', error)
    return false
  } finally {
    isUploading.value = false
    uploadProgress.value = { current: 0, total: 0 }
  }
}


// Load CKEditor từ CDN
const loadCKEditor = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.ClassicEditor) {
      resolve(window.ClassicEditor)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js'
    script.onload = () => {
      if (window.ClassicEditor) {
        resolve(window.ClassicEditor)
      } else {
        reject(new Error('CKEditor không load được từ CDN'))
      }
    }
    script.onerror = () => reject(new Error('Lỗi khi load CKEditor từ CDN'))
    document.head.appendChild(script)
  })
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0 && editorInstance) {
    // Đảm bảo editor đang focus
    editorInstance.editing.view.focus()

    for (const file of Array.from(files)) {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const blobUrl = URL.createObjectURL(file)
      const tempUrl = `${blobUrl}#${tempId}`

      // Lưu file + tempUrl
      tempImages.set(tempId, { file, tempUrl })

      editorInstance.model.change((writer: any) => {
        const imageElement = writer.createElement('imageBlock', { src: tempUrl })

        const selection = editorInstance.model.document.selection
        if (selection && selection.getFirstPosition()) {
          // Insert tại vị trí con trỏ
          editorInstance.model.insertContent(imageElement, selection)
        } else {
          // Nếu chưa có selection, insert vào cuối root
          editorInstance.model.insertContent(
            imageElement,
            editorInstance.model.document.getRoot()
          )
        }
      })
    }
  }
  
  target.value = ''
}


onMounted(async () => {
  if (process.client) {
    await nextTick()
    
    try {
      const ClassicEditor = await loadCKEditor()
      
      editorInstance = await ClassicEditor.create(editorElement.value, {
        ...defaultConfig,
        extraPlugins: [TemporaryUploadAdapterPlugin]
      })
      
      if (props.modelValue) {
        editorInstance.setData(props.modelValue)
      }
      
      editorInstance.model.document.on('change:data', () => {
        const data = editorInstance.getData()
        emit('update:modelValue', data)
      })
      
      editorInstance.editing.view.document.on('focus', (evt: any) => {
        emit('focus', evt)
      })
      
      editorInstance.editing.view.document.on('blur', (evt: any) => {
        emit('blur', evt)
      })
      
      emit('ready', editorInstance)
      isReady.value = true
      
    } catch (error) {
      console.error('Lỗi khi khởi tạo CKEditor:', error)
    }
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editorInstance && isReady.value) {
    const currentData = editorInstance.getData()
    if (currentData !== newValue) {
      editorInstance.setData(newValue || '')
    }
  }
})

onBeforeUnmount(() => {
  // Clean up blob URLs
  tempImages.forEach((file, tempId) => {
    const blobUrl = URL.createObjectURL(file)
    URL.revokeObjectURL(blobUrl)
  })
  tempImages.clear()

  if (editorInstance) {
    try {
      editorInstance.destroy()
    } catch (error) {
      console.error('Lỗi khi destroy editor:', error)
    }
  }
})

// Expose methods
const validate = () => {
  if (!editorInstance) return false
  const data = editorInstance.getData()
  return data && data.trim().length > 0
}

const insertImage = (url: string) => {
  if (editorInstance) {
    editorInstance.editing.view.focus()
    editorInstance.model.change((writer: any) => {
      const imageElement = writer.createElement('imageBlock', { src: url })

      const selection = editorInstance.model.document.selection
      if (selection && selection.getFirstPosition()) {
        editorInstance.model.insertContent(imageElement, selection)
      } else {
        editorInstance.model.insertContent(
          imageElement,
          editorInstance.model.document.getRoot()
        )
      }
    })
  }
}

const openImageDialog = () => {
  fileInput.value?.click()
}

// Method chính để upload tất cả images
const processImagesBeforeSubmit = async (): Promise<boolean> => {
  return await uploadAllImages()
}

defineExpose({ 
  validate,
  getInstance: () => editorInstance,
  insertImage,
  openImageDialog,
  processImagesBeforeSubmit,
  hasTemporaryImages: () => tempImages.size > 0
})
</script>

<style scoped>
.loading-editor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 200px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

:deep(.ck-editor__editable) {
  min-height: 300px;
}

:deep(.ck-content .image) {
  display: table;
  clear: both;
  text-align: center;
  margin: 1em auto;
}

:deep(.ck-content .image > img) {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  min-width: 50px;
}
</style>

<script lang="ts">
declare global {
  interface Window {
    ClassicEditor: any
  }
}
</script>