<template>
  <div class="mb-md">
    <div v-if="!isReady">Đang tải CKEditor...</div>
    <div v-show="isReady" ref="editorEl"></div>

    <!-- hiển thị progress upload ảnh (nếu cần) -->
    <div v-if="isUploading" class="upload-progress">
      Upload ảnh {{ uploadProgress.current }}/{{ uploadProgress.total }}...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useFileSelectContextStore } from '@/stores/admin/file-manage/useFileSelectContextStore'
import { fileManageAPI } from "@/services/v1/file-manage.service";
import {
  Loading
} from '@/utils/global'

const contextStore = useFileSelectContextStore()
const fmStore = useFileManageFolderStore()

interface Props {
  modelValue: string
  uploadUrl?: string
}
const props = defineProps<Props>()
const emit = defineEmits(["update:modelValue", "ready"])

const editorEl = ref<HTMLElement | null>(null)
let editorInstance: any = null
let lastSelection: any = null
const isReady = ref(false)

let toolbarObserver: MutationObserver | null = null
let customBtn: HTMLButtonElement | null = null

/** ===============================
 *  Selection & Insert Image
 *  =============================== */
function saveSelectionSnapshot() {
  if (!editorInstance) return
  try {
    lastSelection = editorInstance.model.document.selection.getFirstRange()
  } catch {
    lastSelection = null
  }
}

function insertImage(url: string) {
  if (!editorInstance) return
  editorInstance.editing.view.focus()
  editorInstance.model.change((writer: any) => {
    const imageElement = writer.createElement("imageBlock", { src: url })
    if (lastSelection) {
      try {
        editorInstance.model.insertContent(imageElement, lastSelection)
      } catch {
        const root = editorInstance.model.document.getRoot()
        editorInstance.model.insertContent(imageElement, writer.createPositionAt(root, "end"))
      } finally {
        lastSelection = null
      }
    } else {
      const root = editorInstance.model.document.getRoot()
      editorInstance.model.insertContent(imageElement, writer.createPositionAt(root, "end"))
    }
  })
}

/** ===============================
 *  Custom Button
 *  =============================== */
function addChooseFromLibraryButton(editor: any) {
  const toolbarView = editor.ui?.view?.toolbar
  if (!toolbarView?.element) return

  function findItemsContainer() {
    return toolbarView.element.querySelector(".ck-toolbar__items") || toolbarView.element
  }

  if (!customBtn) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "ck ck-button ck-off ck-button_with-text custom-choose-image"
    btn.setAttribute("aria-label", "Chọn ảnh từ thư viện")
    btn.innerHTML = `<span class="ck ck-button__label">Chọn ảnh</span>`

    btn.addEventListener("click", (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      saveSelectionSnapshot()
      contextStore.setContext("ckeditor")
      fmStore.handleTogglePopup(true)
    })

    customBtn = btn
  }

  function attachButton() {
    const container = findItemsContainer()
    if (!container || !customBtn) return
    if (!container.contains(customBtn)) container.appendChild(customBtn)
  }

  attachButton()

  if (!toolbarObserver) {
    toolbarObserver = new MutationObserver(() => {
      const containerNow = findItemsContainer()
      if (containerNow && customBtn && !containerNow.contains(customBtn)) {
        containerNow.appendChild(customBtn)
      }
    })
    toolbarObserver.observe(toolbarView.element, { childList: true, subtree: true })
  }
}

/** ===============================
 *  Auto Upload base64 Images
 *  =============================== */
const isUploading = ref(false)
const uploadProgress = ref({ current: 0, total: 0 })

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([u8arr], filename, { type: mime })
}

const uploadFileToServer = async (file: File): Promise<string> => {
  if (!props.uploadUrl) throw new Error("uploadUrl prop is required for uploading images")
  const response = await fileManageAPI.uploadImage(file, props.uploadUrl)
  if (!response.success || !response.url) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
  return response.url
}

