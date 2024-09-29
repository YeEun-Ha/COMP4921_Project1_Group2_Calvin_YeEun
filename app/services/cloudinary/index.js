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

        try {
            const result = new Promise((resolve, reject) => {
                const stream = Cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'image', use_filename: true },
                    (error, result) => {
                        if (error) {
                            console.error(
                                'Error uploading to Cloudinary:',
                                error
                            );
                            return reject(error); // Reject the promise if there's an error
                        }

                        console.log('Upload successful:', result); // Log the result from Cloudinary
                        resolve(result?.url);
                    }
                );

                stream.end(buffer); // Pass the buffer to the stream and signal the end of the stream
            });

            return result;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw error;
        }
    }
}

export default new CloudinaryClient();
