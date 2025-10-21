import type { JwtPayload } from 'jsonwebtoken';
import type { PaginationDTO } from '../../common/pagination.dto'

export interface User {
  id: string
  fullname: string
  email: string
  gender?: GenderType
  phone: string
  birthday?: string
  avatar: string
  active: boolean
  role: number
  googleId?: string
  authProvider: 'local' | 'google' | 'facebook'
  membership: {
    level: MembershipLevel
    point: number
    balancePoint: number
    discountRate: number
    joinedAt: string
    barcode: string
    code: number
  }
  createdAt: string
  updatedAt: string
}

export type UserPaginationDTO = PaginationDTO<User>

export type GenderType = 'male' | 'female' | 'other';

export type MembershipLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type IdUser = { id: string }

export type UserLogin = Pick<User, 'email'> & { password: string }

export type UserEdit = Partial<Pick<User, 'avatar' | 'birthday' | 'fullname' | 'gender' | 'phone'>>

export type UserRegister = Pick<User, 'fullname' | 'email' | 'gender' > & { password: string }

export interface TokenReset {
  resetToken?: string
  resetTokenExpire?: number
}

export interface ResetPassword {
  email: string
  token: string
  newPassword: string
}

export interface ChangePassword {
  userId: string
  oldPassword: string
  newPassword: string
}

export type UserWithResetToken = User & TokenReset

export interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: number;
}

export interface MembershipBenefitDTO {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipBenefit {
  name: string
  description?: string
  icon?: string
}

export interface UpdateMembershipBenefit extends Partial<CreateMembershipBenefit> {
  id: string
}

export interface MembershipLevels {
  id: string
  name: string
  minPoint: number
  icon: string
  image: string
  discountRate: number
  benefits: MembershipBenefitDTO[];
}

export interface UpdateMembershipLevels extends Omit<MembershipLevels, 'benefits'> {
  benefits: string[];
}

export interface InformationMembershipLevels {
  currentLevel: MembershipLevels
  nextLevel: MembershipLevels
}
