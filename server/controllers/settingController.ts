import fs from "fs"
import path from "path"
import type { Request, Response } from "express"

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const filePath = path.join(process.cwd(), "public/data/settings.json")

    const oldData = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const newData = { ...oldData, ...(req.body || {}) }

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8")

    return res.json({ code: 0, message: "Cập nhật thành công", data: newData })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

