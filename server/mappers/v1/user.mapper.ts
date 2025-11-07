import type { User } from "../../models/v1/user.entity";
import type { User as UserDTO } from "../../types/dto/v1/user.dto";

export function toUserDTO(entity: User): UserDTO {
  return {
    id: entity._id?.toString() || "",
    fullname: entity.fullname,
    email: entity.email,
    gender: entity.gender || undefined,
    phone: entity.phone || "",
    birthday: entity.birthday?.toString() || undefined,
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
      pointRate: entity.membership.pointRate,
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
