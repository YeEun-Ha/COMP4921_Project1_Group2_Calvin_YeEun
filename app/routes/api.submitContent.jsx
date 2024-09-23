// 클라우드 업로드 및 DB 저장

import cloudinary from '../services/cloudinary';
import { json } from '@remix-run/node';
import { getUser } from '../server/models/usersModel.js';
import { addContent } from '../server/models/urlModel.js';

export const action = async ({ context, request }) => { 
    // context: 서버 컨텍스트로, 사용자의 세션 정보나 기타 중요 데이터.
    // request: 사용자가 보낸 요청 데이터(폼 데이터 등)를 포함합니다.

    const formData = await request.formData(); // 사용자가 제출한 폼 데이터를 가져옴
    // const userId = context.session.userId; // context.session: 현재 세션에서 사용자 정보를 가져옴
    const userId = 1; // context.session: 현재 세션에서 사용자 정보를 가져옴
    console.log('from request, context--->', context);

    // const username = context.session.username;
    // const authenticated = context.session.authenticated;
    // const result = await getUser({ username: username }); // DB에서 사용자 정보를 가져옴. 

    // 인증되지 않은 사용자가 요청한 경우, JSON 응답으로 실패 메시지를 반환.
    // if (!authenticated)
    //     return json({ success: false, message: 'unauthenticated request' });

    console.log(`from request, formData--->`, formData)
    const contentType = Number(formData.get('contentType'));
    const createdAt = new Date(Date.now()).toISOString().split('T')[0]; // 현재 날짜를 ISO 형식으로 변환하여 YYYY-MM-DD 형태로 저장
    console.log('contentType-->', contentType);
    const urlID = formData.get('urlID')
    
    if (contentType === 1) {
        console.log('Uploading image...');
        const imageFile = formData.get('file'); // 업로드된 파일
        if (imageFile instanceof File)
            return json({
                success: false,
                message: 'Uploaded image is not a valid file type',
            });
        cloudinary.uploadFile(imageFile, 'file');
    } else if (contentType === 2) {
        const data = formData.get('text'); // {text: ..., ...} 이 중 text에 해당하는 value
        console.log('Uploading text content. data:', data);

        const result = await addContent({
            urlId: urlID,
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
