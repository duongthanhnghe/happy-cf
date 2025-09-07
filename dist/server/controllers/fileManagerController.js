import fs from 'fs-extra';
import path from 'path';
import mime from 'mime-types';
import multer from 'multer';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '../../../uploads');
// Đảm bảo thư mục tồn tại
fs.ensureDirSync(ROOT_DIR);
// 🎯 Load thư mục & file
export const loadFiles = async (req, res) => {
    console.log('Request body 123:', req.body);
    const relPath = req.body.path || '/';
    const absPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(absPath)) {
        return res.status(404).json({ error: 'Path not found' });
    }
    const items = await fs.readdir(absPath);
    const files = await Promise.all(items.map(async (item) => {
        const itemPath = path.join(absPath, item);
        const stat = await fs.stat(itemPath);
        return {
            name: item,
            isFile: stat.isFile(),
            size: stat.size,
            dateModified: stat.mtime,
            type: stat.isFile() ? mime.lookup(itemPath) || 'text/plain' : '',
        };
    }));
    res.json({ files });
};
// 📦 Multer upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetPath = path.join(ROOT_DIR, req.body.path || '/');
        fs.ensureDirSync(targetPath);
        cb(null, targetPath);
    },
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });
export const uploadFiles = [
    upload.array('uploadFiles'), // ← dùng đúng field này
    (req, res) => {
        const files = req.files;
        const targetPath = req.body.path; // ví dụ: '/'
        console.log('✅ Uploaded files:', files);
        console.log('📂 Target path:', targetPath);
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        res.json({
            success: true,
            files: files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype
            }))
        });
    }
];
export const handleFileManager = async (req, res) => {
    const action = req.body.action;
    const relPath = req.body.path || '/';
    const absPath = path.join(ROOT_DIR, relPath);
    switch (action) {
        case 'read': {
            try {
                if (!fs.existsSync(absPath))
                    return res.status(404).json({ error: 'Path not found' });
                const items = await fs.readdir(absPath);
                const files = await Promise.all(items.map(async (item) => {
                    const itemPath = path.join(absPath, item);
                    const stat = await fs.stat(itemPath);
                    return {
                        name: item,
                        isFile: stat.isFile(),
                        size: stat.size,
                        hasChild: stat.isDirectory(),
                        dateModified: stat.mtime,
                        type: stat.isFile() ? path.extname(item).replace('.', '') : 'Folder'
                    };
                }));
                const cwd = {
                    name: path.basename(absPath),
                    isFile: false,
                    size: 0,
                    dateModified: new Date(),
                    type: ''
                };
                res.json({ cwd, files });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error reading directory' });
            }
            break;
        }
        case 'delete': {
            try {
                const items = req.body.names || [];
                await Promise.all(items.map(async (item) => {
                    const itemPath = path.join(absPath, item);
                    if (fs.existsSync(itemPath))
                        await fs.remove(itemPath);
                }));
                res.json({ success: true });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to delete files' });
            }
            break;
        }
        default:
            res.status(400).json({ error: 'Unsupported action' });
    }
};
// ⬇️ Tải file
export const downloadFile = (req, res) => {
    const filePath = path.join(ROOT_DIR, req.query.path);
    if (!fs.existsSync(filePath))
        return res.status(404).send('File not found');
    res.download(filePath);
};
// 🖼️ Lấy ảnh
export const getImage = (req, res) => {
    const imagePath = path.join(ROOT_DIR, req.query.path);
    if (!fs.existsSync(imagePath))
        return res.status(404).send('Image not found');
    const mimeType = mime.lookup(imagePath) || 'image/png';
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(imagePath).pipe(res);
};
//# sourceMappingURL=fileManagerController.js.map