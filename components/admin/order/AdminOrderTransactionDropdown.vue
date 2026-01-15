<script setup lang="ts">
interface Props {
  orderId: string
  transaction: any
  orderStatusId: string
  statusList: any[]
  onUpdateStatus: (transactionId: number, status: string, orderId: string) => void
}

defineProps<Props>()
</script>

<template>
  <div v-if="transaction">
    <v-chip label :color="transaction.statusColor">
      {{ transaction.statusText }}
      <MaterialIcon name="keyboard_arrow_down" />
    </v-chip>

    <v-menu transition="slide-x-transition" activator="parent">
      <v-list>
        <v-list-item
          v-for="statusItem in statusList"
          :key="statusItem.status"
          :class="{ active: statusItem.status === transaction.status }"
          @click.prevent="onUpdateStatus(transaction.id, statusItem.status, orderId)"
        >
          <v-list-item-title>
            {{ statusItem.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
