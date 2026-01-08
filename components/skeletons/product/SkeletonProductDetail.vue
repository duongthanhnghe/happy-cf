<template>
  <div class="product-detail pt-section">
    <div id="product-detail-info" class="container pb-section">
      <div class="row">
        <!-- LEFT: GALLERY -->
        <div class="col-12 col-lg-6">
          <div class="rd-lg overflow-hidden">
            <!-- Main image -->
            <div class="skeleton aspect-ratio-1p1 w-full"></div>

            <!-- Thumbnail row -->
            <div class="flex gap-xs mt-sm">
              <div
                v-for="i in 5"
                :key="i"
                class="skeleton aspect-ratio-1p1 width-p20 rd-md"
              ></div>
            </div>
          </div>
        </div>

        <!-- RIGHT: INFO -->
        <div class="col-12 col-lg-6">
          <div class="pd-sm">
            <!-- Product name -->
            <div class="skeleton skeleton-text skeleton-text-xl width-p90 mb-xs"></div>
            <div class="skeleton skeleton-text width-p70 mb-lg"></div>

            <!-- Price -->
            <div class="flex gap-sm align-center mb-lg">
              <div class="skeleton skeleton-text skeleton-text-lg width-p20"></div>
              <div class="skeleton skeleton-text skeleton-text-lg width-p20"></div>
              <div class="skeleton skeleton-text skeleton-text-lg width-xl"></div>
            </div>
            
            <!-- Variant options -->
            <div class="mb-lg">
              <div class="skeleton skeleton-text width-p30 mb-xs"></div>
            </div>

            <!-- Order buttons -->
            <div class="flex gap-sm">
              <div class="skeleton skeleton-text skeleton-text-xl width-full"></div>
              <div class="skeleton skeleton-text skeleton-text-xl width-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DESCRIPTION -->
    <div class="container mt-lg m-auto max-width-800">
      <div
        v-for="i in 4"
        :key="i"
        class="skeleton skeleton-text width-full mb-xs"
      ></div>
    </div>
  </div>
</template>
