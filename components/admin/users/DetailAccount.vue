<script lang="ts" setup>
import {
  useUserManageStore
} from '@/stores/admin/users/useUserManageStore'
import { IMAGE_AVATAR_DEFAULT } from '@/const/image';

const store = useUserManageStore();

</script>
<template>
<Popup popupId="popup-detail-account" v-model="store.isTogglePopupUpdate" popupHeading="Thong tin tai khoan" align="right">
  <template #body>
    <v-form validate-on="submit lazy">
      <!-- <div class="portal-popup-footer">
        <Button type="submit" color="primary" :label="GLOBAL_TEXT_UPDATE" class="w-full" />
      </div> -->
      <v-container>
        <AvatarEdit width="200px" className="mb-md">
          <slot>
            <img v-if="store.getDetailUser?.avatar" :src="store.getDetailUser?.avatar" :alt="store.getDetailUser?.fullname" />
            <img v-else :src="IMAGE_AVATAR_DEFAULT" :alt="store.getDetailUser?.fullname" />
          </slot>
        </AvatarEdit>
        {{ store.getDetailUser }}
      </v-container>
    </v-form>
  </template>
</Popup>
</template>
