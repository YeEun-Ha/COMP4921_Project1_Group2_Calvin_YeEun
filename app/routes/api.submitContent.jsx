import cloudinary from '../services/cloudinary';

export const action = async ({ context, request }) => {
    console.log('API HIT');
    console.log(context);
    console.log(request);
    const data = await request.json();
    const content = data.content;
    console.log(data);

    cloudinary.uploadFile(content);
    // verify user and logged includes;
    // submit with user identification

    //insert data to mysql table

    // if an image, upload to cloudinary
    // insert to mysql table for users
};
