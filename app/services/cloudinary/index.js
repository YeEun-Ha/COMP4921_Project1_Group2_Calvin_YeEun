import * as Cloudinary from 'cloudinary';

class CloudinaryClient {
    constructor() {
        Cloudinary.v2.config({
            secure: true,
        });
        this.client = Cloudinary;
    }
    // Helper function to convert file to a buffer
    async streamToBuffer(file) {
        const arrayBuffer = await file.arrayBuffer(); // Get the file content as ArrayBuffer
        return Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer
    }

    async uploadImagePath(imagePath) {
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

    async uploadFile(file, fileType = 'raw') {
        // Specify the resource type based on the file type being uploaded
        const buffer = await this.streamToBuffer(file);
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: fileType, // 'raw' for files (e.g., PDF, ZIP), 'video' for video files
        };

        try {
            const result = Cloudinary.v2.uploader
                .upload_stream({ resource_type: 'image' })
                .end(buffer);
            return result.public_id;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw error;
        }
    }
}

export default new CloudinaryClient();
