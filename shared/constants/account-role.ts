import type { AccountRoleType, AccountRoleItem } from "@/server/types/dto/v1/account.dto";

export const ACCOUNT_ROLE: Record<AccountRoleType, AccountRoleItem> = {
  superadmin: {
    label: "Super Admin",
    value: "superadmin",
  },
  editor: {
    label: "Editor",
    value: "editor",
  },
};