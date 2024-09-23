import cloudinary from '../services/cloudinary';
import { json } from '@remix-run/node';
import { getUser } from '../server/models/usersModel.js';
import { addContent } from '../server/models/urlModel.js';

export const action = async ({ context, request }) => {
    const formData = await request.formData();
    // const userId = context.session.userId;
    const userId = 1;
    console.log(context);
    // const username = context.session.username;
    // const authenticated = context.session.authenticated;
    // const result = await getUser({ username: username });

    // if (!authenticated)
    //     return json({ success: false, message: 'unauthenticated request' });

    const contentType = Number(formData.get('contentType'));
    const createdAt = new Date(Date.now()).toISOString().split('T')[0];
    console.log(contentType);
    if (contentType === 1) {
        console.log('Uploading image...');
        const imageFile = formData.get('file');
        if (imageFile instanceof File)
            return json({
                success: false,
                message: 'Uploaded image is not a valid file type',
            });
        cloudinary.uploadFile(imageFile, 'file');
    } else if (contentType === 2) {
        console.log('Uploading text content');
        const data = formData.get('text');
        const result = await addContent({
            urlId: data,
            content: data,
            contentType: contentType,
            createdAt: createdAt,
        });
    } else if (contentType === 3) {
        console.log('Existing URL! ');
    }

    return json({ success: true, contenType: contentType });
    //insert data to mysql table

    // if an image, upload to cloudinary
    // insert to mysql table for users
};
