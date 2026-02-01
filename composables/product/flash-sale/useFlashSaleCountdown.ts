import { ref, computed, onMounted, onUnmounted } from "vue"

export function useFlashSaleCountdown(
  startDate: string,
  endDate: string
) {
  const now = ref(Date.now())
  let timer: any = null

  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()

  /* ---------- STATUS ---------- */
  const status = computed<"upcoming" | "running" | "ended">(() => {
    if (now.value < start) return "upcoming"
    if (now.value < end) return "running"
    return "ended"
  })

  /* ---------- TARGET TIME ---------- */
  const targetTime = computed(() => {
    if (status.value === "upcoming") return start
    if (status.value === "running") return end
    return 0
  })

  /* ---------- REMAINING ---------- */
  const remaining = computed(() => {
    const diff = targetTime.value - now.value
    return diff > 0 ? diff : 0
  })

  /* ---------- RAW TIME ---------- */
  const time = computed(() => {
    const total = remaining.value

    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((total / (1000 * 60)) % 60)
    const seconds = Math.floor((total / 1000) % 60)

    return { days, hours, minutes, seconds }
  })

  /* ---------- FORMAT ---------- */
  const pad = (n: number) => n.toString().padStart(2, "0")

  const formatted = computed(() => {
    if (status.value === "ended") return "00:00:00:00"

    const { days, hours, minutes, seconds } = time.value
    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  })

  /* ---------- LIFE CYCLE ---------- */
  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return {
    status,        // upcoming | running | ended
    time,          // { days, hours, minutes, seconds }
    formatted,     // "14:09:25:14"
    remaining      // milliseconds (optional)
  }
}
