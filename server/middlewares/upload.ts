import multer from 'multer'
export const uploadImageMulter = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB / file
    files: 50,                // tối đa 50 file
  },
  fileFilter: (_req, file, cb) => {
    const allowTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/avif'
    ]

    if (!allowTypes.includes(file.mimetype)) {
      cb(new Error('Chỉ chấp nhận JPG / JPEG / PNG / AVIF'))
    } else {
      cb(null, true)
    }
  }
})