import type { Request, Response } from "express";
import { BaseInformationEntity } from "../../models/v1/base-information.entity";
import { toBaseInformationDTO } from "../../mappers/v1/base-information.mapper";

export const getBaseInformation = async (_: Request, res: Response) => {
  try {
    const item = await BaseInformationEntity.findOne();

    if (!item) {
      return res.status(404).json({ code: 1, message: "Chưa có thông tin cơ bản" });
    }

    return res.json({ code: 0, data: toBaseInformationDTO(item) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
