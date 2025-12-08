import type { PaginationDTO } from '../../common/pagination.dto'

export interface TranslationDTO {
  id: string;
  key: string;
  type: "text" | "html";
  translations: Record<string, string>;
}

export interface ITranslationText {
  type: "text" | "html";
  text: string
}

export interface TranslationCreateDTO {
  key: string;
  type: "text" | "html";
  translations: Record<string, string>;
}

export interface TranslationUpdateDTO {
  key?: string;
  type: "text" | "html";
  translations: Record<string, string>;
}

export type TranslationPaginationDTO = PaginationDTO<TranslationDTO>
