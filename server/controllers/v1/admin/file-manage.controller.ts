import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import type { Request, Response } from 'express'
import { toFileManageFolderListDTO, toFileManageImageDTO, toFileManageImageListDTO } from "@/server/mappers/v1/file-manage.mapper"

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
      data: toFileManageImageListDTO(result.resources),
      next_cursor: result.next_cursor ?? null,
      limit: Number(max_results),
    })
  } catch (err: any) {
    console.error('Get images error:', err)
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to get images',
    })
  }
}

const getSubFolders = async (folderPath: string = ""): Promise<any[]> => {
  let result

  if (!folderPath) {
    result = await cloudinary.api.root_folders()
  } else {
    result = await cloudinary.api.sub_folders(folderPath)
  }

  const folders = result.folders || []

  const tree = await Promise.all(
    folders.map(async (f: any) => {
      const fullPath = folderPath ? `${folderPath}/${f.name}` : f.name

      const id = f.external_id || fullPath
      const segments = fullPath.split("/")
      const children = await getSubFolders(fullPath)

      return {
        id,
        title: f.name,
        path: fullPath,
        segments,
        children
      }
    })
  )

  return tree
}

export const getFolders = async (_req: Request, res: Response) => {
  try {
    const tree = await getSubFolders()

    return res.status(200).json({
      success: true,
      data: toFileManageFolderListDTO(tree),
      code: 0,
    })
  } catch (err: any) {
    console.error("Get folders tree error:", err)
    return res
      .status(500)
      .json({ success: false, message: err.message, data: [], code: 1 })
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

export const deleteImages = async (req: Request, res: Response) => {
  try {
    const { publicIds } = req.body

    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'publicIds must be a non-empty array',
      })
    }

    const decodedIds = publicIds.map((id: string) =>
      decodeURIComponent(id)
    )

    const result = await cloudinary.api.delete_resources(decodedIds)

    return res.status(200).json({
      success: true,
      result,
    })
  } catch (err: any) {
    console.error('Delete multiple images error:', err)
    return res.status(500).json({
      success: false,
      message: err.message || 'Delete failed',
    })
  }
}

export const searchImage = async (req: Request, res: Response) => {
  try {
    const { url, folder } = req.query

    if (!url) {
      return res.status(400).json({ success: false, message: 'url (keyQuery) is required' })
    }

    const folderPath = folder ? decodeURIComponent(folder as string) : undefined

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 50,
    })

    const filtered = result.resources.filter((item: any) =>
      item.secure_url.includes(String(url))
    )

    return res.status(200).json({
      success: true,
      data: toFileManageImageListDTO(filtered),
    })
  } catch (err: any) {
    console.error('Search image error:', err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const folder = req.body.folder || "Default";

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

      uploadedFiles.push(
        toFileManageImageDTO(uploaded)
      )
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }
};