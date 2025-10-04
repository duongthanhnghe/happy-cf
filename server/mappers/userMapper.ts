import type { User } from "../models/UserEntity";
import type { User as UserDTO } from "../types/dto/user.dto";

export function toUserDTO(entity: User): UserDTO {
  return {
    id: entity._id?.toString() || "",
    fullname: entity.fullname,
    email: entity.email,
    gender: entity.gender || undefined,
    phone: entity.phone || "",
    birthday: entity.birthday?.toString() || null,
    avatar: entity.avatar || "",
    googleId: entity.googleId,
    authProvider: entity.authProvider,
    active: entity.active,
    role: entity.role,
    membership: {
      level: entity.membership.level,
      point: entity.membership.point,
      balancePoint: entity.membership.balancePoint,
      discountRate: entity.membership.discountRate,
      joinedAt: entity.membership.joinedAt?.toString(),
      barcode: entity.membership.barcode || "",
      code: entity.membership.code ?? 0,
    },
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
  };
}

export const toUserListDTO = (users: User[]): UserDTO[] => {
  return users.map(toUserDTO);
};
