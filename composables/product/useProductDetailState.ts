import { ref } from "vue";

export const useProductDetailState = () => {
  const limitRelated = 12
  const limitReview = 1
  const pageReview = ref('1')
  const popups = ref({
    order: false,
    edit: false,
  });

  return {
    limitRelated,
    limitReview,
    pageReview,
    popups,
  };
};