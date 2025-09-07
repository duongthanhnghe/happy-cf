export function toAboutDTO(entity) {
    return {
        id: entity._id.toString(),
        title: entity.title,
        description: entity.description,
        summaryContent: entity.summaryContent,
        image: entity.image,
        listImage: entity.listImage,
        order: entity.order,
        isActive: entity.isActive,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}
export const toAboutListDTO = (about) => {
    return about.map(toAboutDTO);
};
//# sourceMappingURL=aboutMapper.js.map