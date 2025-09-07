import { showWarning } from "@/utils/toast"

export function useChangeOrder<T>(
  apiUpdateOrder: (id: string, newOrder: number) => Promise<{ code: number; message?: string; data?: T }>,
  reloadFn: () => Promise<void>
) {
  async function handleChangeOrder(id: string, newOrder: number) {
    try {
      const data = await apiUpdateOrder(id, newOrder)
      if (data.code === 0) {
        await reloadFn()
      } else {
        showWarning(data.message ?? "Cập nhật thất bại")
      }
    } catch (err) {
      console.error("Error updating order:", err)
      showWarning("Có lỗi xảy ra khi cập nhật")
    }
  }

  return {
    handleChangeOrder,
  }
}
