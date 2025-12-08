export const toTranslationDTO = (entity) => {
    return {
        id: entity._id.toString(),
        key: entity.key,
        type: entity.type,
        translations: entity.translations || {},
    };
};
export const toTranslationListDTO = (items) => {
    return items.map(toTranslationDTO);
};
//# sourceMappingURL=itranslation.mapper.js.map