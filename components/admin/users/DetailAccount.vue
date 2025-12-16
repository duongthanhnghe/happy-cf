<script lang="ts" setup>
import { useAdminUserDetailStore } from '@/stores/admin/users/useUserDetailStore';

const store = useAdminUserDetailStore();

</script>
<template>
<Popup v-model="store.isTogglePopup" :popupHeading="store.getDetailUser?.fullname" align="right">
  <template #body>
    <v-form validate-on="submit lazy">
      <v-container>
        <AvatarEdit width="200px" className="mb-md">
          <slot>
            <img v-if="store.getDetailUser?.avatar" :src="store.getDetailUser?.avatar" :alt="store.getDetailUser?.fullname" />
          </slot>
        </AvatarEdit>
        {{ store.getDetailUser }}
      </v-container>
    </v-form>
  </template>
</Popup>
</template>
