import { useRouter } from "vue-router";
import { showWarning } from "@/utils/toast";
import { ROUTES } from "@/shared/constants/routes";

export const useForbiddenHandler = () => {
  const router = useRouter();

  const handleForbiddenAccess = (message?: string) => {
    showWarning(message ?? "Bạn không có quyền truy cập");
    router.push({ path: ROUTES.ADMIN.BASE_INFORMATION.path });
  };

  return { handleForbiddenAccess };
};
