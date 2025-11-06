import type { AdminAccountDocument } from "../../models/v1/AdminAccountEntity";
import type { AdminAccountDTO } from "../../types/dto/v1/admin-auth.dto";

export function toAdminAccountDTO(entity: AdminAccountDocument): AdminAccountDTO {
  return {
    id: entity._id.toString(),
    avatar: entity.avatar,
    fullname: entity.fullname,
    email: entity.email,
    role: entity.role,
    active: entity.active,
    lastLogin: entity.lastLogin?.toISOString(),
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
  };
}

export const toAdminAccountListDTO = (admins: AdminAccountDocument[]): AdminAccountDTO[] => {
  return admins.map(toAdminAccountDTO);
};
