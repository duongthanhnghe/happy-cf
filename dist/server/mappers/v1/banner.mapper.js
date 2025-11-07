export function toBannerDTO(entity) {
    return {
        id: entity._id.toString(),
        title: entity.title,
        description: entity.description,
        image: entity.image,
        order: entity.order,
        isActive: entity.isActive,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}
export const toBannerListDTO = (banners) => {
    return banners.map(toBannerDTO);
};
//# sourceMappingURL=banner.mapper.js.map