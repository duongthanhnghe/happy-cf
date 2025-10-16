import type { Request, Response } from "express"

const URL_API = 'https://provinces.open-api.vn/api';

export const getAllProvinces = async (_: Request, res: Response) => {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/?depth=1")
    const data = await response.json()
    return res.json({ code: 0, data })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: "Lỗi khi lấy danh sách tỉnh/thành", error: err.message })
  }
}

export const getDistrictsByProvince = async (req: Request, res: Response) => {
  try {
    const { provinceCode } = req.params
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
    const data = await response.json()

    if (!data || !data.districts) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy quận/huyện" })
    }

    return res.json({ code: 0, data: data.districts })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: "Lỗi khi lấy quận/huyện", error: err.message })
  }
}

export const getWardsByDistrict = async (req: Request, res: Response) => {
  try {
    const { districtCode } = req.params
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
    const data = await response.json()

    if (!data || !data.wards) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy xã/phường" })
    }

    return res.json({ code: 0, data: data.wards })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: "Lỗi khi lấy xã/phường", error: err.message })
  }
}

export const getProvinceDetail = async (req: Request, res: Response) => {
  try {
    const { provinceCode } = req.params;
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=1`);
    const data = await response.json();

    if (!data || !data.name) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy tỉnh/thành" });
    }

    return res.json({ code: 0, data });
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy chi tiết tỉnh/thành",
      error: err.message,
    });
  }
};

export const getDistrictDetail = async (req: Request, res: Response) => {
  try {
    const { districtCode } = req.params;
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=1`);
    const data = await response.json();

    if (!data || !data.name) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy quận/huyện" });
    }

    return res.json({ code: 0, data });
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy chi tiết quận/huyện",
      error: err.message,
    });
  }
};

export const getWardDetail = async (req: Request, res: Response) => {
  const { wardCode } = req.params;
  const districtCode = req.query.districtCode as string;

  if (!districtCode) {
    return res.status(400).json({
      code: 1,
      message: "Thiếu districtCode khi tìm xã/phường có mã ngắn",
    });
  }

  try {
    const resp = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const district = await resp.json();

    if (resp.ok && district && Array.isArray(district.wards)) {
      const ward = district.wards.find(
        (w: any) => String(w.code) === String(wardCode)
      );
      if (ward) {
        return res.json({ code: 0, data: ward });
      }
    }

    return res.status(404).json({ code: 1, message: "Không tìm thấy xã/phường" });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: "Lỗi khi lấy chi tiết xã/phường", error: err.message });
  }
};