import { json } from '@remix-run/node';
import { getUser } from '../server/models/usersModel.js';
import { updateContentStatus } from '../server/controllers/dashbordController.js';

export const action = async ({ context, request }) => {
    const authenticated = context.session.authenticated;
    const userId = Number(context.session.userId);
    const formData = await request.formData();
    const contentUserId = Number(formData.get('userId'));
    const active = formData.get('active');
    const urlId = formData.get('urlId');

    if (userId != contentUserId) {
        return json({ success: false, message: 'Not authorized to do that!' });
    }

    const result = await updateContentStatus({ urlId, userId, active });

    if (result) {
        return json({
            success: true,
            message: 'active status successfully updated',
        });
    }
    return null;
};
