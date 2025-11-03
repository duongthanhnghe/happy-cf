import express from "express";
import { getAllProvinces, getDistrictsByProvince, getWardsByDistrict, getProvinceDetail, getDistrictDetail, getWardDetail } from '../../../controllers/v1/shared/locationController.js';
const router = express.Router();
router.get("/provinces", getAllProvinces);
router.get("/provinces/:provinceId", getProvinceDetail);
router.get("/districts/:provinceId", getDistrictsByProvince);
router.get("/district/:districtId", getDistrictDetail);
router.get("/wards/:districtId", getWardsByDistrict);
router.get("/ward/:wardId", getWardDetail);
export default router;
//# sourceMappingURL=locationRouter.js.map