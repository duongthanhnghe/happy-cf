import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
export const getImages = async (req, res) => {
    try {
        const { folder, max_results = 10, next_cursor } = req.query;
        if (!folder) {
            return res.status(400).json({
                success: false,
                message: 'Missing folder name'
            });
        }
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `${folder}/`,
            max_results: Number(max_results) || 10,
            next_cursor: next_cursor
        });
        return res.status(200).json({
            success: true,
            images: result.resources.map((item) => ({
                url: item.secure_url,
                public_id: item.public_id,
                format: item.format,
                created_at: item.created_at,
                bytes: item.bytes,
                width: item.width,
                height: item.height
            })),
            next_cursor: result.next_cursor || null
        });
    }
    catch (err) {
        console.error('Get images error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to get images'
        });
    }
};
const getSubFolders = async (folderPath = "") => {
    let result;
    if (!folderPath) {
        result = await cloudinary.api.root_folders();
    }
    else {
        result = await cloudinary.api.sub_folders(folderPath);
    }
    const folders = result.folders || [];
    const tree = await Promise.all(folders.map(async (f) => {
        const fullPath = folderPath ? `${folderPath}/${f.name}` : f.name;
        const id = f.external_id || fullPath;
        const segments = fullPath.split("/");
        const children = await getSubFolders(fullPath);
        return {
            id,
            title: f.name,
            path: fullPath,
            segments,
            children
        };
    }));
    return tree;
};
export const getFolders = async (_req, res) => {
    try {
        const tree = await getSubFolders();
        return res.status(200).json({
            success: true,
            data: tree
        });
    }
    catch (err) {
        console.error("Get folders tree error:", err);
        return res
            .status(500)
            .json({ success: false, message: err.message });
    }
};
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.query;
        if (!publicId) {
            return res.status(400).json({ success: false, message: 'publicId is required' });
        }
        const decodedId = decodeURIComponent(publicId);
        const result = await cloudinary.uploader.destroy(decodedId);
        return res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        console.error('Delete image error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
export const searchImage = async (req, res) => {
    try {
        const { url, folder } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: 'url (keyQuery) is required' });
        }
        const keyQuery = decodeURIComponent(url);
        const folderPath = folder ? decodeURIComponent(folder) : undefined;
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: folderPath,
            max_results: 500,
        });
        const filtered = result.resources.filter((item) => item.secure_url.includes(keyQuery));
        return res.status(200).json({ success: true, data: filtered });
    }
    catch (err) {
        console.error('Search image error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
export const uploadImage = async (req, res) => {
    var _a;
    let userId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        // Lấy folder từ body, nếu không có mặc định "Default"
        // const folder = req.body.folder || 'Default'
        // Nếu có userId -> upload vào Member/member_{userId}
        // Nếu không có -> dùng folder trong body (hoặc Default)
        const folder = userId
            ? `Member/member${userId}`
            : req.body.folder || "Default";
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder, // upload vào folder tùy chọn
            use_filename: true,
            unique_filename: true,
            resource_type: 'image'
        });
        // Xoá file tạm sau khi upload
        fs.unlinkSync(req.file.path);
        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id,
            folder: folder
        });
    }
    catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Upload failed'
        });
    }
};
//# sourceMappingURL=uploadController.js.map