import cloudinary from '../services/cloudinary';
import { json } from '@remix-run/node';
import { getUser } from '../server/models/usersModel.js';
import { addContent } from '../server/models/urlModel.js';

export const action = async ({ context, request }) => {
    const formData = await request.formData();
    // const userId = context.session.userId;
    const userId = 1;
    console.log('from request, context--->', context);

    // const username = context.session.username;
    // const authenticated = context.session.authenticated;
    // const result = await getUser({ username: username });

    // if (!authenticated)
    //     return json({ success: false, message: 'unauthenticated request' });

    console.log(`from request, formData--->`, formData);
    const contentType = Number(formData.get('contentType'));
    const createdAt = new Date(Date.now()).toISOString().split('T')[0];
    console.log('contentType-->', contentType);
    const urlID = formData.get('urlID')

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
        const data = formData.get('text'); 
        console.log('Uploading text content. data:', data);

        const result = await addContent({
            urlId: urlID,
            content: data,
            contentType: contentType,
            createdAt: createdAt,
        });
    } else if (contentType === 3) {
        const url = formData.get('url');
        console.log('Uploading URL. URL:', url);

        // Validate the URL format (you can use a regex or a library for better validation)
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(url)) {
            return json({
                success: false,
                message: 'Invalid URL format',
            });
        }
        await addContent({
            urlId: urlID,
            content: url, // Store the URL in the content field
            contentType: contentType,
            createdAt: createdAt,
        });
    }

    return json({ success: true, contenType: contentType });
    //insert data to mysql table

    // if an image, upload to cloudinary
    // insert to mysql table for users
};
