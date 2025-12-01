export const toVariantGroupDTO = (group) => {
    return {
        id: group._id.toString(),
        groupName: group.groupName,
        groupType: group.groupType,
        description: group.description,
        icon: group.icon,
        variants: group.variants.map(v => ({
            id: v.id,
            name: v.name,
            isActive: v.isActive
        })),
        isActive: group.isActive,
        createdAt: group.createdAt.toISOString(),
        updatedAt: group.updatedAt.toISOString()
    };
};
export const toVariantGroupListDTO = (groups) => {
    return groups.map(toVariantGroupDTO);
};
//# sourceMappingURL=variant-group.mapper.js.map