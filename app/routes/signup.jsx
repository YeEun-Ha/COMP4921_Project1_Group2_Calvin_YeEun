import { useActionData, useNavigate } from '@remix-run/react';
import { SignUpForm } from '../components/signup';
import { signUpUser } from '../server/controllers/userController';
import { useEffect, useState } from 'react';
import { json } from '@remix-run/node';

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
    return json({ ...result });
};

export default function SignUpPage() {
    const actionData = useActionData();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPopoverOpen, setOpen] = useState(false);
    useEffect(() => {
        if (actionData?.success) {
            setLoading(false);
            navigate('/login');
        } else if (actionData?.errors) {
            setOpen(true);
            setLoading(false);
        }
    }, [actionData, navigate]);

    return <SignUpForm actionData={actionData}></SignUpForm>;
}
