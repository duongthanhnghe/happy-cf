import type { ITranslation } from "../../models/v1/itranslation.entity";
import type { TranslationDTO } from "../../types/dto/v1/itranslation.dto";

export const toTranslationDTO = (entity: ITranslation): TranslationDTO => {
  return {
    id: entity._id.toString(),
    key: entity.key,
    type: entity.type,
    translations: entity.translations || {},
  };
};

export const toTranslationListDTO = (items: ITranslation[]): TranslationDTO[] => {
  return items.map(toTranslationDTO)
}
