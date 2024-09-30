import { json, useActionData, useNavigate } from '@remix-run/react';
import { LoginForm } from '../components/login';
import { postLogin } from '../server/controllers/authController';
import { useEffect } from 'react';

export const action = async ({ request, context }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    const userPayload = {
        username: username,
        password: password,
    };

    const result = await postLogin(userPayload);
    if (result?.success) {
        console.log('Login successfuly');
        context.session.userId = Number(result.userID);
        context.session.username = result.username;
        context.session.authenticated = true;
        context.session.cookie.maxAge = result.expiry;
        return json({ success: true, message: 'User successfully logged in' });
    }
    return json({ success: false, message: result?.message });
};

export default function LoginPage() {
    const actionData = useActionData();
    const navigate = useNavigate();

    useEffect(() => {
        if (actionData?.success) {
            navigate('/dashboard');
        }
    }, [actionData, navigate]);
    return <LoginForm actionData={actionData}></LoginForm>;
}
