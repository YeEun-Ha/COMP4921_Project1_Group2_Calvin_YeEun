import { SignUpForm } from '../components/signup';
import { signUpUser } from '../server/controllers/userController';
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

    await signUpUser(payload);
};

export default function SignUpPage() {
    return <SignUpForm></SignUpForm>;
}
