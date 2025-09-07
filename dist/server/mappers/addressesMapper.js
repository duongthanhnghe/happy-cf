export function toAddressDTO(doc) {
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
export function toAddressListDTO(docs) {
    return docs.map(toAddressDTO);
}
//# sourceMappingURL=addressesMapper.js.map