import { json } from '@remix-run/react';
import { useActionData, useNavigate } from '@remix-run/react';
import { SignUpForm } from '../components/signup';
import { signUpUser } from '../server/controllers/userController';
import { useEffect, useState } from 'react';

export const loader = async () => {
    return null;
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    const payload = {
        username: username,
        password: password,
    };

    const result = await signUpUser(payload);

    if (result.success) {
        console.log('GOOD');
        return json({ success: true });
    }

    return json({ success: false, error: 'Sign up failed' }, { status: 400 });
};

export default function SignUpPage() {
    const actionData = useActionData();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPopoverOpen, setOpen] = useState(false);

    useEffect(() => {
        if (actionData?.success) {
            setLoading(false);
            navigate('/dashboard');
        } else if (actionData?.error) {
            setOpen(true);
            setLoading(false);
        }
    }, [actionData, navigate]);

    return (
        <SignUpForm
            loading={loading}
            setLoading={setLoading}
            open={isPopoverOpen}
            setOpen={setOpen}
        ></SignUpForm>
    );
}
