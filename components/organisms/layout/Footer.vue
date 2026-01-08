<script lang="ts" setup>
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

const storeSetting = useBaseInformationStore();
const storeAccount = useAccountStore()
const { t } = useITranslations()

</script>
<template>
  <div class="footer bg-black2 pt-section pb-section">
    <div class="container container-xxl">
      <div class="border-bottom-default border-color-gray8">
        <div class="row ">
          <div class="col-12 col-lg-4 pb-md">
            <Logo maxHeight="100" filter link />
          </div>
          <div class="col-12 col-lg-4 pb-md">
            <Text :text="storeSetting.getBaseInformation?.name" color="white" weight="semibold" size="lg" class="mb-sm" />
            <Text v-if="storeSetting.getBaseInformation?.address" :text="storeSetting.getBaseInformation?.address" color="gray" class="mb-xs" />
            <Text v-if="storeSetting.getBaseInformation?.email" color="gray" class="mb-xs">
              Email:
              <Text tag="span" :text="storeSetting.getBaseInformation?.email" weight="semibold" />
            </Text>
            <Text v-if="storeSetting.getBaseInformation?.phone" color="gray" >
              <Text tag="span" :text="t('footer.text14')" />
              <Text tag="span" :text="storeSetting.getBaseInformation?.phone" weight="semibold" />
            </Text>
          </div>
          <div class="col-12 col-lg-4 pb-md">
            <template v-if="storeSetting.getBaseInformation?.socialLinks && storeSetting.getBaseInformation?.socialLinks.length > 0">
              <Text :text="t('footer.text12')" color="white" weight="semibold" size="lg" class="mb-xs" />
              <Text :text="t('footer.text13')" color="gray" class="mb-ms" />
              
              <div class="flex gap-sm">
                <template v-for="item in storeSetting.getBaseInformation?.socialLinks" :key="item.icon">
                  <a :href="item.src" target="_blank">
                    <Button color="secondary" class="rd-full" :border="false">
                      <component :is="storeSetting.iconMap[item.icon]" />
                    </Button>
                  </a>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="border-bottom-default border-color-gray8 pt-md">
        <div class="row ">
          <div class="col-6 col-lg-3 pb-md">
            <Text :text="t('footer.text5')" color="white" weight="semibold" size="md" class="mb-sm" />
            <client-only>
            <NuxtLink :to="{ path: storeAccount.getUserId ? ROUTES.PUBLIC.ACCOUNT.children?.INFO.path : ROUTES.PUBLIC.LOGIN.path }">
              <Text :text="t('footer.text1')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            </client-only>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.REGISTER.path }">
              <Text :text="t('footer.text2')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.LOGIN.path }">
              <Text :text="t('footer.text3')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path }">
              <Text :text="t('footer.text4')" color="white" class="hover-underline" />
            </NuxtLink>
          </div>
          <div class="col-6 col-lg-3 pb-md">
            <Text :text="t('footer.text6')" color="white" weight="semibold" size="md" class="mb-sm" />
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POLICY_PAYMENT.path }">
              <Text :text="t('page.payment.heading')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POLICY_RETURN.path }">
              <Text :text="t('page.return.heading')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POLICY_SECURITY.path }">
              <Text :text="t('page.security.heading')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POLICY_SHIPPING.path }">
              <Text :text="t('page.shipping.heading')" color="white" class="hover-underline" />
            </NuxtLink>
          </div>
          <div class="col-6 col-lg-3 pb-md">
            <Text :text="t('footer.text7')" color="white" weight="semibold" size="md" class="mb-sm" />
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.FAQ.path }">
              <Text :text="t('page.faq.heading')" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.SUPPORT_ORDER.path }">
              <Text :text="t('page.support-order.heading')" color="white" class="hover-underline" />
            </NuxtLink>
          </div>
          <div class="col-6 col-lg-3 pb-md">
            <Text :text="t('footer.text8')" color="white" weight="semibold" size="md" class="mb-sm" />
            <NuxtLink :to="{ path: ROUTES.PUBLIC.HOME.path }">
              <Text :text="ROUTES.PUBLIC.HOME.label" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.ABOUT.path }">
              <Text :text="ROUTES.PUBLIC.ABOUT.label" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.NEWS.children?.MAIN.path }">
              <Text :text="ROUTES.PUBLIC.NEWS.children?.MAIN.label" color="gray" class="mb-sm hover-underline" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.CONTACT.path }">
              <Text :text="ROUTES.PUBLIC.CONTACT.label" color="white" class="hover-underline" />
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="pt-ms flex flex-wrap gap-sm justify-between">
        <div>
          <Text size="xs" :text="t('footer.text11')" color="gray" />
        </div>
        <div class="flex flex-1 position-relative max-width-400">
          <NuxtLink :to="{ path: ROUTES.PUBLIC.CONTACT.path }" class="w-full cursor-pointer">
            <v-text-field
              :label="t('footer.text9').text"
              variant="outlined"
              hide-details
              required
            />
              <Button
                color="primary"
                icon="inbox_text"
                :label="t('footer.text10').text"
                class="position-absolute right-0 top-0"
              />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template> 