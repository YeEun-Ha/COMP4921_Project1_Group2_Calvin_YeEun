import { redirect, json } from '@remix-run/node';

export const action = async ({ request, context }) => {
    const formData = await request.formData();
    const userId = formData.get('userId');

    if (context.session.userId == userId && context.session.authenticated) {
        context.session
            .destroy()
            .then(() => {
                redirect('/');
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return null;
};
