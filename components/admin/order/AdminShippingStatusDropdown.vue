<script setup lang="ts">
import { SHIPPING_STATUS } from "@/shared/constants/shipping-status"

type ShippingStatus = keyof typeof SHIPPING_STATUS

interface Shipping {
  id: number
  status: ShippingStatus
  [key: string]: any
}

interface Props {
  orderId: string
  shipping: Shipping
  onUpdateStatus: (shippingId: number, status: ShippingStatus, name: string, orderId: string) => void
}

defineProps<Props>()
</script>

<template>
  <div v-if="shipping" class="flex flex-direction-column gap-xs">
    <div class="flex align-center gap-xs">
      <v-chip
        :color="SHIPPING_STATUS[shipping.status].color"
        label
        class="cursor-pointer"
      >
        {{ SHIPPING_STATUS[shipping.status].name }}
        <MaterialIcon name="keyboard_arrow_down" />
      </v-chip>

      <v-menu transition="slide-x-transition" activator="parent">
        <v-list>
          <v-list-item
            v-for="statusItem in Object.values(SHIPPING_STATUS)"
            :key="statusItem.status"
            :class="{ active: statusItem.status === shipping.status }"
            @click.prevent="
              onUpdateStatus(
                shipping.id,
                statusItem.status,
                statusItem.name,
                orderId,
              )
            "
          >
            <v-list-item-title>
              {{ statusItem.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>
