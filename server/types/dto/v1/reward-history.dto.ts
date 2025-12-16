import type { User } from "./user.dto"
import type { PaginationDTO } from '../../common/pagination.dto'

export type HistoryType = "earned" | "used" | "refunded" | "pending_reward" | "none"

export interface HistoryTypeItem {
  color: string
  name: string
  type: HistoryType
}

export interface RewardHistoryDTO {
  orderId: string
  code: string
  createdAt: string
  historyType: HistoryType
  points: number
  user?: User
}

export type RewardHistoryPaginationDTO = PaginationDTO<RewardHistoryDTO>

export interface PendingRewardData {
  totalPendingPoints: number;
  orders: number;
}