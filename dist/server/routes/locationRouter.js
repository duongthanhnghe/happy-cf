import express from "express";
import { getAllProvinces, getDistrictsByProvince, getWardsByDistrict, getProvinceDetail, getDistrictDetail, getWardDetail } from "../controllers/locationController.js";
const router = express.Router();
router.get("/provinces", getAllProvinces);
router.get("/provinces/:provinceCode", getProvinceDetail);
router.get("/districts/:provinceCode", getDistrictsByProvince);
router.get("/district/:districtCode", getDistrictDetail);
router.get("/wards/:districtCode", getWardsByDistrict);
router.get("/ward/:wardCode", getWardDetail);
export default router;
//# sourceMappingURL=locationRouter.js.map