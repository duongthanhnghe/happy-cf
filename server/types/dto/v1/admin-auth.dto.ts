export interface AdminAccountDTO {
  id: string;
  avatar: string;
  fullname: string;
  email: string;
  role: "superadmin" | "editor";
  active: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChangePasswordDTO {
  id: string;
  oldPassword: string
  newPassword: string
}

export interface AdminLoginDTO {
  email: string
  password: string
}

export interface AdminUpdateDTO {
  id: string
  avatar: string
  fullname: string
}

export interface AdminLoginResponse {
  token: string
  admin: {
    id: string
    avatar: string
    fullname: string
    email: string
    role: 'superadmin' | 'editor'
  }
}

export interface AdminJwtPayload {
  id: string;
  username: string;
  role: "superadmin" | "editor";
  iat?: number;
  exp?: number;
}

export interface AdminRequest extends Request {
  admin?: AdminJwtPayload;
}