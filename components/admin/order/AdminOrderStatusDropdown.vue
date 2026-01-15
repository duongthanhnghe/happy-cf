<script setup lang="ts">
import { ORDER_STATUS } from "@/shared/constants/order-status"

interface Props {
  order: any
  statusList: any[]
  onUpdateStatus: (
    orderId: number,
    statusId: number,
    statusName: string,
    transactionId?: number,
    totalPrice?: number,
    paymentMethod?: string
  ) => void
}

const props = defineProps<Props>()
</script>

<template>
  <v-chip :color="order.status.status" label>
    {{ order.status.name }}
    <template v-if="order.status.id !== ORDER_STATUS.CANCELLED">
      <MaterialIcon name="keyboard_arrow_down" />
    </template>
  </v-chip>

  <template v-if="order.status.id !== ORDER_STATUS.CANCELLED">
    <v-menu transition="slide-x-transition" activator="parent">
      <v-list>
        <v-list-item
          v-for="statusItem in statusList"
          :key="statusItem.id"
          :class="{ active: statusItem.index === order.status.index }"
          @click.prevent="
            onUpdateStatus(
              order.id,
              statusItem.id,
              statusItem.name,
              order.transaction?.id,
              order.totalPrice,
              order.paymentId.method
            )
          "
        >
          <v-list-item-title>
            <div class="flex align-center gap-sm">
              <MaterialIcon v-if="statusItem.icon" :name="statusItem.icon" />
              {{ statusItem.name }}
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
</template>
