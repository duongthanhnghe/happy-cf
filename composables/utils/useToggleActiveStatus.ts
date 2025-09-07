import { showSuccess, showWarning } from "@/utils/toast"
import { Loading } from "@/utils/global"

export function useToggleActiveStatus<T extends { id: string }>(
  apiToggle: (id: string) => Promise<any>,
  listRef: any
) {

  async function toggleActive(id: string) {
    if (!id) return
    Loading(true)

    try {
      const data = await apiToggle(id)
      if (data.code === 0 && data.data) {
        showSuccess(data.message ?? "Cập nhật thành công")

        const index = listRef.value.findIndex((item: T) => item.id === id)
        if (index !== -1) {
          listRef.value[index] = data.data
        }
      } else {
        showWarning(data.message ?? "Cập nhật thất bại")
      }
    } catch (err) {
      console.error("Error toggleActive:", err)
      showWarning("Có lỗi xảy ra khi cập nhật")
    } finally {
      Loading(false)
    }
  }

  return {
    toggleActive,
  }
}
