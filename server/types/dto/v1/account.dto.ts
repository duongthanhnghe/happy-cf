import type { PaginationDTO } from '../../common/pagination.dto'
import type { Request } from "express";

export const ACCOUNT_ROLES = ["superadmin", "editor"] as const;

export type AccountRoleType = typeof ACCOUNT_ROLES[number];

export const ACCOUNT_ROLES_CONST = {
  SUPERADMIN: ACCOUNT_ROLES[0],
  EDITOR: ACCOUNT_ROLES[1]
} as const;

export interface AccountRoleItem {
  label: string;
  value: AccountRoleType;
}

export interface AccountDTO {
  id: string;
  avatar: string;
  fullname: string;
  email: string;
  role: AccountRoleType;
  active: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AccountPaginationDTO = PaginationDTO<AccountDTO>

export interface ChangePasswordDTO {
  id: string;
  oldPassword: string
  newPassword: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AccountUpdateDTO {
  id: string
  avatar: string
  fullname: string
}

export type AccountCreateDTO = Omit<AccountDTO, "id" | "createdAt" | "updatedAt" | "lastLogin" | "active" | "avatar"> & { password: string };

export interface AccountLoginResponse {
  accessToken: string
  account: {
    id: string
    avatar: string
    fullname: string
    email: string
    role: AccountRoleType
  }
}

export interface AccountJwtPayload {
  id: string;
  username: string;
  role: AccountRoleType;
  iat?: number;
  exp?: number;
}

export interface AccountRequest extends Request {
  account?: AccountJwtPayload;
}