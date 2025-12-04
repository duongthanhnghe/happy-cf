export function toAddressDTO(doc) {
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
export function toAddressListDTO(docs) {
    return docs.map(toAddressDTO);
}
//# sourceMappingURL=addresses.mapper.js.map