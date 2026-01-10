import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import type { Request, Response } from 'express'

const MAX_USER_STORAGE = 3 * 1024 * 1024 // 3MB

const getFolderTotalSize = async (folder: string): Promise<number> => {
  let total = 0
  let nextCursor: string | undefined

  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
      next_cursor: nextCursor,
    })

    for (const r of res.resources) {
      total += r.bytes
    }

    nextCursor = res.next_cursor
  } while (nextCursor)

  return total
}

export const getImages = async (req: Request, res: Response) => {
  try {
    const { folder, max_results, next_cursor } = req.query

    if (!folder) {
      return res.status(400).json({
        success: false,
        message: 'Missing folder name',
      })
    }

    const options: any = {
      type: 'upload',
      prefix: folder,
      max_results: Number(max_results),
      resource_type: 'image',
    }

    if (next_cursor) {
      options.next_cursor = next_cursor
    }

    const result = await cloudinary.api.resources(options)

    return res.status(200).json({
      success: true,
      images: result.resources.map((item: any) => ({
        url: item.secure_url,
        public_id: item.public_id,
        format: item.format,
        created_at: item.created_at,
        bytes: item.bytes,
        width: item.width,
        height: item.height,
      })),
      next_cursor: result.next_cursor ?? null,
    })
  } catch (err: any) {
    console.error('Get images error:', err)
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to get images',
    })
  }
}

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.query
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' })
    }

    const decodedId = decodeURIComponent(publicId as string)
    const result = await cloudinary.uploader.destroy(decodedId)

    return res.status(200).json({ success: true, data: result })
  } catch (err: any) {
    console.error('Delete image error:', err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// export const searchImage = async (req: Request, res: Response) => {
//   try {
//     const { url, folder } = req.query

//     if (!url) {
//       return res.status(400).json({ success: false, message: 'url (keyQuery) is required' })
//     }

//     const keyQuery = decodeURIComponent(url as string)
//     const folderPath = folder ? decodeURIComponent(folder as string) : undefined

//     const result = await cloudinary.api.resources({
//       type: 'upload',
//       prefix: folderPath,
//       max_results: 50,
//     })

//     const filtered = result.resources.filter((item: any) =>
//       item.secure_url.includes(keyQuery)
//     )

//     return res.status(200).json({ success: true, data: filtered })
//   } catch (err: any) {
//     console.error('Search image error:', err)
//     return res.status(500).json({ success: false, message: err.message })
//   }
// }

export const searchImage = async (req: Request, res: Response) => {
  try {
    const { url, folder } = req.query

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'url (keyQuery) is required',
      })
    }

    const keyQuery = String(url)
    const folderPath = folder ? String(folder).replace(/\/+$/, '') : undefined

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 100,
    })

    const filtered = result.resources.filter((item: any) =>
      item.secure_url.includes(keyQuery)
    )

    return res.status(200).json({
      success: true,
      data: filtered,
    })
  } catch (err: any) {
    console.error('Search image error:', err)
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  const userId = req.body?.userId;

  try {
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const folder = userId
      ? `Member/member${userId}`
      : req.body.folder || "Default";

    if (userId) {
      const currentSize = await getFolderTotalSize(folder)

      const uploadSize = (req.files as Express.Multer.File[])
        .reduce((sum, f) => sum + f.size, 0)

      if (currentSize + uploadSize > MAX_USER_STORAGE) {
        for (const file of req.files as Express.Multer.File[]) {
          fs.unlinkSync(file.path)
        }

        return res.status(400).json({
          success: false,
          message: 'Dung lượng ảnh của bạn đã vượt quá 3MB',
        })
      }
    }

    const uploadedFiles: any[] = [];

    for (const file of req.files as Express.Multer.File[]) {
      const originalName = path.parse(file.originalname).name;
      let publicId = originalName;
      let attempt = 0;

      while (true) {
        const exists = await cloudinary.api.resource(`${folder}/${publicId}`)
          .then(() => true)
          .catch(() => false);

        if (!exists) break;
        attempt++;
        publicId = `${originalName}(${attempt})`;
      }

      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder,
        use_filename: false,
        unique_filename: false,
        resource_type: "image",
        public_id: publicId,
      });

      fs.unlinkSync(file.path);

      uploadedFiles.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        format: uploaded.format,
        created_at: uploaded.created_at,
        bytes: uploaded.bytes,
        width: uploaded.width,
        height: uploaded.height,
        folder,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }
};