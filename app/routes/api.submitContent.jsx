import cloudinary from '../services/cloudinary';
import { json } from '@remix-run/node';
import { getUser } from '../server/models/usersModel.js';
import { addContent } from '../server/models/urlModel.js';

export const action = async ({ context, request }) => {
    const formData = await request.formData();
    const userId = context.session.userId;

    const username = context.session.username;
    const authenticated = context.session.authenticated;
    // const result = await getUser({ username: username });

    if (!authenticated)
        return json({ success: false, message: 'unauthenticated request' });

    const contentType = Number(formData.get('contentType'));
    // const createdAt = new Date(Date.now()).toISOString().split('T')[0];
    const createdAt = new Date(Date.now());
    const urlID = formData.get('urlID');

    if (contentType === 1) {
        const imageFile = formData.get('file');
        if (!(imageFile instanceof Blob) || !(imageFile instanceof File)) {
            return json({
                success: false,
                message: 'Uploaded image is not a valid file type',
            });
        }
        const uploadResult = await cloudinary.uploadFile(imageFile, 'file');

        await addContent({
            urlId: uploadResult,
            userId: userId,
            content: uploadResult,
            contentTypeId: contentType,
            createdAt: createdAt,
        });
    } else if (contentType === 2) {
        const data = formData.get('text');

        const result = await addContent({
            urlId: urlID,
            userId: userId,
            content: data,
            contentTypeId: contentType,
            createdAt: createdAt,
        });
    } else if (contentType === 3) {
        const url = formData.get('url');

        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(url)) {
            return json({
                success: false,
                message: 'Invalid URL format',
            });
        }
        await addContent({
            urlId: urlID,
            userId: userId,
            content: url,
            contentTypeId: contentType,
            createdAt: createdAt,
        });
    }

    return json({ success: true, contenType: contentType });
};
