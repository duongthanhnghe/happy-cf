import { ref, computed, watch } from "vue"
import dayjs from "dayjs"

export type DashboardRangeKey =
  | "all"
  | "today"
  | "3days"
  | "7days"
  | "1week"
  | "1month"
  | "3months"
  | "1year"
  | "thisYear"
  | "lastYear"

export const useDashboardFilter = () => {
  const selectedRange = ref<DashboardRangeKey>("7days")
  const fromDay = ref<string | null>(null)
  const toDay = ref<string | null>(null)

  const DASHBOARD_RANGES = [
    { key: "all", label: "Tất cả" },
    { key: "today", label: "Hôm nay" },
    { key: "3days", label: "3 ngày" },
    { key: "7days", label: "7 ngày" },
    { key: "1week", label: "1 tuần" },
    { key: "1month", label: "1 tháng" },
    { key: "3months", label: "3 tháng" },
    { key: "1year", label: "1 năm" },
    { key: "thisYear", label: "Năm nay" },
    { key: "lastYear", label: "Năm trước" },
  ]

  const applyPreset = (key: DashboardRangeKey) => {
    const today = dayjs().endOf("day")

    const set = (from?: dayjs.Dayjs, to?: dayjs.Dayjs) => {
      fromDay.value = from ? from.startOf("day").toISOString() : null
      toDay.value = to ? to.endOf("day").toISOString() : null
    }

    switch (key) {
      case "all":
        fromDay.value = "2000-01-01T00:00:00.000Z"
        toDay.value = today.endOf("day").toISOString()
        break

      case "today":
        set(today, today)
        break

        case 'all':
          return {
            fromDate: '2000-01-01',
            toDate: today.format('YYYY-MM-DD'),
          }

      case "3days":
        set(today.subtract(2, "day"), today)
        break

      case "7days":
      case "1week":
        set(today.subtract(6, "day"), today)
        break

      case "1month":
        set(today.subtract(1, "month"), today)
        break

      case "3months":
        set(today.subtract(3, "month"), today)
        break

      case "1year":
        set(today.subtract(1, "year"), today)
        break

      case "thisYear":
        set(dayjs().startOf("year"), today)
        break

      case "lastYear":
        set(
          dayjs().subtract(1, "year").startOf("year"),
          dayjs().subtract(1, "year").endOf("year")
        )
        break
    }
  }

  watch(selectedRange, (val) => {
    if (val) applyPreset(val)
  }, { immediate: true })

  const dateParams = computed(() => ({
    fromDate: fromDay.value ?? undefined,
    toDate: toDay.value ?? undefined,
  }))

  return {
    selectedRange,
    fromDay,
    toDay,
    DASHBOARD_RANGES,
    dateParams,
  }
}
