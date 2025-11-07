import type { AccountDocument } from "../../models/v1/account.entity";
import type { AccountDTO } from "../../types/dto/v1/account.dto";

export function toAccountDTO(entity: AccountDocument): AccountDTO {
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

export const toAccountListDTO = (admins: AccountDocument[]): AccountDTO[] => {
  return admins.map(toAccountDTO);
};
