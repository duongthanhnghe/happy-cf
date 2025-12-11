import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcel = multer({
  storage,
  // fileFilter: (req, file, cb) => {
  //   if (
  //     file.mimetype ===
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
  //     file.mimetype === "application/vnd.ms-excel"
  //   ) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Chỉ hỗ trợ file Excel"), false);
  //   }
  // },
  fileFilter: (req, file, cb) => {
    const isExcel =
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel";

    if (isExcel) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ file Excel") as any, false);
    }
  }
}).single("file");
