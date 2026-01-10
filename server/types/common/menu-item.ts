import type { AccountRoleType } from "@/server/types/dto/v1/account.dto";
export interface MenuItem {
  path?: string;
  name?: string;
  label: string;
  icon?: string;
  middleware?: string[];
  layout?: string;
  headerTypeLeft?: 'address' | 'logo' | 'name' | 'back';
  children?: Record<string, MenuItem>;
  isShowSidebar?: boolean;
  isShowMenuAccount?: boolean;
  roles?: AccountRoleType[];
  action?: () => void;
  showBreadcrumb?: boolean
  showFooter?: boolean
  showMenuBottom?: boolean
  showHeaderSub?: boolean
  showMembershipCTA?: boolean
}
