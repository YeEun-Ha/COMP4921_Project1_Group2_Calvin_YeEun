import { redirect, json } from '@remix-run/node';

export const action = async ({ request, context }) => {
    const formData = await request.formData();
    const userId = formData.get('userId');

    if (context.session.userId == userId && context.session.authenticated) {
        try {
            await context.session.destroy(); // Ensure the session is destroyed first
            return redirect('/'); // Return the redirect after session destruction
        } catch (err) {
            console.log(err);
            return json({ success: false });
        }
    }
    return null;
};
