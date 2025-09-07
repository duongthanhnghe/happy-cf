import type { AddressDTO } from "../types/dto/address.dto";
import type { Address } from "../models/AddressEntity"

export function toAddressDTO(doc: Address): AddressDTO {
  return {
    id: doc._id ? doc._id.toString() : "",
    userId: doc.userId ? doc.userId.toString() : "",
    fullname: doc.fullname,
    phone: doc.phone,
    address: doc.address,
    note: doc.note,
    tag: doc.tag,
    isDefault: doc.isDefault,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function toAddressListDTO(docs: Address[]): AddressDTO[] {
  return docs.map(toAddressDTO);
}
