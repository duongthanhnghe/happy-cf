import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import type { Request, Response } from 'express'

export const getImages = async (req: Request, res: Response) => {
  try {
    const { folder, max_results = 10, next_cursor } = req.query

    if (!folder) {
      return res.status(400).json({
        success: false,
        message: 'Missing folder name'
      })
    }

    // const result = await cloudinary.api.resources({
    //   type: 'upload',
    //   prefix: `${folder}/`,
    //   max_results: Number(max_results) || 10,
    //   next_cursor: next_cursor as string | undefined,
    //   direction: 'desc'
    // })

    const search = cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(Number(max_results) || 10)

    if (next_cursor) {
      search.next_cursor(next_cursor as string)
    }

    const result = await search.execute()

    return res.status(200).json({
      success: true,
      images: result.resources.map((item: any) => ({
        url: item.secure_url,
        public_id: item.public_id,
        format: item.format,
        created_at: item.created_at,
        bytes: item.bytes,
        width: item.width,
        height: item.height
      })),
      next_cursor: result.next_cursor || null
    })
  } catch (err: any) {
    console.error('Get images error:', err)
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to get images'
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
      data: tree
    })
  } catch (err: any) {
    console.error("Get folders tree error:", err)
    return res
      .status(500)
      .json({ success: false, message: err.message })
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

export const searchImage = async (req: Request, res: Response) => {
  try {
    const { url, folder } = req.query

    if (!url) {
      return res.status(400).json({ success: false, message: 'url (keyQuery) is required' })
    }

    const keyQuery = decodeURIComponent(url as string)
    const folderPath = folder ? decodeURIComponent(folder as string) : undefined

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 500,
    })

    const filtered = result.resources.filter((item: any) =>
      item.secure_url.includes(keyQuery)
    )

    return res.status(200).json({ success: true, data: filtered })
  } catch (err: any) {
    console.error('Search image error:', err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  let userId = req.body?.userId
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const folder = userId
      ? `Member/member${userId}`
      : req.body.folder || "Default"

    const originalName = path.parse(req.file.originalname).name
    let publicId = originalName
    let attempt = 0

    while (true) {
      const exists = await cloudinary.api.resource(`${folder}/${publicId}`)
        .then(() => true)
        .catch(() => false)

      if (!exists) break
      attempt++
      publicId = `${originalName}(${attempt})`
    }

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder,
      use_filename: false,
      unique_filename: false,
      resource_type: "image",
      public_id: publicId,
    })

    fs.unlinkSync(req.file.path)

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
      folder
    })
  } catch (err: any) {
    console.error("Upload error:", err)
    return res.status(500).json({
      success: false,
      message: err.message || "Upload failed"
    })
  }
}


