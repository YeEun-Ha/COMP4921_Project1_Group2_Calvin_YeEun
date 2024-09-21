import * as Cloudinary from 'cloudinary';

class CloudinaryClient {
    constructor() {
        Cloudinary.v2.config({
            secure: true,
        });
        this.client = Cloudinary;
    }

    async uploadImage(imagePath) {
        // Use the uploaded file's name as the asset's public ID and
        // allow overwriting the asset with new versions
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        try {
            // Upload the image
            const result = await this.client.uploader.upload(
                imagePath,
                options
            );
            console.log(result);
            return result.public_id;
        } catch (error) {
            console.error(error);
        }
    }

    async uploadFile(filePath, fileType = 'raw') {
        // Specify the resource type based on the file type being uploaded
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: fileType, // 'raw' for files (e.g., PDF, ZIP), 'video' for video files
        };

        try {
            // Upload the file
            const result = await Cloudinary.v2.uploader.upload(
                filePath,
                options
            );
            console.log(result);
            return result.public_id;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw error;
        }
    }
}

export default new CloudinaryClient();
