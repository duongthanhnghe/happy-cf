import type { AddressDTO } from "../../types/dto/v1/address.dto";
import type { Address } from "../../models/v1/address.entity";

export function toAddressDTO(doc: Address): AddressDTO {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : "",
    fullname: doc.fullname,
    phone: doc.phone,
    address: doc.address, // chi tiết: số nhà, đường
    note: doc.note,
    tag: doc.tag,
    isDefault: doc.isDefault || false,
    provinceCode: doc.provinceCode,
    districtCode: doc.districtCode,
    wardCode: doc.wardCode,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function toAddressListDTO(docs: Address[]): AddressDTO[] {
  return docs.map(toAddressDTO);
}
