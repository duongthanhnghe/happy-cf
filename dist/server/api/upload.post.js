import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: useRuntimeConfig().public.cloudinaryCloudName,
    api_key: useRuntimeConfig().cloudinaryApiKey,
    api_secret: useRuntimeConfig().cloudinaryApiSecret,
});
export default defineEventHandler(async (event) => {
    try {
        const body = await readMultipartFormData(event);
        const file = body === null || body === void 0 ? void 0 : body.find(item => item.name === 'file');
        if (!file) {
            throw createError({
                statusCode: 400,
                statusMessage: 'No file uploaded'
            });
        }
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'products', // Tự động tạo folder
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(file.data);
        });
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };
    }
    catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        });
    }
});
//# sourceMappingURL=upload.post.js.map