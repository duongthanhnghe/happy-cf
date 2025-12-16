import type { HistoryTypeItem, HistoryType } from '@/server/types/dto/v1/reward-history.dto'

export const REWARD_HISTORY_TYPE: Record<HistoryType, HistoryTypeItem> = {
  earned: {
    name: "Điểm thưởng",
    type: "earned",
    color: "green",
  },
  used: {
    name: "Điểm đã dùng",
    type: "used",
    color: "red",
  },
  refunded: {
    name: "Điểm hoàn lại",
    type: "refunded",
    color: "blue",
  },
  pending_reward: {
    name: "Chờ cộng điểm",
    type: "pending_reward",
    color: "orange",
  },
  none: {
    name: "Không xác định",
    type: "none",
    color: "grey",
  },
}
