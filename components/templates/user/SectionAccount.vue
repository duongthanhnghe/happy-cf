<script lang="ts" setup>

const props = defineProps({
  showBarcode: {
    type: Boolean,
  },
})

</script>
<template>
  <CardAccount :showBarcode="props.showBarcode" />

  <PopupMembershipInfo />
  <PopupBarcode />
  <PopupHistoryReward />
</template>