const uploadAllImages = async (): Promise<boolean> => {
  const content = editorInstance.getData()
  const imgRegex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/g
  const matches = [...content.matchAll(imgRegex)]
  if (matches.length === 0) return true  // không có ảnh base64 coi như thành công

  isUploading.value = true
  uploadProgress.value = { current: 0, total: matches.length }
  let newContent = content
  let hasError = false

  for (const [_, dataUrl] of matches) {
    try {
      const file = dataURLtoFile(dataUrl, `pasted-${Date.now()}.png`)
      const realUrl = await uploadFileToServer(file)
      newContent = newContent.replace(dataUrl, realUrl)
      uploadProgress.value.current++
    } catch (err) {
      console.error("Upload base64 image failed:", err)
      hasError = true
    }
  }

  editorInstance.setData(newContent)
  emit("update:modelValue", newContent)
  isUploading.value = false
  uploadProgress.value = { current: 0, total: 0 }

  return !hasError
}

/** ===============================
 *  CKEditor Init
 *  =============================== */
async function waitForClassicEditor(maxTries = 60, delay = 100) {
  for (let i = 0; i < maxTries; i++) {
    // @ts-ignore
    if (window && (window as any).CKEDITOR?.ClassicEditor) {
      // @ts-ignore
      return (window as any).CKEDITOR.ClassicEditor
    }
    await new Promise(r => setTimeout(r, delay))
  }
  throw new Error("CKEditor chưa sẵn sàng từ CDN")
}

let uploadTimer: any = null

onMounted(async () => {
  await nextTick()
  try {
    const ClassicEditor = await waitForClassicEditor()
    editorInstance = await ClassicEditor.create(editorEl.value!, {
      toolbar: [
        "heading","|","bold","italic","link",
        "bulletedList","numberedList","|",
        "imageUpload","|","blockQuote","insertTable","undo","redo"
      ],
      removePlugins: [
        "CKBox","CKFinder","EasyImage","CloudServices","ExportPdf","ExportWord",
        "RealTimeCollaborativeComments","RealTimeCollaborativeTrackChanges",
        "RealTimeCollaborativeRevisionHistory","PresenceList","Comments",
        "TrackChanges","TrackChangesData","RevisionHistory","Pagination","WProofreader",
        "MathType","SlashCommand","Template","DocumentOutline","FormatPainter",
        "TableOfContents","PasteFromOfficeEnhanced","CaseChange"
      ],
    })

    if (props.modelValue) editorInstance.setData(props.modelValue)

    editorInstance.model.document.on("change:data", () => {
      emit("update:modelValue", editorInstance.getData())
      // emit("update:modelValue", editorInstance.getData())
      // if (editorInstance.getData().includes("data:image/")) {
      //   if (uploadTimer) clearTimeout(uploadTimer)
      //   uploadTimer = setTimeout(() => {
      //     uploadAllImages()
      //     uploadTimer = null
      //   }, 400) // debounce 400ms
      // }
    })

    addChooseFromLibraryButton(editorInstance)

    watch(
      () => fmStore.getSelectImage,
      (val) => {
        if (contextStore.context !== "ckeditor") return
        if (val?.url) {
          try { editorInstance.editing.view.focus() } catch {}
          insertImage(val.url)
          fmStore.handleTogglePopup(false)
          contextStore.setContext(null)
        }
      }
    )

    emit("ready", editorInstance)
    isReady.value = true
  } catch (err) {
    console.error("CKEditor init error:", err)
  }
})

onBeforeUnmount(() => {
  toolbarObserver?.disconnect()
  toolbarObserver = null
  if (customBtn?.parentElement) customBtn.parentElement.removeChild(customBtn)
  customBtn = null
  editorInstance?.destroy().catch(console.error)
  editorInstance = null
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (editorInstance && newVal !== editorInstance.getData()) {
      editorInstance.setData(newVal || "")
    }
  }
)

defineExpose({
  uploadAllImages
})
</script>

<style scoped>
:deep(.ck-toolbar__items) {
  display: flex;
  align-items: center;
  gap: 6px;
}
:deep(.custom-choose-image) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  line-height: 1;
  white-space: nowrap;
}
:deep(.custom-choose-image .ck-button__label) {
  font-size: 13px;
}
:deep(.custom-choose-image:hover) {
  background-color: rgba(0,0,0,0.03);
}
:deep(.custom-choose-image:active) {
  transform: translateY(1px);
}
.upload-progress {
  position: absolute;
  text-align: center;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(255 255 255 / 60%);
  font-size: 16px;
  z-index: 2;
}
</style>
