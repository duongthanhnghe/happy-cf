export interface AddressDTO {
  id: string
  userId: string
  fullname: string
  phone: string
  address: string
  note?: string
  tag: TagAddress
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type CreateAddressBody = Omit<AddressDTO, "id" | "createdAt" | "updatedAt">

export type IdAddress = { id: string }

export type TagAddress = "Nhà" | "Công ty" | "Trường học" | "Khác";

