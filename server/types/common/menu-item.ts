export interface MenuItem {
  path?: string;
  label: string;
  icon: string;
  middleware?: string[];
  layout?: string;
  headerTypeLeft?: 'address' | 'logo' | 'name' | 'back';
  children?: Record<string, MenuItem>;
  action?: () => void;
}
