import type { Request, Response } from "express";
import { getViettelToken } from "../orderController";

const BASE_URL = "https://partner.viettelpost.vn/v2/categories";

/**
 * 🔹 Lấy danh sách Tỉnh/TP
 */
export const getAllProvinces = async (_: Request, res: Response) => {
  try {
    const token = await getViettelToken();

    const response = await fetch(`${BASE_URL}/listProvinceById?provinceId=-1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
    });

    const result = await response.json();
    console.log("📦 Province result:", result);

    if (!response.ok || result.status !== 200) {
      throw new Error(result.message || "Không thể lấy danh sách Tỉnh/TP");
    }

    return res.json({ code: 0, data: result.data });
  } catch (err: any) {
    console.error("❌ getAllProvinces error:", err.message);
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy danh sách Tỉnh/TP",
      error: err.message,
    });
  }
};

/**
 * 🔹 Lấy danh sách Quận/Huyện theo Province
 */
export const getDistrictsByProvince = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;

    if (!provinceId) {
      return res.status(400).json({ code: 1, message: "Thiếu provinceId" });
    }

    const token = await getViettelToken();

    const response = await fetch(`${BASE_URL}/listDistrict?provinceId=${provinceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
    });

    const result = await response.json();
    console.log("📦 District result:", result);

    if (!response.ok || result.status !== 200) {
      throw new Error(result.message || "Không thể lấy danh sách Quận/Huyện");
    }

    return res.json({ code: 0, data: result.data });
  } catch (err: any) {
    console.error("❌ getDistrictsByProvince error:", err.message);
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy danh sách Quận/Huyện",
      error: err.message,
    });
  }
};

/**
 * 🔹 Lấy danh sách Phường/Xã theo District
 */
export const getWardsByDistrict = async (req: Request, res: Response) => {
  try {
    const { districtId } = req.params;

    if (!districtId) {
      return res.status(400).json({ code: 1, message: "Thiếu districtId" });
    }

    const token = await getViettelToken();

    const response = await fetch(`${BASE_URL}/listWards?districtId=${districtId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
    });

    const result = await response.json();
    console.log("📦 Ward result:", result);

    if (!response.ok || result.status !== 200) {
      throw new Error(result.message || "Không thể lấy danh sách Phường/Xã");
    }

    return res.json({ code: 0, data: result.data });
  } catch (err: any) {
    console.error("❌ getWardsByDistrict error:", err.message);
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy danh sách Phường/Xã",
      error: err.message,
    });
  }
};

/**
 * 🔹 Lấy chi tiết Tỉnh/TP
 */
export const getProvinceDetail = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;
    if (!provinceId) {
      return res.status(400).json({ code: 1, message: "Thiếu provinceId" });
    }

    const token = await getViettelToken();

    const response = await fetch(`${BASE_URL}/listProvinceById?provinceId=${provinceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
    });

    const result = await response.json();

    if (!response.ok || result.status !== 200 || !result.data?.length) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy Tỉnh/TP" });
    }

    return res.json({ code: 0, data: result.data[0] });
  } catch (err: any) {
    console.error("❌ getProvinceDetail error:", err.message);
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy chi tiết Tỉnh/TP",
      error: err.message,
    });
  }
};

/**
 * 🔹 Lấy chi tiết Quận/Huyện
 */
export const getDistrictDetail = async (req: Request, res: Response) => {
  try {
    const { districtId } = req.params;
    if (!districtId) {
      return res.status(400).json({ code: 1, message: "Thiếu districtId" });
    }

    const token = await getViettelToken();

    const response = await fetch(`${BASE_URL}/listDistrict?provinceId=-1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
    });

    const result = await response.json();

    if (!response.ok || result.status !== 200) {
      throw new Error("Không thể lấy danh sách Quận/Huyện");
    }

    const district = result.data.find(
      (d: any) => String(d.DISTRICT_ID) === String(districtId)
    );

    if (!district) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy Quận/Huyện" });
    }

    return res.json({ code: 0, data: district });
  } catch (err: any) {
    console.error("❌ getDistrictDetail error:", err.message);
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy chi tiết Quận/Huyện",
      error: err.message,
    });
  }
};

/**
 * 🔹 Lấy chi tiết Phường/Xã
 */
export const getWardDetail = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    const districtId = req.query.districtId as string | undefined;

    if (!wardId) {
      return res.status(400).json({ code: 1, message: "Thiếu wardId" });
    }

    const token = await getViettelToken();

    const url = districtId
      ? `${BASE_URL}/listWards?districtId=${districtId}`
      : `${BASE_URL}/listWards?districtId=-1`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": token,
      },
    });

    const result = await response.json();

    if (!response.ok || result.status !== 200) {
      throw new Error("Không thể lấy danh sách Phường/Xã");
    }

    const ward = result.data.find(
      (w: any) => String(w.WARDS_ID) === String(wardId)
    );

    if (!ward) {
      return res.status(404).json({ code: 1, message: "Không tìm thấy Phường/Xã" });
    }

    return res.json({ code: 0, data: ward });
  } catch (err: any) {
    console.error("❌ getWardDetail error:", err.message);
    return res.status(500).json({
      code: 1,
      message: "Lỗi khi lấy chi tiết Phường/Xã",
      error: err.message,
    });
  }
};
